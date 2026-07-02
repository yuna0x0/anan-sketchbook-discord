/**
 * Adjust Session Store
 * In-memory storage for the generation parameters behind each generated image
 * message, so the Adjust/Effects modals can re-render it.
 *
 * Deliberately not persisted: sessions vanish on restart or expiry and the
 * modals then report an expired session. This keeps user content (text,
 * attached images) out of durable storage. Bounded by a sliding TTL, an entry
 * cap, and a byte budget with LRU eviction (the byte budget exists mainly for
 * attached image buffers).
 */

import type { GenerationParams } from "./generationService.js";

export interface AdjustSession {
  /** User who invoked the original command; only they may adjust/delete */
  userId: string;
  params: GenerationParams;
  /** Original attachment (sketchbook content image / dialogue custom background) */
  imageBuffer?: Buffer;
}

export interface SessionStoreOptions<T> {
  ttlMs: number;
  maxEntries: number;
  maxBytes: number;
  sizeOf: (value: T) => number;
  sweepIntervalMs?: number;
}

interface StoredEntry<T> {
  value: T;
  bytes: number;
  expiresAt: number;
}

/**
 * Generic TTL + LRU bounded key-value store.
 * Map insertion order doubles as the LRU order; get() refreshes both the TTL
 * and the recency. Expiry is checked lazily on get(), so the periodic sweep
 * only exists to release memory of never-touched entries.
 */
export class SessionStore<T> {
  private readonly entries = new Map<string, StoredEntry<T>>();
  private readonly options: SessionStoreOptions<T>;
  private bytes = 0;
  private evictions = 0;
  private sweepTimer: NodeJS.Timeout | null = null;

  constructor(options: SessionStoreOptions<T>) {
    this.options = options;
    const sweepIntervalMs = options.sweepIntervalMs ?? 5 * 60 * 1000;
    if (sweepIntervalMs > 0) {
      this.sweepTimer = setInterval(() => this.sweep(), sweepIntervalMs);
      // Never keep the process alive just for the sweep
      this.sweepTimer.unref();
    }
  }

  set(key: string, value: T): void {
    const existing = this.entries.get(key);
    if (existing) {
      this.bytes -= existing.bytes;
      this.entries.delete(key);
    }

    const entryBytes = this.options.sizeOf(value);
    this.entries.set(key, {
      value,
      bytes: entryBytes,
      expiresAt: Date.now() + this.options.ttlMs,
    });
    this.bytes += entryBytes;

    this.evictOverBudget();
  }

  /**
   * Get a session, refreshing its TTL and LRU recency.
   * Returns undefined for missing or expired entries.
   */
  get(key: string): T | undefined {
    const entry = this.entries.get(key);
    if (!entry) {
      return undefined;
    }
    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      this.bytes -= entry.bytes;
      return undefined;
    }

    // Refresh TTL and move to the most-recent end of the Map
    entry.expiresAt = Date.now() + this.options.ttlMs;
    this.entries.delete(key);
    this.entries.set(key, entry);
    return entry.value;
  }

  delete(key: string): void {
    const entry = this.entries.get(key);
    if (entry) {
      this.entries.delete(key);
      this.bytes -= entry.bytes;
    }
  }

  get size(): number {
    return this.entries.size;
  }

  get totalBytes(): number {
    return this.bytes;
  }

  /** Remove expired entries; log eviction stats when anything was dropped */
  sweep(): void {
    const now = Date.now();
    let expired = 0;
    for (const [key, entry] of this.entries) {
      if (entry.expiresAt <= now) {
        this.entries.delete(key);
        this.bytes -= entry.bytes;
        expired++;
      }
    }
    if (expired > 0 || this.evictions > 0) {
      console.log(
        `[${new Date().toISOString()}] Adjust sessions: ${this.entries.size} active, ${Math.round(this.bytes / 1024)} KiB, ${expired} expired, ${this.evictions} evicted since last sweep`,
      );
      this.evictions = 0;
    }
  }

  dispose(): void {
    if (this.sweepTimer) {
      clearInterval(this.sweepTimer);
      this.sweepTimer = null;
    }
    this.entries.clear();
    this.bytes = 0;
  }

  private evictOverBudget(): void {
    while (
      this.entries.size > this.options.maxEntries ||
      this.bytes > this.options.maxBytes
    ) {
      // Oldest (least recently used) entry is first in Map iteration order
      const oldestKey = this.entries.keys().next().value;
      if (oldestKey === undefined) {
        break;
      }
      this.delete(oldestKey);
      this.evictions++;
    }
  }
}

/**
 * Read a positive number from an environment variable, with fallback
 */
function envNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

/** Approximate memory footprint of a session (dominated by image buffers) */
function sessionSizeOf(session: AdjustSession): number {
  const imageBytes = session.imageBuffer?.length ?? 0;
  const paramsBytes = Buffer.byteLength(JSON.stringify(session.params));
  return imageBytes + paramsBytes + 256;
}

/**
 * Singleton store for adjust sessions, keyed by generated message ID.
 * Tunables (all optional): ADJUST_SESSION_TTL_MINUTES (default 1440 = 24h,
 * sliding on use), ADJUST_SESSION_MAX_MB (default 64),
 * ADJUST_SESSION_MAX_ENTRIES (default 200).
 */
export const adjustSessions = new SessionStore<AdjustSession>({
  ttlMs: envNumber("ADJUST_SESSION_TTL_MINUTES", 1440) * 60 * 1000,
  maxEntries: envNumber("ADJUST_SESSION_MAX_ENTRIES", 200),
  maxBytes: envNumber("ADJUST_SESSION_MAX_MB", 64) * 1024 * 1024,
  sizeOf: sessionSizeOf,
});
