/**
 * Permission Service Tests
 * Tests for the unified permission checking service
 */

import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { Locale } from "discord.js";

import {
  setupTestEnvironment,
  teardownTestEnvironment,
  createTestDatabase,
  closeTestDatabase,
  randomGuildId,
  randomUserId,
  randomChannelId,
  randomRoleId,
  createMockMember,
  createMockAPIMember,
  createMockChannel,
} from "../setup.js";

// Import after environment is set up
let permissionService: typeof import("../../src/services/permissionService.js");
let guildSettings: typeof import("../../src/database/repositories/guildSettings.js");
let channelPermissions: typeof import("../../src/database/repositories/channelPermissions.js");
let commandPermissions: typeof import("../../src/database/repositories/commandPermissions.js");
let rateLimits: typeof import("../../src/database/repositories/rateLimits.js");

describe("permissionService", () => {
  before(async () => {
    setupTestEnvironment();
    await createTestDatabase();
    permissionService = await import("../../src/services/permissionService.js");
    guildSettings =
      await import("../../src/database/repositories/guildSettings.js");
    channelPermissions =
      await import("../../src/database/repositories/channelPermissions.js");
    commandPermissions =
      await import("../../src/database/repositories/commandPermissions.js");
    rateLimits = await import("../../src/database/repositories/rateLimits.js");
  });

  after(async () => {
    await closeTestDatabase();
    teardownTestEnvironment();
  });

  describe("checkPermissions", () => {
    describe("no guild (DM context)", () => {
      it("should allow when not in guild", () => {
        const result = permissionService.checkPermissions(
          null, // guildId
          null, // channel
          null, // member
          "sketchbook",
        );

        assert.equal(result.allowed, true);
      });
    });

    describe("bot enabled check", () => {
      it("should allow when bot is enabled", () => {
        const guildId = randomGuildId();
        const userId = randomUserId();
        const channelId = randomChannelId();

        guildSettings.getOrCreateGuildSettings(guildId);

        const channel = createMockChannel(channelId);
        const member = createMockMember(userId, []);

        const result = permissionService.checkPermissions(
          guildId,
          channel,
          member as any,
          "sketchbook",
          false, // don't consume rate limit
        );

        assert.equal(result.allowed, true);
      });

      it("should deny when bot is disabled", () => {
        const guildId = randomGuildId();
        const userId = randomUserId();
        const channelId = randomChannelId();

        guildSettings.setGuildEnabled(guildId, false);

        const channel = createMockChannel(channelId);
        const member = createMockMember(userId, []);

        const result = permissionService.checkPermissions(
          guildId,
          channel,
          member as any,
          "sketchbook",
        );

        assert.equal(result.allowed, false);
        assert.equal(
          result.reason,
          permissionService.PermissionDeniedReason.BOT_DISABLED,
        );
      });
    });

    describe("channel permission check", () => {
      it("should allow in any channel with 'all' mode", () => {
        const guildId = randomGuildId();
        const userId = randomUserId();
        const channelId = randomChannelId();

        guildSettings.setChannelMode(guildId, "all");

        const channel = createMockChannel(channelId);
        const member = createMockMember(userId, []);

        const result = permissionService.checkPermissions(
          guildId,
          channel,
          member as any,
          "sketchbook",
          false,
        );

        assert.equal(result.allowed, true);
      });

      it("should deny in non-whitelisted channel", () => {
        const guildId = randomGuildId();
        const userId = randomUserId();
        const allowedChannel = randomChannelId();
        const notAllowedChannel = randomChannelId();

        guildSettings.setChannelMode(guildId, "whitelist");
        channelPermissions.addChannelPermission(guildId, allowedChannel);

        const channel = createMockChannel(notAllowedChannel);
        const member = createMockMember(userId, []);

        const result = permissionService.checkPermissions(
          guildId,
          channel,
          member as any,
          "sketchbook",
          false,
        );

        assert.equal(result.allowed, false);
        assert.equal(
          result.reason,
          permissionService.PermissionDeniedReason.CHANNEL_NOT_ALLOWED,
        );
      });

      it("should allow in whitelisted channel", () => {
        const guildId = randomGuildId();
        const userId = randomUserId();
        const channelId = randomChannelId();

        guildSettings.setChannelMode(guildId, "whitelist");
        channelPermissions.addChannelPermission(guildId, channelId);

        const channel = createMockChannel(channelId);
        const member = createMockMember(userId, []);

        const result = permissionService.checkPermissions(
          guildId,
          channel,
          member as any,
          "sketchbook",
          false,
        );

        assert.equal(result.allowed, true);
      });

      it("should deny in blacklisted channel", () => {
        const guildId = randomGuildId();
        const userId = randomUserId();
        const channelId = randomChannelId();

        guildSettings.setChannelMode(guildId, "blacklist");
        channelPermissions.addChannelPermission(guildId, channelId);

        const channel = createMockChannel(channelId);
        const member = createMockMember(userId, []);

        const result = permissionService.checkPermissions(
          guildId,
          channel,
          member as any,
          "sketchbook",
          false,
        );

        assert.equal(result.allowed, false);
        assert.equal(
          result.reason,
          permissionService.PermissionDeniedReason.CHANNEL_NOT_ALLOWED,
        );
      });
    });

    describe("command permission check", () => {
      it("should deny when command is disabled", () => {
        const guildId = randomGuildId();
        const userId = randomUserId();
        const channelId = randomChannelId();

        guildSettings.getOrCreateGuildSettings(guildId);
        commandPermissions.setCommandEnabled(guildId, "sketchbook", false);

        const channel = createMockChannel(channelId);
        const member = createMockMember(userId, []);

        const result = permissionService.checkPermissions(
          guildId,
          channel,
          member as any,
          "sketchbook",
          false,
        );

        assert.equal(result.allowed, false);
        assert.equal(
          result.reason,
          permissionService.PermissionDeniedReason.COMMAND_DISABLED,
        );
      });
    });

    describe("role permission check", () => {
      it("should deny user with denied role (global)", () => {
        const guildId = randomGuildId();
        const userId = randomUserId();
        const channelId = randomChannelId();
        const deniedRole = randomRoleId();

        guildSettings.addDefaultDeniedRole(guildId, deniedRole);

        const channel = createMockChannel(channelId);
        const member = createMockMember(userId, [deniedRole]);

        const result = permissionService.checkPermissions(
          guildId,
          channel,
          member as any,
          "sketchbook",
          false,
        );

        assert.equal(result.allowed, false);
        assert.equal(
          result.reason,
          permissionService.PermissionDeniedReason.GLOBAL_USER_DENIED,
        );
      });

      it("should deny user without allowed role when roles configured (per-command)", () => {
        const guildId = randomGuildId();
        const userId = randomUserId();
        const channelId = randomChannelId();
        const allowedRole = randomRoleId();

        guildSettings.getOrCreateGuildSettings(guildId);
        commandPermissions.addAllowedRole(guildId, "sketchbook", allowedRole);

        const channel = createMockChannel(channelId);
        const member = createMockMember(userId, ["other_role"]);

        const result = permissionService.checkPermissions(
          guildId,
          channel,
          member as any,
          "sketchbook",
          false,
        );

        assert.equal(result.allowed, false);
        assert.equal(
          result.reason,
          permissionService.PermissionDeniedReason.USER_DENIED,
        );
      });

      it("should allow user with allowed role", () => {
        const guildId = randomGuildId();
        const userId = randomUserId();
        const channelId = randomChannelId();
        const allowedRole = randomRoleId();

        guildSettings.getOrCreateGuildSettings(guildId);
        commandPermissions.addAllowedRole(guildId, "sketchbook", allowedRole);

        const channel = createMockChannel(channelId);
        const member = createMockMember(userId, [allowedRole]);

        const result = permissionService.checkPermissions(
          guildId,
          channel,
          member as any,
          "sketchbook",
          false,
        );

        assert.equal(result.allowed, true);
      });
    });

    describe("APIInteractionGuildMember handling", () => {
      it("should handle API member with roles as string array", () => {
        const guildId = randomGuildId();
        const userId = randomUserId();
        const channelId = randomChannelId();

        guildSettings.getOrCreateGuildSettings(guildId);

        const channel = createMockChannel(channelId);
        // Use API member format where roles is string[] instead of Collection
        const member = createMockAPIMember(userId, []);

        const result = permissionService.checkPermissions(
          guildId,
          channel,
          member as any,
          "sketchbook",
          false,
        );

        assert.equal(result.allowed, true);
      });

      it("should correctly check allowed roles for API member", () => {
        const guildId = randomGuildId();
        const userId = randomUserId();
        const channelId = randomChannelId();
        const allowedRole = randomRoleId();

        guildSettings.getOrCreateGuildSettings(guildId);
        commandPermissions.addAllowedRole(guildId, "sketchbook", allowedRole);

        const channel = createMockChannel(channelId);
        // API member with the allowed role
        const member = createMockAPIMember(userId, [allowedRole]);

        const result = permissionService.checkPermissions(
          guildId,
          channel,
          member as any,
          "sketchbook",
          false,
        );

        assert.equal(result.allowed, true);
      });

      it("should deny API member without allowed role", () => {
        const guildId = randomGuildId();
        const userId = randomUserId();
        const channelId = randomChannelId();
        const allowedRole = randomRoleId();

        guildSettings.getOrCreateGuildSettings(guildId);
        commandPermissions.addAllowedRole(guildId, "sketchbook", allowedRole);

        const channel = createMockChannel(channelId);
        // API member without the required role
        const member = createMockAPIMember(userId, ["other_role"]);

        const result = permissionService.checkPermissions(
          guildId,
          channel,
          member as any,
          "sketchbook",
          false,
        );

        assert.equal(result.allowed, false);
        assert.equal(
          result.reason,
          permissionService.PermissionDeniedReason.USER_DENIED,
        );
      });

      it("should deny API member with denied role (global)", () => {
        const guildId = randomGuildId();
        const userId = randomUserId();
        const channelId = randomChannelId();
        const deniedRole = randomRoleId();

        guildSettings.addDefaultDeniedRole(guildId, deniedRole);

        const channel = createMockChannel(channelId);
        // API member with a denied role
        const member = createMockAPIMember(userId, [deniedRole]);

        const result = permissionService.checkPermissions(
          guildId,
          channel,
          member as any,
          "sketchbook",
          false,
        );

        assert.equal(result.allowed, false);
        assert.equal(
          result.reason,
          permissionService.PermissionDeniedReason.GLOBAL_USER_DENIED,
        );
      });

      it("should correctly get member ID from API member for rate limiting", () => {
        const guildId = randomGuildId();
        const userId = randomUserId();
        const channelId = randomChannelId();

        guildSettings.getOrCreateGuildSettings(guildId);
        // Set a very restrictive rate limit
        rateLimits.setRateLimit(guildId, "sketchbook", 1, 60000);

        const channel = createMockChannel(channelId);
        const member = createMockAPIMember(userId, []);

        // First call should succeed and consume rate limit
        const result1 = permissionService.checkPermissions(
          guildId,
          channel,
          member as any,
          "sketchbook",
          true, // consume rate limit
        );
        assert.equal(result1.allowed, true);

        // Second call should be rate limited
        const result2 = permissionService.checkPermissions(
          guildId,
          channel,
          member as any,
          "sketchbook",
          true,
        );
        assert.equal(result2.allowed, false);
        assert.equal(
          result2.reason,
          permissionService.PermissionDeniedReason.RATE_LIMITED,
        );
      });

      it("should handle both GuildMember and API member in same test", () => {
        const guildId = randomGuildId();
        const channelId = randomChannelId();
        const allowedRole = randomRoleId();

        guildSettings.getOrCreateGuildSettings(guildId);
        commandPermissions.addAllowedRole(guildId, "dialogue", allowedRole);

        const channel = createMockChannel(channelId);

        // Test with GuildMember (roles.cache.map style)
        const guildMember = createMockMember("user1", [allowedRole]);
        const result1 = permissionService.checkPermissions(
          guildId,
          channel,
          guildMember as any,
          "dialogue",
          false,
        );
        assert.equal(result1.allowed, true);

        // Test with APIInteractionGuildMember (roles as string[] style)
        const apiMember = createMockAPIMember("user2", [allowedRole]);
        const result2 = permissionService.checkPermissions(
          guildId,
          channel,
          apiMember as any,
          "dialogue",
          false,
        );
        assert.equal(result2.allowed, true);
      });
    });

    describe("rate limit check", () => {
      it("should deny when rate limited", () => {
        const guildId = randomGuildId();
        const userId = randomUserId();
        const channelId = randomChannelId();

        guildSettings.getOrCreateGuildSettings(guildId);
        rateLimits.setRateLimit(guildId, "sketchbook", 1, 60);
        rateLimits.recordUsage(guildId, userId, "sketchbook");

        const channel = createMockChannel(channelId);
        const member = createMockMember(userId, []);

        const result = permissionService.checkPermissions(
          guildId,
          channel,
          member as any,
          "sketchbook",
          true, // consume rate limit
        );

        assert.equal(result.allowed, false);
        assert.equal(
          result.reason,
          permissionService.PermissionDeniedReason.RATE_LIMITED,
        );
        assert.ok(result.retryAfter !== undefined);
      });

      it("should allow and consume rate limit when under limit", () => {
        const guildId = randomGuildId();
        const userId = randomUserId();
        const channelId = randomChannelId();

        guildSettings.getOrCreateGuildSettings(guildId);
        rateLimits.setRateLimit(guildId, "sketchbook", 5, 60);

        const channel = createMockChannel(channelId);
        const member = createMockMember(userId, []);

        const result = permissionService.checkPermissions(
          guildId,
          channel,
          member as any,
          "sketchbook",
          true, // consume rate limit
        );

        assert.equal(result.allowed, true);

        // Verify usage was recorded
        const count = rateLimits.getUsageCount(
          guildId,
          userId,
          "sketchbook",
          60,
        );
        assert.equal(count, 1);
      });

      it("should not consume rate limit when consumeRate is false", () => {
        const guildId = randomGuildId();
        const userId = randomUserId();
        const channelId = randomChannelId();

        guildSettings.getOrCreateGuildSettings(guildId);
        rateLimits.setRateLimit(guildId, "sketchbook", 5, 60);

        const channel = createMockChannel(channelId);
        const member = createMockMember(userId, []);

        const result = permissionService.checkPermissions(
          guildId,
          channel,
          member as any,
          "sketchbook",
          false, // don't consume
        );

        assert.equal(result.allowed, true);

        // Verify no usage was recorded
        const count = rateLimits.getUsageCount(
          guildId,
          userId,
          "sketchbook",
          60,
        );
        assert.equal(count, 0);
      });
    });

    describe("thread handling", () => {
      it("should inherit permissions from parent channel in whitelist mode", () => {
        const guildId = randomGuildId();
        const userId = randomUserId();
        const parentChannelId = randomChannelId();
        const threadId = randomChannelId();

        guildSettings.setChannelMode(guildId, "whitelist");
        channelPermissions.addChannelPermission(guildId, parentChannelId);

        const thread = createMockChannel(threadId, {
          isThread: true,
          parentId: parentChannelId,
        });
        const member = createMockMember(userId, []);

        const result = permissionService.checkPermissions(
          guildId,
          thread,
          member as any,
          "sketchbook",
          false,
        );

        assert.equal(result.allowed, true);
      });

      it("should inherit blacklist from parent channel", () => {
        const guildId = randomGuildId();
        const userId = randomUserId();
        const parentChannelId = randomChannelId();
        const threadId = randomChannelId();

        guildSettings.setChannelMode(guildId, "blacklist");
        channelPermissions.addChannelPermission(guildId, parentChannelId);

        const thread = createMockChannel(threadId, {
          isThread: true,
          parentId: parentChannelId,
        });
        const member = createMockMember(userId, []);

        const result = permissionService.checkPermissions(
          guildId,
          thread,
          member as any,
          "sketchbook",
          false,
        );

        assert.equal(result.allowed, false);
        assert.equal(
          result.reason,
          permissionService.PermissionDeniedReason.CHANNEL_NOT_ALLOWED,
        );
      });
    });
  });

  describe("isAdmin", () => {
    it("should return true for guild owner", () => {
      const userId = randomUserId();
      const member = createMockMember(userId, [], { isOwner: true });

      const result = permissionService.isAdmin(member as any);
      assert.equal(result, true);
    });

    it("should return true for user with Administrator permission", () => {
      const userId = randomUserId();
      const member = createMockMember(userId, [], { hasAdmin: true });

      const result = permissionService.isAdmin(member as any);
      assert.equal(result, true);
    });

    it("should return true for user with ManageGuild permission", () => {
      const userId = randomUserId();
      const member = createMockMember(userId, [], { hasManageGuild: true });

      const result = permissionService.isAdmin(member as any);
      assert.equal(result, true);
    });

    it("should return false for regular user", () => {
      const userId = randomUserId();
      const member = createMockMember(userId, []);

      const result = permissionService.isAdmin(member as any);
      assert.equal(result, false);
    });

    it("should return false for null member", () => {
      const result = permissionService.isAdmin(null);
      assert.equal(result, false);
    });

    describe("APIInteractionGuildMember handling", () => {
      it("should return true for API member with Administrator permission", () => {
        const userId = randomUserId();
        const member = createMockAPIMember(userId, [], { hasAdmin: true });

        const result = permissionService.isAdmin(member as any);
        assert.equal(result, true);
      });

      it("should return true for API member with ManageGuild permission", () => {
        const userId = randomUserId();
        const member = createMockAPIMember(userId, [], {
          hasManageGuild: true,
        });

        const result = permissionService.isAdmin(member as any);
        assert.equal(result, true);
      });

      it("should return true for API member who is guild owner", () => {
        const userId = randomUserId();
        const member = createMockAPIMember(userId, []);

        // Pass guildOwnerId matching the member's user ID
        const result = permissionService.isAdmin(member as any, userId);
        assert.equal(result, true);
      });

      it("should return false for API member without admin permissions", () => {
        const userId = randomUserId();
        const member = createMockAPIMember(userId, []);

        const result = permissionService.isAdmin(member as any);
        assert.equal(result, false);
      });

      it("should return false for API member who is not guild owner", () => {
        const userId = randomUserId();
        const member = createMockAPIMember(userId, []);

        // Pass different guildOwnerId
        const result = permissionService.isAdmin(member as any, "other_owner");
        assert.equal(result, false);
      });
    });
  });

  describe("canManageBot", () => {
    it("should return true for admin", () => {
      const userId = randomUserId();
      const member = createMockMember(userId, [], { hasAdmin: true });

      const result = permissionService.canManageBot(member as any);
      assert.equal(result, true);
    });

    it("should return false for non-admin", () => {
      const userId = randomUserId();
      const member = createMockMember(userId, []);

      const result = permissionService.canManageBot(member as any);
      assert.equal(result, false);
    });

    describe("APIInteractionGuildMember handling", () => {
      it("should return true for API member with Administrator permission", () => {
        const userId = randomUserId();
        const member = createMockAPIMember(userId, [], { hasAdmin: true });

        const result = permissionService.canManageBot(member as any);
        assert.equal(result, true);
      });

      it("should return true for API member with ManageGuild permission", () => {
        const userId = randomUserId();
        const member = createMockAPIMember(userId, [], {
          hasManageGuild: true,
        });

        const result = permissionService.canManageBot(member as any);
        assert.equal(result, true);
      });

      it("should return true for API member who is guild owner", () => {
        const userId = randomUserId();
        const member = createMockAPIMember(userId, []);

        const result = permissionService.canManageBot(member as any, userId);
        assert.equal(result, true);
      });

      it("should return false for API member without permissions", () => {
        const userId = randomUserId();
        const member = createMockAPIMember(userId, []);

        const result = permissionService.canManageBot(member as any);
        assert.equal(result, false);
      });
    });
  });

  describe("quickPermissionCheck", () => {
    it("should return true when all permissions pass", () => {
      const guildId = randomGuildId();
      const userId = randomUserId();
      const channelId = randomChannelId();

      guildSettings.getOrCreateGuildSettings(guildId);

      const channel = createMockChannel(channelId);
      const member = createMockMember(userId, []);

      const result = permissionService.quickPermissionCheck(
        guildId,
        channel,
        member as any,
        "sketchbook",
      );

      assert.equal(result, true);
    });

    it("should return false when any permission fails", () => {
      const guildId = randomGuildId();
      const userId = randomUserId();
      const channelId = randomChannelId();

      guildSettings.setGuildEnabled(guildId, false);

      const channel = createMockChannel(channelId);
      const member = createMockMember(userId, []);

      const result = permissionService.quickPermissionCheck(
        guildId,
        channel,
        member as any,
        "sketchbook",
      );

      assert.equal(result, false);
    });
  });

  describe("getPermissionDeniedMessageForResult", () => {
    it("should return empty string for allowed result", () => {
      const result = { allowed: true };
      const message = permissionService.getPermissionDeniedMessageForResult(
        result,
        Locale.EnglishUS,
      );
      assert.equal(message, "");
    });

    it("should return message for bot disabled", () => {
      const result = {
        allowed: false,
        reason: permissionService.PermissionDeniedReason.BOT_DISABLED,
      };
      const message = permissionService.getPermissionDeniedMessageForResult(
        result,
        Locale.EnglishUS,
      );
      assert.ok(message.length > 0);
    });

    it("should return message with retry time for rate limited", () => {
      const result = {
        allowed: false,
        reason: permissionService.PermissionDeniedReason.RATE_LIMITED,
        retryAfter: 30,
      };
      const message = permissionService.getPermissionDeniedMessageForResult(
        result,
        Locale.EnglishUS,
      );
      assert.ok(message.length > 0);
      assert.ok(message.includes("30") || message.includes("second"));
    });

    it("should return message for channel not allowed", () => {
      const result = {
        allowed: false,
        reason: permissionService.PermissionDeniedReason.CHANNEL_NOT_ALLOWED,
      };
      const message = permissionService.getPermissionDeniedMessageForResult(
        result,
        Locale.EnglishUS,
      );
      assert.ok(message.length > 0);
    });

    it("should return message for command disabled", () => {
      const result = {
        allowed: false,
        reason: permissionService.PermissionDeniedReason.COMMAND_DISABLED,
      };
      const message = permissionService.getPermissionDeniedMessageForResult(
        result,
        Locale.EnglishUS,
      );
      assert.ok(message.length > 0);
    });

    it("should return message for user denied", () => {
      const result = {
        allowed: false,
        reason: permissionService.PermissionDeniedReason.USER_DENIED,
      };
      const message = permissionService.getPermissionDeniedMessageForResult(
        result,
        Locale.EnglishUS,
      );
      assert.ok(message.length > 0);
    });
  });
});
