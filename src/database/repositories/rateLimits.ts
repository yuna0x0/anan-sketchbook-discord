/**
 * Rate Limits Repository
 * Handles CRUD operations for rate limit settings and usage tracking.
 * Supports per-guild and per-command rate limiting.
 */

import { getDatabase } from "../index.js";
import { getOrCreateGuildSettings } from "./guildSettings.js";

export interface RateLimitSetting {
  id: number;
  guild_id: string;
  command_name: string | null;
  max_uses: number;
  window_seconds: number;
  created_at: string;
  updated_at: string;
}

interface RateLimitSettingRow {
  id: number;
  guild_id: string;
  command_name: string | null;
  max_uses: number;
  window_seconds: number;
  created_at: string;
  updated_at: string;
}

interface RateLimitUsage {
  id: number;
  guild_id: string;
  user_id: string;
  command_name: string | null;
  used_at: string;
}

interface RateLimitUsageRow {
  id: number;
  guild_id: string;
  user_id: string;
  command_name: string | null;
  used_at: string;
}

/**
 * Converts a database row to a RateLimitSetting object.
 */
function rowToRateLimitSetting(row: RateLimitSettingRow): RateLimitSetting {
  return {
    id: row.id,
    guild_id: row.guild_id,
    command_name: row.command_name,
    max_uses: row.max_uses,
    window_seconds: row.window_seconds,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * Converts a database row to a RateLimitUsage object.
 */
function rowToRateLimitUsage(row: RateLimitUsageRow): RateLimitUsage {
  return {
    id: row.id,
    guild_id: row.guild_id,
    user_id: row.user_id,
    command_name: row.command_name,
    used_at: row.used_at,
  };
}

// ============================================================================
// Rate Limit Settings CRUD
// ============================================================================

/**
 * Gets rate limit settings for a specific command or global (null command_name).
 */
export function getRateLimitSetting(
  guildId: string,
  commandName: string | null = null,
): RateLimitSetting | null {
  const db = getDatabase();

  const stmt = commandName
    ? db.prepare(`
        SELECT * FROM rate_limit_settings
        WHERE guild_id = ? AND command_name = ?
      `)
    : db.prepare(`
        SELECT * FROM rate_limit_settings
        WHERE guild_id = ? AND command_name IS NULL
      `);

  const row = (
    commandName ? stmt.get(guildId, commandName) : stmt.get(guildId)
  ) as RateLimitSettingRow | undefined;

  if (!row) {
    return null;
  }

  return rowToRateLimitSetting(row);
}

/**
 * Gets all rate limit settings for a guild.
 */
export function getGuildRateLimitSettings(guildId: string): RateLimitSetting[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM rate_limit_settings
    WHERE guild_id = ?
    ORDER BY command_name ASC NULLS FIRST
  `);

  const rows = stmt.all(guildId) as unknown as RateLimitSettingRow[];
  return rows.map(rowToRateLimitSetting);
}

/**
 * Sets rate limit for a command or globally (null for global).
 */
export function setRateLimit(
  guildId: string,
  commandName: string | null,
  maxUses: number,
  windowSeconds: number,
): RateLimitSetting {
  // Ensure guild settings exist
  getOrCreateGuildSettings(guildId);

  const db = getDatabase();

  // Use INSERT OR REPLACE to handle updates
  const stmt = db.prepare(`
    INSERT INTO rate_limit_settings (guild_id, command_name, max_uses, window_seconds)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(guild_id, command_name) DO UPDATE SET
      max_uses = excluded.max_uses,
      window_seconds = excluded.window_seconds
  `);

  stmt.run(guildId, commandName, maxUses, windowSeconds);

  return getRateLimitSetting(guildId, commandName)!;
}

/**
 * Removes rate limit settings for a command or global.
 */
export function removeRateLimit(
  guildId: string,
  commandName: string | null,
): boolean {
  const db = getDatabase();

  const stmt = commandName
    ? db.prepare(`
        DELETE FROM rate_limit_settings
        WHERE guild_id = ? AND command_name = ?
      `)
    : db.prepare(`
        DELETE FROM rate_limit_settings
        WHERE guild_id = ? AND command_name IS NULL
      `);

  const result = commandName
    ? stmt.run(guildId, commandName)
    : stmt.run(guildId);

  return result.changes > 0;
}

/**
 * Clears all rate limit settings for a guild.
 */
export function clearAllRateLimits(guildId: string): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    DELETE FROM rate_limit_settings
    WHERE guild_id = ?
  `);

  const result = stmt.run(guildId);
  return result.changes as number;
}

// ============================================================================
// Rate Limit Usage Tracking
// ============================================================================

/**
 * Records a command usage for rate limiting.
 */
export function recordUsage(
  guildId: string,
  userId: string,
  commandName: string | null = null,
): void {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO rate_limit_usage (guild_id, user_id, command_name)
    VALUES (?, ?, ?)
  `);

  stmt.run(guildId, userId, commandName);
}

/**
 * Gets the number of uses within the time window.
 */
export function getUsageCount(
  guildId: string,
  userId: string,
  commandName: string | null,
  windowSeconds: number,
): number {
  const db = getDatabase();

  const stmt = commandName
    ? db.prepare(`
        SELECT COUNT(*) as count FROM rate_limit_usage
        WHERE guild_id = ? AND user_id = ? AND command_name = ?
        AND datetime(used_at) >= datetime('now', '-' || ? || ' seconds')
      `)
    : db.prepare(`
        SELECT COUNT(*) as count FROM rate_limit_usage
        WHERE guild_id = ? AND user_id = ? AND command_name IS NULL
        AND datetime(used_at) >= datetime('now', '-' || ? || ' seconds')
      `);

  const result = (
    commandName
      ? stmt.get(guildId, userId, commandName, windowSeconds)
      : stmt.get(guildId, userId, windowSeconds)
  ) as { count: number };

  return result.count;
}

/**
 * Gets recent usage entries for a user.
 * Used internally by checkRateLimit.
 */
function getRecentUsage(
  guildId: string,
  userId: string,
  commandName: string | null,
  windowSeconds: number,
): RateLimitUsage[] {
  const db = getDatabase();

  const stmt = commandName
    ? db.prepare(`
        SELECT * FROM rate_limit_usage
        WHERE guild_id = ? AND user_id = ? AND command_name = ?
        AND datetime(used_at) >= datetime('now', '-' || ? || ' seconds')
        ORDER BY used_at DESC
      `)
    : db.prepare(`
        SELECT * FROM rate_limit_usage
        WHERE guild_id = ? AND user_id = ? AND command_name IS NULL
        AND datetime(used_at) >= datetime('now', '-' || ? || ' seconds')
        ORDER BY used_at DESC
      `);

  const rows = (commandName
    ? stmt.all(guildId, userId, commandName, windowSeconds)
    : stmt.all(
        guildId,
        userId,
        windowSeconds,
      )) as unknown as RateLimitUsageRow[];

  return rows.map(rowToRateLimitUsage);
}

/**
 * Clears all usage for a specific user in a guild.
 */
export function clearUserUsage(guildId: string, userId: string): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    DELETE FROM rate_limit_usage
    WHERE guild_id = ? AND user_id = ?
  `);

  const result = stmt.run(guildId, userId);
  return result.changes as number;
}

// ============================================================================
// Rate Limit Checking
// ============================================================================

/**
 * Gets the effective rate limit for a command.
 * Returns command-specific limit if exists, otherwise default limit, otherwise null (no limit).
 */
export function getEffectiveRateLimit(
  guildId: string,
  commandName: string,
): { maxUses: number; windowSeconds: number } | null {
  // First check for command-specific rate limit
  const commandLimit = getRateLimitSetting(guildId, commandName);
  if (commandLimit) {
    return {
      maxUses: commandLimit.max_uses,
      windowSeconds: commandLimit.window_seconds,
    };
  }

  // Fall back to default rate limit for the guild
  const defaultLimit = getRateLimitSetting(guildId, null);
  if (defaultLimit) {
    return {
      maxUses: defaultLimit.max_uses,
      windowSeconds: defaultLimit.window_seconds,
    };
  }

  // Return null - no rate limiting by default
  return null;
}

/**
 * Checks if a user is rate limited for a command.
 * Returns { limited: false } if not limited, or { limited: true, retryAfter: seconds } if limited.
 */
export function checkRateLimit(
  guildId: string,
  userId: string,
  commandName: string,
): { limited: boolean; retryAfter?: number; remaining?: number } {
  const effectiveLimit = getEffectiveRateLimit(guildId, commandName);

  // No rate limit configured - always allow
  if (!effectiveLimit) {
    return { limited: false };
  }

  const { maxUses, windowSeconds } = effectiveLimit;

  // Get usage count for command-specific tracking
  const usageCount = getUsageCount(guildId, userId, commandName, windowSeconds);

  // Also check default usage if there's a default limit
  const defaultLimit = getRateLimitSetting(guildId, null);
  if (defaultLimit) {
    const defaultUsageCount = getUsageCount(
      guildId,
      userId,
      null,
      defaultLimit.window_seconds,
    );
    if (defaultUsageCount >= defaultLimit.max_uses) {
      // Calculate retry after based on oldest usage
      const usage = getRecentUsage(
        guildId,
        userId,
        null,
        defaultLimit.window_seconds,
      );
      if (usage.length > 0) {
        const oldestUsage = usage[usage.length - 1];
        const usedAt = new Date(oldestUsage.used_at + "Z").getTime();
        const expiresAt = usedAt + defaultLimit.window_seconds * 1000;
        const retryAfter = Math.ceil((expiresAt - Date.now()) / 1000);

        return {
          limited: true,
          retryAfter: Math.max(1, retryAfter),
          remaining: 0,
        };
      }
    }
  }

  if (usageCount >= maxUses) {
    // Calculate retry after based on oldest usage
    const usage = getRecentUsage(guildId, userId, commandName, windowSeconds);
    if (usage.length > 0) {
      const oldestUsage = usage[usage.length - 1];
      const usedAt = new Date(oldestUsage.used_at + "Z").getTime();
      const expiresAt = usedAt + windowSeconds * 1000;
      const retryAfter = Math.ceil((expiresAt - Date.now()) / 1000);

      return {
        limited: true,
        retryAfter: Math.max(1, retryAfter),
        remaining: 0,
      };
    }

    return { limited: true, retryAfter: windowSeconds, remaining: 0 };
  }

  return {
    limited: false,
    remaining: maxUses - usageCount,
  };
}

/**
 * Checks rate limit and records usage if not limited.
 * This is the main function to use for rate limiting commands.
 *
 * @returns Result indicating if the command can proceed
 */
export function consumeRateLimit(
  guildId: string,
  userId: string,
  commandName: string,
): { allowed: boolean; retryAfter?: number; remaining?: number } {
  const effectiveLimit = getEffectiveRateLimit(guildId, commandName);

  // No rate limit configured - always allow without recording
  if (!effectiveLimit) {
    return { allowed: true };
  }

  const result = checkRateLimit(guildId, userId, commandName);

  if (result.limited) {
    return {
      allowed: false,
      retryAfter: result.retryAfter,
      remaining: 0,
    };
  }

  // Record the usage for both command-specific and default tracking
  recordUsage(guildId, userId, commandName);

  // Also record for default tracking if there's a default limit
  const defaultLimit = getRateLimitSetting(guildId, null);
  if (defaultLimit) {
    recordUsage(guildId, userId, null);
  }

  return {
    allowed: true,
    remaining: (result.remaining ?? 1) - 1,
  };
}
