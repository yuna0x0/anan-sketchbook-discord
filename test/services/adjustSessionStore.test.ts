/**
 * Adjust Session Store Tests
 * Tests for TTL expiry, sliding refresh, and LRU eviction behavior
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { SessionStore } from "../../src/services/adjustSessionStore.js";

function createStore(overrides: {
  ttlMs?: number;
  maxEntries?: number;
  maxBytes?: number;
}) {
  return new SessionStore<{ data: string }>({
    ttlMs: overrides.ttlMs ?? 60_000,
    maxEntries: overrides.maxEntries ?? 100,
    maxBytes: overrides.maxBytes ?? 1024 * 1024,
    sizeOf: (value) => value.data.length,
    sweepIntervalMs: 0, // no timer in tests
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("SessionStore", () => {
  it("should store and retrieve values", () => {
    const store = createStore({});
    store.set("a", { data: "hello" });
    assert.deepEqual(store.get("a"), { data: "hello" });
    assert.equal(store.size, 1);
  });

  it("should return undefined for missing keys", () => {
    const store = createStore({});
    assert.equal(store.get("missing"), undefined);
  });

  it("should expire entries after the TTL", async () => {
    const store = createStore({ ttlMs: 30 });
    store.set("a", { data: "hello" });
    await sleep(50);
    assert.equal(store.get("a"), undefined);
    assert.equal(store.totalBytes, 0);
  });

  it("should slide the TTL on access", async () => {
    const store = createStore({ ttlMs: 80 });
    store.set("a", { data: "hello" });
    await sleep(50);
    assert.ok(store.get("a"), "should still be alive before TTL");
    await sleep(50);
    // 100ms since set, but only 50ms since last access
    assert.ok(store.get("a"), "access should have refreshed the TTL");
  });

  it("should evict the oldest entry over the entry cap", () => {
    const store = createStore({ maxEntries: 2 });
    store.set("a", { data: "1" });
    store.set("b", { data: "2" });
    store.set("c", { data: "3" });

    assert.equal(store.size, 2);
    assert.equal(store.get("a"), undefined, "oldest should be evicted");
    assert.ok(store.get("b"));
    assert.ok(store.get("c"));
  });

  it("should treat recently accessed entries as fresh for eviction", () => {
    const store = createStore({ maxEntries: 2 });
    store.set("a", { data: "1" });
    store.set("b", { data: "2" });
    store.get("a"); // refresh recency of "a"
    store.set("c", { data: "3" });

    assert.ok(store.get("a"), "recently used entry should survive");
    assert.equal(store.get("b"), undefined, "least recently used is evicted");
  });

  it("should evict entries to stay within the byte budget", () => {
    const store = createStore({ maxBytes: 10 });
    store.set("a", { data: "12345" }); // 5 bytes
    store.set("b", { data: "12345" }); // 5 bytes -> total 10, fits
    store.set("c", { data: "12345" }); // 5 bytes -> 15, evict oldest

    assert.equal(store.get("a"), undefined);
    assert.ok(store.get("b"));
    assert.ok(store.get("c"));
    assert.ok(store.totalBytes <= 10);
  });

  it("should replace values and update byte accounting", () => {
    const store = createStore({});
    store.set("a", { data: "12345" });
    store.set("a", { data: "1" });
    assert.equal(store.size, 1);
    assert.equal(store.totalBytes, 1);
  });

  it("should delete entries", () => {
    const store = createStore({});
    store.set("a", { data: "hello" });
    store.delete("a");
    assert.equal(store.get("a"), undefined);
    assert.equal(store.size, 0);
    assert.equal(store.totalBytes, 0);
  });

  it("should remove expired entries on sweep", async () => {
    const store = createStore({ ttlMs: 20 });
    store.set("a", { data: "hello" });
    store.set("b", { data: "world" });
    await sleep(40);
    store.sweep();
    assert.equal(store.size, 0);
    assert.equal(store.totalBytes, 0);
  });
});
