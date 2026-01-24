/**
 * Rate Limits Repository Tests
 * Tests for rate limit settings and usage tracking
 */

import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";

import {
  setupTestEnvironment,
  teardownTestEnvironment,
  createTestDatabase,
  closeTestDatabase,
  randomGuildId,
  randomUserId,
  sleep,
} from "../setup.js";

// Import after environment is set up
let rateLimits: typeof import("../../src/database/repositories/rateLimits.js");
let guildSettings: typeof import("../../src/database/repositories/guildSettings.js");

describe("rateLimits repository", () => {
  before(async () => {
    setupTestEnvironment();
    await createTestDatabase();
    rateLimits = await import("../../src/database/repositories/rateLimits.js");
    guildSettings =
      await import("../../src/database/repositories/guildSettings.js");
  });

  after(async () => {
    await closeTestDatabase();
    teardownTestEnvironment();
  });

  describe("getRateLimitSetting", () => {
    it("should return null for non-existent setting", () => {
      const guildId = randomGuildId();
      const setting = rateLimits.getRateLimitSetting(guildId, "sketchbook");
      assert.equal(setting, null);
    });

    it("should return null for non-existent global setting", () => {
      const guildId = randomGuildId();
      const setting = rateLimits.getRateLimitSetting(guildId, null);
      assert.equal(setting, null);
    });
  });

  describe("setRateLimit", () => {
    it("should set rate limit for specific command", () => {
      const guildId = randomGuildId();
      const setting = rateLimits.setRateLimit(guildId, "sketchbook", 5, 60);

      assert.ok(setting, "Should return setting");
      assert.equal(setting.guild_id, guildId);
      assert.equal(setting.command_name, "sketchbook");
      assert.equal(setting.max_uses, 5);
      assert.equal(setting.window_seconds, 60);
    });

    it("should set global rate limit (null command_name)", () => {
      const guildId = randomGuildId();
      const setting = rateLimits.setRateLimit(guildId, null, 10, 120);

      assert.ok(setting);
      assert.equal(setting.command_name, null);
      assert.equal(setting.max_uses, 10);
      assert.equal(setting.window_seconds, 120);
    });

    it("should update existing rate limit", () => {
      const guildId = randomGuildId();
      rateLimits.setRateLimit(guildId, "dialogue", 3, 30);
      const updated = rateLimits.setRateLimit(guildId, "dialogue", 10, 300);

      assert.equal(updated.max_uses, 10);
      assert.equal(updated.window_seconds, 300);
    });

    it("should create guild settings if not exist", () => {
      const guildId = randomGuildId();
      rateLimits.setRateLimit(guildId, "test", 1, 1);

      const settings = guildSettings.getGuildSettings(guildId);
      assert.ok(settings, "Guild settings should be created");
    });
  });

  describe("getGuildRateLimitSettings", () => {
    it("should return empty array for guild with no settings", () => {
      const guildId = randomGuildId();
      const settings = rateLimits.getGuildRateLimitSettings(guildId);

      assert.ok(Array.isArray(settings));
      assert.equal(settings.length, 0);
    });

    it("should return all rate limit settings for guild", () => {
      const guildId = randomGuildId();
      rateLimits.setRateLimit(guildId, null, 10, 60);
      rateLimits.setRateLimit(guildId, "sketchbook", 5, 30);
      rateLimits.setRateLimit(guildId, "dialogue", 3, 20);

      const settings = rateLimits.getGuildRateLimitSettings(guildId);

      assert.equal(settings.length, 3);
    });
  });

  describe("removeRateLimit", () => {
    it("should remove command rate limit", () => {
      const guildId = randomGuildId();
      rateLimits.setRateLimit(guildId, "sketchbook", 5, 60);

      const removed = rateLimits.removeRateLimit(guildId, "sketchbook");
      assert.equal(removed, true);

      const setting = rateLimits.getRateLimitSetting(guildId, "sketchbook");
      assert.equal(setting, null);
    });

    it("should remove global rate limit", () => {
      const guildId = randomGuildId();
      rateLimits.setRateLimit(guildId, null, 10, 60);

      const removed = rateLimits.removeRateLimit(guildId, null);
      assert.equal(removed, true);

      const setting = rateLimits.getRateLimitSetting(guildId, null);
      assert.equal(setting, null);
    });

    it("should return false for non-existent setting", () => {
      const guildId = randomGuildId();
      const removed = rateLimits.removeRateLimit(guildId, "nonexistent");
      assert.equal(removed, false);
    });
  });

  describe("clearAllRateLimits", () => {
    it("should remove all rate limits for guild", () => {
      const guildId = randomGuildId();
      rateLimits.setRateLimit(guildId, null, 10, 60);
      rateLimits.setRateLimit(guildId, "sketchbook", 5, 30);
      rateLimits.setRateLimit(guildId, "dialogue", 3, 20);

      const removedCount = rateLimits.clearAllRateLimits(guildId);

      assert.equal(removedCount, 3);

      const settings = rateLimits.getGuildRateLimitSettings(guildId);
      assert.equal(settings.length, 0);
    });

    it("should not affect other guilds", () => {
      const guild1 = randomGuildId();
      const guild2 = randomGuildId();

      rateLimits.setRateLimit(guild1, "sketchbook", 5, 30);
      rateLimits.setRateLimit(guild2, "sketchbook", 5, 30);

      rateLimits.clearAllRateLimits(guild1);

      const settings = rateLimits.getGuildRateLimitSettings(guild2);
      assert.equal(settings.length, 1);
    });
  });

  describe("getEffectiveRateLimit", () => {
    it("should return null when no limits configured", () => {
      const guildId = randomGuildId();
      const limit = rateLimits.getEffectiveRateLimit(guildId, "sketchbook");
      assert.equal(limit, null);
    });

    it("should return command-specific limit when set", () => {
      const guildId = randomGuildId();
      rateLimits.setRateLimit(guildId, "sketchbook", 5, 60);

      const limit = rateLimits.getEffectiveRateLimit(guildId, "sketchbook");

      assert.ok(limit);
      assert.equal(limit!.maxUses, 5);
      assert.equal(limit!.windowSeconds, 60);
    });

    it("should fall back to global limit", () => {
      const guildId = randomGuildId();
      rateLimits.setRateLimit(guildId, null, 10, 120);

      const limit = rateLimits.getEffectiveRateLimit(guildId, "dialogue");

      assert.ok(limit);
      assert.equal(limit!.maxUses, 10);
      assert.equal(limit!.windowSeconds, 120);
    });

    it("should prefer command-specific over global", () => {
      const guildId = randomGuildId();
      rateLimits.setRateLimit(guildId, null, 10, 120);
      rateLimits.setRateLimit(guildId, "sketchbook", 3, 30);

      const limit = rateLimits.getEffectiveRateLimit(guildId, "sketchbook");

      assert.ok(limit);
      assert.equal(limit!.maxUses, 3);
      assert.equal(limit!.windowSeconds, 30);
    });
  });

  describe("recordUsage and getUsageCount", () => {
    it("should record usage", () => {
      const guildId = randomGuildId();
      const userId = randomUserId();
      guildSettings.getOrCreateGuildSettings(guildId);

      rateLimits.recordUsage(guildId, userId, "sketchbook");

      const count = rateLimits.getUsageCount(guildId, userId, "sketchbook", 60);
      assert.equal(count, 1);
    });

    it("should track multiple usages", () => {
      const guildId = randomGuildId();
      const userId = randomUserId();
      guildSettings.getOrCreateGuildSettings(guildId);

      rateLimits.recordUsage(guildId, userId, "sketchbook");
      rateLimits.recordUsage(guildId, userId, "sketchbook");
      rateLimits.recordUsage(guildId, userId, "sketchbook");

      const count = rateLimits.getUsageCount(guildId, userId, "sketchbook", 60);
      assert.equal(count, 3);
    });

    it("should record global usage (null command)", () => {
      const guildId = randomGuildId();
      const userId = randomUserId();
      guildSettings.getOrCreateGuildSettings(guildId);

      rateLimits.recordUsage(guildId, userId, null);

      const count = rateLimits.getUsageCount(guildId, userId, null, 60);
      assert.equal(count, 1);
    });

    it("should separate usage by command", () => {
      const guildId = randomGuildId();
      const userId = randomUserId();
      guildSettings.getOrCreateGuildSettings(guildId);

      rateLimits.recordUsage(guildId, userId, "sketchbook");
      rateLimits.recordUsage(guildId, userId, "sketchbook");
      rateLimits.recordUsage(guildId, userId, "dialogue");

      const sketchbookCount = rateLimits.getUsageCount(
        guildId,
        userId,
        "sketchbook",
        60,
      );
      const dialogueCount = rateLimits.getUsageCount(
        guildId,
        userId,
        "dialogue",
        60,
      );

      assert.equal(sketchbookCount, 2);
      assert.equal(dialogueCount, 1);
    });

    it("should separate usage by user", () => {
      const guildId = randomGuildId();
      const user1 = randomUserId();
      const user2 = randomUserId();
      guildSettings.getOrCreateGuildSettings(guildId);

      rateLimits.recordUsage(guildId, user1, "sketchbook");
      rateLimits.recordUsage(guildId, user1, "sketchbook");
      rateLimits.recordUsage(guildId, user2, "sketchbook");

      const user1Count = rateLimits.getUsageCount(
        guildId,
        user1,
        "sketchbook",
        60,
      );
      const user2Count = rateLimits.getUsageCount(
        guildId,
        user2,
        "sketchbook",
        60,
      );

      assert.equal(user1Count, 2);
      assert.equal(user2Count, 1);
    });
  });

  describe("clearUserUsage", () => {
    it("should clear all usage for user in guild", () => {
      const guildId = randomGuildId();
      const userId = randomUserId();
      guildSettings.getOrCreateGuildSettings(guildId);

      rateLimits.recordUsage(guildId, userId, "sketchbook");
      rateLimits.recordUsage(guildId, userId, "dialogue");
      rateLimits.recordUsage(guildId, userId, null);

      const removedCount = rateLimits.clearUserUsage(guildId, userId);

      assert.equal(removedCount, 3);

      const count = rateLimits.getUsageCount(guildId, userId, "sketchbook", 60);
      assert.equal(count, 0);
    });

    it("should not affect other users", () => {
      const guildId = randomGuildId();
      const user1 = randomUserId();
      const user2 = randomUserId();
      guildSettings.getOrCreateGuildSettings(guildId);

      rateLimits.recordUsage(guildId, user1, "sketchbook");
      rateLimits.recordUsage(guildId, user2, "sketchbook");

      rateLimits.clearUserUsage(guildId, user1);

      const user2Count = rateLimits.getUsageCount(
        guildId,
        user2,
        "sketchbook",
        60,
      );
      assert.equal(user2Count, 1);
    });
  });

  describe("checkRateLimit", () => {
    it("should return not limited when no limit configured", () => {
      const guildId = randomGuildId();
      const userId = randomUserId();

      const result = rateLimits.checkRateLimit(guildId, userId, "sketchbook");

      assert.equal(result.limited, false);
    });

    it("should return not limited when under limit", () => {
      const guildId = randomGuildId();
      const userId = randomUserId();

      rateLimits.setRateLimit(guildId, "sketchbook", 3, 60);
      rateLimits.recordUsage(guildId, userId, "sketchbook");

      const result = rateLimits.checkRateLimit(guildId, userId, "sketchbook");

      assert.equal(result.limited, false);
      assert.equal(result.remaining, 2);
    });

    it("should return limited when at limit", () => {
      const guildId = randomGuildId();
      const userId = randomUserId();

      rateLimits.setRateLimit(guildId, "sketchbook", 2, 60);
      rateLimits.recordUsage(guildId, userId, "sketchbook");
      rateLimits.recordUsage(guildId, userId, "sketchbook");

      const result = rateLimits.checkRateLimit(guildId, userId, "sketchbook");

      assert.equal(result.limited, true);
      assert.ok(result.retryAfter !== undefined);
      assert.ok(result.retryAfter! > 0);
    });

    it("should check global limit as fallback", () => {
      const guildId = randomGuildId();
      const userId = randomUserId();

      rateLimits.setRateLimit(guildId, null, 1, 60);
      rateLimits.recordUsage(guildId, userId, null);

      const result = rateLimits.checkRateLimit(guildId, userId, "dialogue");

      assert.equal(result.limited, true);
    });
  });

  describe("consumeRateLimit", () => {
    it("should allow when no limit configured", () => {
      const guildId = randomGuildId();
      const userId = randomUserId();

      const result = rateLimits.consumeRateLimit(guildId, userId, "sketchbook");

      assert.equal(result.allowed, true);
    });

    it("should allow and record usage when under limit", () => {
      const guildId = randomGuildId();
      const userId = randomUserId();

      rateLimits.setRateLimit(guildId, "sketchbook", 3, 60);

      const result = rateLimits.consumeRateLimit(guildId, userId, "sketchbook");

      assert.equal(result.allowed, true);
      assert.equal(result.remaining, 2);

      const count = rateLimits.getUsageCount(guildId, userId, "sketchbook", 60);
      assert.equal(count, 1);
    });

    it("should deny when at limit", () => {
      const guildId = randomGuildId();
      const userId = randomUserId();

      rateLimits.setRateLimit(guildId, "sketchbook", 1, 60);
      rateLimits.recordUsage(guildId, userId, "sketchbook");

      const result = rateLimits.consumeRateLimit(guildId, userId, "sketchbook");

      assert.equal(result.allowed, false);
      assert.ok(result.retryAfter !== undefined);
    });

    it("should track both command and global usage when global limit exists", () => {
      const guildId = randomGuildId();
      const userId = randomUserId();

      rateLimits.setRateLimit(guildId, null, 10, 60);
      rateLimits.setRateLimit(guildId, "sketchbook", 5, 60);

      rateLimits.consumeRateLimit(guildId, userId, "sketchbook");

      const commandCount = rateLimits.getUsageCount(
        guildId,
        userId,
        "sketchbook",
        60,
      );
      const globalCount = rateLimits.getUsageCount(guildId, userId, null, 60);

      assert.equal(commandCount, 1);
      assert.equal(globalCount, 1);
    });
  });
});
