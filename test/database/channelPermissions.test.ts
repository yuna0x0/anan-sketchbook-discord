/**
 * Channel Permissions Repository Tests
 * Tests for channel-level permission CRUD operations
 */

import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";

import {
  setupTestEnvironment,
  teardownTestEnvironment,
  createTestDatabase,
  closeTestDatabase,
  randomGuildId,
  randomChannelId,
} from "../setup.js";

// Import after environment is set up
let channelPermissions: typeof import("../../src/database/repositories/channelPermissions.js");
let guildSettings: typeof import("../../src/database/repositories/guildSettings.js");

describe("channelPermissions repository", () => {
  before(async () => {
    setupTestEnvironment();
    await createTestDatabase();
    channelPermissions = await import(
      "../../src/database/repositories/channelPermissions.js"
    );
    guildSettings = await import(
      "../../src/database/repositories/guildSettings.js"
    );
  });

  after(async () => {
    await closeTestDatabase();
    teardownTestEnvironment();
  });

  describe("addChannelPermission", () => {
    it("should add channel to permissions list", () => {
      const guildId = randomGuildId();
      const channelId = randomChannelId();

      const permission = channelPermissions.addChannelPermission(
        guildId,
        channelId
      );

      assert.ok(permission, "Should return permission");
      assert.equal(permission.guild_id, guildId);
      assert.equal(permission.channel_id, channelId);
      assert.equal(permission.include_threads, false);
    });

    it("should add channel with include_threads option", () => {
      const guildId = randomGuildId();
      const channelId = randomChannelId();

      const permission = channelPermissions.addChannelPermission(
        guildId,
        channelId,
        true
      );

      assert.equal(permission.include_threads, true);
    });

    it("should update existing channel permission", () => {
      const guildId = randomGuildId();
      const channelId = randomChannelId();

      channelPermissions.addChannelPermission(guildId, channelId, false);
      const updated = channelPermissions.addChannelPermission(
        guildId,
        channelId,
        true
      );

      assert.equal(updated.include_threads, true);
    });

    it("should create guild settings if not exist", () => {
      const guildId = randomGuildId();
      const channelId = randomChannelId();

      channelPermissions.addChannelPermission(guildId, channelId);

      const settings = guildSettings.getGuildSettings(guildId);
      assert.ok(settings, "Guild settings should be created");
    });
  });

  describe("getChannelPermission", () => {
    it("should return null for non-existent permission", () => {
      const guildId = randomGuildId();
      const channelId = randomChannelId();

      const permission = channelPermissions.getChannelPermission(
        guildId,
        channelId
      );

      assert.equal(permission, null);
    });

    it("should return existing permission", () => {
      const guildId = randomGuildId();
      const channelId = randomChannelId();

      channelPermissions.addChannelPermission(guildId, channelId, true);
      const permission = channelPermissions.getChannelPermission(
        guildId,
        channelId
      );

      assert.ok(permission);
      assert.equal(permission!.channel_id, channelId);
      assert.equal(permission!.include_threads, true);
    });
  });

  describe("getChannelPermissions", () => {
    it("should return empty array for guild with no permissions", () => {
      const guildId = randomGuildId();

      const permissions = channelPermissions.getChannelPermissions(guildId);

      assert.ok(Array.isArray(permissions));
      assert.equal(permissions.length, 0);
    });

    it("should return all channel permissions for guild", () => {
      const guildId = randomGuildId();
      const channel1 = randomChannelId();
      const channel2 = randomChannelId();
      const channel3 = randomChannelId();

      channelPermissions.addChannelPermission(guildId, channel1);
      channelPermissions.addChannelPermission(guildId, channel2);
      channelPermissions.addChannelPermission(guildId, channel3);

      const permissions = channelPermissions.getChannelPermissions(guildId);

      assert.equal(permissions.length, 3);
    });

    it("should not return permissions from other guilds", () => {
      const guild1 = randomGuildId();
      const guild2 = randomGuildId();
      const channel1 = randomChannelId();
      const channel2 = randomChannelId();

      channelPermissions.addChannelPermission(guild1, channel1);
      channelPermissions.addChannelPermission(guild2, channel2);

      const permissions = channelPermissions.getChannelPermissions(guild1);

      assert.equal(permissions.length, 1);
      assert.equal(permissions[0].channel_id, channel1);
    });
  });

  describe("removeChannelPermission", () => {
    it("should remove existing permission", () => {
      const guildId = randomGuildId();
      const channelId = randomChannelId();

      channelPermissions.addChannelPermission(guildId, channelId);
      const removed = channelPermissions.removeChannelPermission(
        guildId,
        channelId
      );

      assert.equal(removed, true);

      const permission = channelPermissions.getChannelPermission(
        guildId,
        channelId
      );
      assert.equal(permission, null);
    });

    it("should return false for non-existent permission", () => {
      const guildId = randomGuildId();
      const channelId = randomChannelId();

      const removed = channelPermissions.removeChannelPermission(
        guildId,
        channelId
      );

      assert.equal(removed, false);
    });
  });

  describe("clearChannelPermissions", () => {
    it("should remove all channel permissions for guild", () => {
      const guildId = randomGuildId();
      channelPermissions.addChannelPermission(guildId, randomChannelId());
      channelPermissions.addChannelPermission(guildId, randomChannelId());
      channelPermissions.addChannelPermission(guildId, randomChannelId());

      const removedCount = channelPermissions.clearChannelPermissions(guildId);

      assert.equal(removedCount, 3);

      const permissions = channelPermissions.getChannelPermissions(guildId);
      assert.equal(permissions.length, 0);
    });

    it("should not affect other guilds", () => {
      const guild1 = randomGuildId();
      const guild2 = randomGuildId();

      channelPermissions.addChannelPermission(guild1, randomChannelId());
      channelPermissions.addChannelPermission(guild2, randomChannelId());

      channelPermissions.clearChannelPermissions(guild1);

      const permissions = channelPermissions.getChannelPermissions(guild2);
      assert.equal(permissions.length, 1);
    });
  });

  describe("clearChannelPermissionsAndMode", () => {
    it("should clear permissions and reset mode to 'all'", () => {
      const guildId = randomGuildId();
      guildSettings.setChannelMode(guildId, "whitelist");
      channelPermissions.addChannelPermission(guildId, randomChannelId());
      channelPermissions.addChannelPermission(guildId, randomChannelId());

      const removedCount =
        channelPermissions.clearChannelPermissionsAndMode(guildId);

      assert.equal(removedCount, 2);

      const permissions = channelPermissions.getChannelPermissions(guildId);
      assert.equal(permissions.length, 0);

      const mode = guildSettings.getChannelModeForGuild(guildId);
      assert.equal(mode, "all");
    });
  });

  describe("isChannelInList", () => {
    it("should return true for channel in list", () => {
      const guildId = randomGuildId();
      const channelId = randomChannelId();

      channelPermissions.addChannelPermission(guildId, channelId);

      const inList = channelPermissions.isChannelInList(guildId, channelId);
      assert.equal(inList, true);
    });

    it("should return false for channel not in list", () => {
      const guildId = randomGuildId();
      const channelId = randomChannelId();

      const inList = channelPermissions.isChannelInList(guildId, channelId);
      assert.equal(inList, false);
    });
  });

  describe("canUseInChannel", () => {
    describe("mode: all", () => {
      it("should allow any channel", () => {
        const guildId = randomGuildId();
        guildSettings.setChannelMode(guildId, "all");

        const canUse = channelPermissions.canUseInChannel(
          guildId,
          randomChannelId()
        );
        assert.equal(canUse, true);
      });
    });

    describe("mode: whitelist", () => {
      it("should allow channel in whitelist", () => {
        const guildId = randomGuildId();
        const channelId = randomChannelId();

        guildSettings.setChannelMode(guildId, "whitelist");
        channelPermissions.addChannelPermission(guildId, channelId);

        const canUse = channelPermissions.canUseInChannel(guildId, channelId);
        assert.equal(canUse, true);
      });

      it("should deny channel not in whitelist", () => {
        const guildId = randomGuildId();
        const allowedChannel = randomChannelId();
        const notAllowedChannel = randomChannelId();

        guildSettings.setChannelMode(guildId, "whitelist");
        channelPermissions.addChannelPermission(guildId, allowedChannel);

        const canUse = channelPermissions.canUseInChannel(
          guildId,
          notAllowedChannel
        );
        assert.equal(canUse, false);
      });

      it("should allow thread if parent channel is whitelisted", () => {
        const guildId = randomGuildId();
        const parentChannelId = randomChannelId();
        const threadId = randomChannelId();

        guildSettings.setChannelMode(guildId, "whitelist");
        channelPermissions.addChannelPermission(guildId, parentChannelId);

        const canUse = channelPermissions.canUseInChannel(
          guildId,
          threadId,
          parentChannelId
        );
        assert.equal(canUse, true);
      });
    });

    describe("mode: blacklist", () => {
      it("should deny channel in blacklist", () => {
        const guildId = randomGuildId();
        const channelId = randomChannelId();

        guildSettings.setChannelMode(guildId, "blacklist");
        channelPermissions.addChannelPermission(guildId, channelId);

        const canUse = channelPermissions.canUseInChannel(guildId, channelId);
        assert.equal(canUse, false);
      });

      it("should allow channel not in blacklist", () => {
        const guildId = randomGuildId();
        const blockedChannel = randomChannelId();
        const allowedChannel = randomChannelId();

        guildSettings.setChannelMode(guildId, "blacklist");
        channelPermissions.addChannelPermission(guildId, blockedChannel);

        const canUse = channelPermissions.canUseInChannel(
          guildId,
          allowedChannel
        );
        assert.equal(canUse, true);
      });

      it("should deny thread if parent channel is blacklisted", () => {
        const guildId = randomGuildId();
        const parentChannelId = randomChannelId();
        const threadId = randomChannelId();

        guildSettings.setChannelMode(guildId, "blacklist");
        channelPermissions.addChannelPermission(guildId, parentChannelId);

        const canUse = channelPermissions.canUseInChannel(
          guildId,
          threadId,
          parentChannelId
        );
        assert.equal(canUse, false);
      });
    });
  });

  describe("cleanupDeletedChannels", () => {
    it("should remove channels not in existing set", () => {
      const guildId = randomGuildId();
      const existingChannel = randomChannelId();
      const deletedChannel = randomChannelId();

      channelPermissions.addChannelPermission(guildId, existingChannel);
      channelPermissions.addChannelPermission(guildId, deletedChannel);

      const existingChannelIds = new Set([existingChannel]);
      const removedCount = channelPermissions.cleanupDeletedChannels(
        guildId,
        existingChannelIds
      );

      assert.equal(removedCount, 1);

      const permissions = channelPermissions.getChannelPermissions(guildId);
      assert.equal(permissions.length, 1);
      assert.equal(permissions[0].channel_id, existingChannel);
    });

    it("should return 0 when all channels exist", () => {
      const guildId = randomGuildId();
      const channel1 = randomChannelId();
      const channel2 = randomChannelId();

      channelPermissions.addChannelPermission(guildId, channel1);
      channelPermissions.addChannelPermission(guildId, channel2);

      const existingChannelIds = new Set([channel1, channel2]);
      const removedCount = channelPermissions.cleanupDeletedChannels(
        guildId,
        existingChannelIds
      );

      assert.equal(removedCount, 0);
    });

    it("should handle empty permission list", () => {
      const guildId = randomGuildId();

      const existingChannelIds = new Set([randomChannelId()]);
      const removedCount = channelPermissions.cleanupDeletedChannels(
        guildId,
        existingChannelIds
      );

      assert.equal(removedCount, 0);
    });
  });
});
