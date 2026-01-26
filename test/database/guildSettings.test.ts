/**
 * Guild Settings Repository Tests
 * Tests for guild-level settings CRUD operations
 */

import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";

import {
  setupTestEnvironment,
  teardownTestEnvironment,
  createTestDatabase,
  closeTestDatabase,
  randomGuildId,
  randomRoleId,
  randomChannelId,
  randomUserId,
} from "../setup.js";

// Import after environment is set up
let guildSettings: typeof import("../../src/database/repositories/guildSettings.js");
let channelPermissions: typeof import("../../src/database/repositories/channelPermissions.js");
let commandPermissions: typeof import("../../src/database/repositories/commandPermissions.js");
let rateLimits: typeof import("../../src/database/repositories/rateLimits.js");

describe("guildSettings repository", () => {
  before(async () => {
    setupTestEnvironment();
    await createTestDatabase();
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

  describe("getGuildSettings", () => {
    it("should return null for non-existent guild", () => {
      const guildId = randomGuildId();
      const settings = guildSettings.getGuildSettings(guildId);
      assert.equal(settings, null);
    });
  });

  describe("getOrCreateGuildSettings", () => {
    it("should create settings for new guild", () => {
      const guildId = randomGuildId();
      const settings = guildSettings.getOrCreateGuildSettings(guildId);

      assert.ok(settings, "Should return settings");
      assert.equal(settings.guild_id, guildId);
      assert.equal(settings.enabled, true, "Should be enabled by default");
      assert.equal(
        settings.channel_mode,
        "all",
        "Should have 'all' channel mode by default",
      );
      assert.equal(
        settings.default_language,
        null,
        "Should have no default language",
      );
      assert.deepEqual(settings.allowed_roles, []);
      assert.deepEqual(settings.denied_roles, []);
    });

    it("should return existing settings", () => {
      const guildId = randomGuildId();
      const first = guildSettings.getOrCreateGuildSettings(guildId);
      const second = guildSettings.getOrCreateGuildSettings(guildId);

      assert.equal(first.guild_id, second.guild_id);
      assert.equal(first.created_at, second.created_at);
    });
  });

  describe("updateGuildSettings", () => {
    it("should update enabled state", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);

      const updated = guildSettings.updateGuildSettings(guildId, {
        enabled: false,
      });
      assert.ok(updated);
      assert.equal(updated!.enabled, false);
    });

    it("should update channel_mode", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);

      const updated = guildSettings.updateGuildSettings(guildId, {
        channel_mode: "whitelist",
      });
      assert.ok(updated);
      assert.equal(updated!.channel_mode, "whitelist");
    });

    it("should update default_language", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);

      const updated = guildSettings.updateGuildSettings(guildId, {
        default_language: "ja",
      });
      assert.ok(updated);
      assert.equal(updated!.default_language, "ja");
    });

    it("should update multiple fields at once", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);

      const updated = guildSettings.updateGuildSettings(guildId, {
        enabled: false,
        channel_mode: "blacklist",
        default_language: "zh-CN",
      });
      assert.ok(updated);
      assert.equal(updated!.enabled, false);
      assert.equal(updated!.channel_mode, "blacklist");
      assert.equal(updated!.default_language, "zh-CN");
    });

    it("should create settings if they don't exist", () => {
      const guildId = randomGuildId();
      const updated = guildSettings.updateGuildSettings(guildId, {
        enabled: false,
      });
      assert.ok(updated);
      assert.equal(updated!.enabled, false);
    });
  });

  describe("setGuildEnabled", () => {
    it("should enable guild", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);
      guildSettings.setGuildEnabled(guildId, false);

      const result = guildSettings.setGuildEnabled(guildId, true);
      assert.ok(result);
      assert.equal(result!.enabled, true);
    });

    it("should disable guild", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);

      const result = guildSettings.setGuildEnabled(guildId, false);
      assert.ok(result);
      assert.equal(result!.enabled, false);
    });
  });

  describe("setChannelMode", () => {
    it("should set whitelist mode", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);

      const result = guildSettings.setChannelMode(guildId, "whitelist");
      assert.ok(result);
      assert.equal(result!.channel_mode, "whitelist");
    });

    it("should set blacklist mode", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);

      const result = guildSettings.setChannelMode(guildId, "blacklist");
      assert.ok(result);
      assert.equal(result!.channel_mode, "blacklist");
    });

    it("should set all mode", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);
      guildSettings.setChannelMode(guildId, "whitelist");

      const result = guildSettings.setChannelMode(guildId, "all");
      assert.ok(result);
      assert.equal(result!.channel_mode, "all");
    });
  });

  describe("setDefaultLanguage", () => {
    it("should set default language", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);

      const result = guildSettings.setDefaultLanguage(guildId, "ja");
      assert.ok(result);
      assert.equal(result!.default_language, "ja");
    });

    it("should clear default language with null", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);
      guildSettings.setDefaultLanguage(guildId, "ja");

      const result = guildSettings.setDefaultLanguage(guildId, null);
      assert.ok(result);
      assert.equal(result!.default_language, null);
    });
  });

  describe("getGuildDefaultLanguage", () => {
    it("should return null for guild without language set", () => {
      const guildId = randomGuildId();
      const language = guildSettings.getGuildDefaultLanguage(guildId);
      assert.equal(language, null);
    });

    it("should return language when set", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);
      guildSettings.setDefaultLanguage(guildId, "ko");

      const language = guildSettings.getGuildDefaultLanguage(guildId);
      assert.equal(language, "ko");
    });
  });

  describe("isGuildEnabled", () => {
    it("should return true for non-existent guild (default)", () => {
      const guildId = randomGuildId();
      const enabled = guildSettings.isGuildEnabled(guildId);
      assert.equal(enabled, true);
    });

    it("should return true for enabled guild", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);
      const enabled = guildSettings.isGuildEnabled(guildId);
      assert.equal(enabled, true);
    });

    it("should return false for disabled guild", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);
      guildSettings.setGuildEnabled(guildId, false);

      const enabled = guildSettings.isGuildEnabled(guildId);
      assert.equal(enabled, false);
    });
  });

  describe("getChannelModeForGuild", () => {
    it("should return 'all' for non-existent guild", () => {
      const guildId = randomGuildId();
      const mode = guildSettings.getChannelModeForGuild(guildId);
      assert.equal(mode, "all");
    });

    it("should return configured mode", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);
      guildSettings.setChannelMode(guildId, "whitelist");

      const mode = guildSettings.getChannelModeForGuild(guildId);
      assert.equal(mode, "whitelist");
    });
  });

  describe("default role permissions", () => {
    describe("addDefaultAllowedRole", () => {
      it("should add role to allowed list", () => {
        const guildId = randomGuildId();
        const roleId = randomRoleId();
        guildSettings.addDefaultAllowedRole(guildId, roleId);

        const settings = guildSettings.getGuildSettings(guildId);
        assert.ok(settings);
        assert.ok(settings!.allowed_roles.includes(roleId));
      });

      it("should not duplicate role", () => {
        const guildId = randomGuildId();
        const roleId = randomRoleId();
        guildSettings.addDefaultAllowedRole(guildId, roleId);
        guildSettings.addDefaultAllowedRole(guildId, roleId);

        const settings = guildSettings.getGuildSettings(guildId);
        const roleCount = settings!.allowed_roles.filter(
          (r) => r === roleId,
        ).length;
        assert.equal(roleCount, 1);
      });

      it("should remove role from denied list when adding to allowed", () => {
        const guildId = randomGuildId();
        const roleId = randomRoleId();
        guildSettings.addDefaultDeniedRole(guildId, roleId);
        guildSettings.addDefaultAllowedRole(guildId, roleId);

        const settings = guildSettings.getGuildSettings(guildId);
        assert.ok(settings!.allowed_roles.includes(roleId));
        assert.ok(!settings!.denied_roles.includes(roleId));
      });
    });

    describe("removeDefaultAllowedRole", () => {
      it("should remove role from allowed list", () => {
        const guildId = randomGuildId();
        const roleId = randomRoleId();
        guildSettings.addDefaultAllowedRole(guildId, roleId);
        guildSettings.removeDefaultAllowedRole(guildId, roleId);

        const settings = guildSettings.getGuildSettings(guildId);
        assert.ok(!settings!.allowed_roles.includes(roleId));
      });
    });

    describe("addDefaultDeniedRole", () => {
      it("should add role to denied list", () => {
        const guildId = randomGuildId();
        const roleId = randomRoleId();
        guildSettings.addDefaultDeniedRole(guildId, roleId);

        const settings = guildSettings.getGuildSettings(guildId);
        assert.ok(settings);
        assert.ok(settings!.denied_roles.includes(roleId));
      });

      it("should remove role from allowed list when adding to denied", () => {
        const guildId = randomGuildId();
        const roleId = randomRoleId();
        guildSettings.addDefaultAllowedRole(guildId, roleId);
        guildSettings.addDefaultDeniedRole(guildId, roleId);

        const settings = guildSettings.getGuildSettings(guildId);
        assert.ok(!settings!.allowed_roles.includes(roleId));
        assert.ok(settings!.denied_roles.includes(roleId));
      });
    });

    describe("removeDefaultDeniedRole", () => {
      it("should remove role from denied list", () => {
        const guildId = randomGuildId();
        const roleId = randomRoleId();
        guildSettings.addDefaultDeniedRole(guildId, roleId);
        guildSettings.removeDefaultDeniedRole(guildId, roleId);

        const settings = guildSettings.getGuildSettings(guildId);
        assert.ok(!settings!.denied_roles.includes(roleId));
      });
    });

    describe("removeDefaultRole", () => {
      it("should remove role from both lists", () => {
        const guildId = randomGuildId();
        const roleId = randomRoleId();
        guildSettings.addDefaultAllowedRole(guildId, roleId);

        guildSettings.removeDefaultRole(guildId, roleId);

        const settings = guildSettings.getGuildSettings(guildId);
        assert.ok(!settings!.allowed_roles.includes(roleId));
        assert.ok(!settings!.denied_roles.includes(roleId));
      });
    });

    describe("clearDefaultRoles", () => {
      it("should clear all role permissions", () => {
        const guildId = randomGuildId();
        guildSettings.addDefaultAllowedRole(guildId, randomRoleId());
        guildSettings.addDefaultAllowedRole(guildId, randomRoleId());
        guildSettings.addDefaultDeniedRole(guildId, randomRoleId());

        guildSettings.clearDefaultRoles(guildId);

        const settings = guildSettings.getGuildSettings(guildId);
        assert.deepEqual(settings!.allowed_roles, []);
        assert.deepEqual(settings!.denied_roles, []);
      });
    });
  });

  describe("canUserUseBot", () => {
    it("should allow by default (no roles configured)", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);

      const canUse = guildSettings.canUserUseBot(guildId, ["some_role"]);
      assert.equal(canUse, true);
    });

    it("should deny user with denied role", () => {
      const guildId = randomGuildId();
      const deniedRole = randomRoleId();
      guildSettings.addDefaultDeniedRole(guildId, deniedRole);

      const canUse = guildSettings.canUserUseBot(guildId, [deniedRole]);
      assert.equal(canUse, false);
    });

    it("should allow user with allowed role", () => {
      const guildId = randomGuildId();
      const allowedRole = randomRoleId();
      guildSettings.addDefaultAllowedRole(guildId, allowedRole);

      const canUse = guildSettings.canUserUseBot(guildId, [allowedRole]);
      assert.equal(canUse, true);
    });

    it("should deny user without allowed role when allowed roles exist", () => {
      const guildId = randomGuildId();
      const allowedRole = randomRoleId();
      guildSettings.addDefaultAllowedRole(guildId, allowedRole);

      const canUse = guildSettings.canUserUseBot(guildId, ["other_role"]);
      assert.equal(canUse, false);
    });

    it("denied role should take priority over allowed role", () => {
      const guildId = randomGuildId();
      const allowedRole = randomRoleId();
      const deniedRole = randomRoleId();
      guildSettings.addDefaultAllowedRole(guildId, allowedRole);
      guildSettings.addDefaultDeniedRole(guildId, deniedRole);

      const canUse = guildSettings.canUserUseBot(guildId, [
        allowedRole,
        deniedRole,
      ]);
      assert.equal(canUse, false);
    });
  });

  describe("cleanupDeletedDefaultRoles", () => {
    it("should remove roles not in existing set", () => {
      const guildId = randomGuildId();
      const existingRole = randomRoleId();
      const deletedRole = randomRoleId();

      guildSettings.addDefaultAllowedRole(guildId, existingRole);
      guildSettings.addDefaultAllowedRole(guildId, deletedRole);

      const existingRoleIds = new Set([existingRole]);
      const removedCount = guildSettings.cleanupDeletedDefaultRoles(
        guildId,
        existingRoleIds,
      );

      assert.equal(removedCount, 1);
      const settings = guildSettings.getGuildSettings(guildId);
      assert.ok(settings!.allowed_roles.includes(existingRole));
      assert.ok(!settings!.allowed_roles.includes(deletedRole));
    });

    it("should cleanup both allowed and denied roles", () => {
      const guildId = randomGuildId();
      const existingAllowed = randomRoleId();
      const deletedAllowed = randomRoleId();
      const deletedDenied = randomRoleId();

      guildSettings.addDefaultAllowedRole(guildId, existingAllowed);
      guildSettings.addDefaultAllowedRole(guildId, deletedAllowed);
      guildSettings.addDefaultDeniedRole(guildId, deletedDenied);

      const existingRoleIds = new Set([existingAllowed]);
      const removedCount = guildSettings.cleanupDeletedDefaultRoles(
        guildId,
        existingRoleIds,
      );

      assert.equal(removedCount, 2);
    });
  });

  describe("resetGeneralSettings", () => {
    it("should reset enabled and default_language", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);
      guildSettings.setGuildEnabled(guildId, false);
      guildSettings.setDefaultLanguage(guildId, "ja");

      guildSettings.resetGeneralSettings(guildId);

      const settings = guildSettings.getGuildSettings(guildId);
      assert.equal(settings!.enabled, true);
      assert.equal(settings!.default_language, null);
    });
  });

  describe("deleteGuildData", () => {
    it("should delete all guild data", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);
      guildSettings.addDefaultAllowedRole(guildId, randomRoleId());

      guildSettings.deleteGuildData(guildId);

      const settings = guildSettings.getGuildSettings(guildId);
      assert.equal(settings, null);
    });

    it("should cascade delete channel permissions", () => {
      const guildId = randomGuildId();
      const channelId = randomChannelId();

      // Create guild settings and channel permissions
      guildSettings.getOrCreateGuildSettings(guildId);
      channelPermissions.addChannelPermission(guildId, channelId, true);

      // Verify channel permission exists
      const permissionBefore = channelPermissions.getChannelPermission(
        guildId,
        channelId,
      );
      assert.ok(
        permissionBefore,
        "Channel permission should exist before deletion",
      );

      // Delete guild data
      guildSettings.deleteGuildData(guildId);

      // Verify channel permission is also deleted
      const permissionAfter = channelPermissions.getChannelPermission(
        guildId,
        channelId,
      );
      assert.equal(
        permissionAfter,
        null,
        "Channel permission should be deleted via cascade",
      );
    });

    it("should cascade delete command permissions", () => {
      const guildId = randomGuildId();
      const commandName = "sketchbook";

      // Create guild settings and command permissions
      guildSettings.getOrCreateGuildSettings(guildId);
      commandPermissions.getOrCreateCommandPermission(guildId, commandName);
      commandPermissions.setCommandEnabled(guildId, commandName, false);
      commandPermissions.addAllowedRole(guildId, commandName, randomRoleId());

      // Verify command permission exists
      const permissionBefore = commandPermissions.getCommandPermission(
        guildId,
        commandName,
      );
      assert.ok(
        permissionBefore,
        "Command permission should exist before deletion",
      );
      assert.equal(permissionBefore!.enabled, false);

      // Delete guild data
      guildSettings.deleteGuildData(guildId);

      // Verify command permission is also deleted
      const permissionAfter = commandPermissions.getCommandPermission(
        guildId,
        commandName,
      );
      assert.equal(
        permissionAfter,
        null,
        "Command permission should be deleted via cascade",
      );
    });

    it("should cascade delete command channel permissions", () => {
      const guildId = randomGuildId();
      const commandName = "dialogue";
      const channelId = randomChannelId();

      // Create guild settings, command permissions, and command channel permissions
      guildSettings.getOrCreateGuildSettings(guildId);
      commandPermissions.getOrCreateCommandPermission(guildId, commandName);
      commandPermissions.addCommandChannelPermission(
        guildId,
        commandName,
        channelId,
      );

      // Verify command channel permission exists
      const permissionBefore = commandPermissions.getCommandChannelPermission(
        guildId,
        commandName,
        channelId,
      );
      assert.ok(
        permissionBefore,
        "Command channel permission should exist before deletion",
      );

      // Delete guild data
      guildSettings.deleteGuildData(guildId);

      // Verify command channel permission is also deleted
      const permissionAfter = commandPermissions.getCommandChannelPermission(
        guildId,
        commandName,
        channelId,
      );
      assert.equal(
        permissionAfter,
        null,
        "Command channel permission should be deleted via cascade",
      );
    });

    it("should cascade delete rate limit settings", () => {
      const guildId = randomGuildId();
      const commandName = "sketchbook";

      // Create guild settings and rate limit settings
      guildSettings.getOrCreateGuildSettings(guildId);
      rateLimits.setRateLimit(guildId, null, 5, 60); // Global rate limit
      rateLimits.setRateLimit(guildId, commandName, 3, 30); // Command rate limit

      // Verify rate limit settings exist
      const globalLimitBefore = rateLimits.getRateLimitSetting(guildId, null);
      const commandLimitBefore = rateLimits.getRateLimitSetting(
        guildId,
        commandName,
      );
      assert.ok(
        globalLimitBefore,
        "Global rate limit should exist before deletion",
      );
      assert.ok(
        commandLimitBefore,
        "Command rate limit should exist before deletion",
      );

      // Delete guild data
      guildSettings.deleteGuildData(guildId);

      // Verify rate limit settings are also deleted
      const globalLimitAfter = rateLimits.getRateLimitSetting(guildId, null);
      const commandLimitAfter = rateLimits.getRateLimitSetting(
        guildId,
        commandName,
      );
      assert.equal(
        globalLimitAfter,
        null,
        "Global rate limit should be deleted via cascade",
      );
      assert.equal(
        commandLimitAfter,
        null,
        "Command rate limit should be deleted via cascade",
      );
    });

    it("should cascade delete rate limit usage", () => {
      const guildId = randomGuildId();
      const userId = randomUserId();
      const commandName = "dialogue";

      // Create guild settings and record some usage
      guildSettings.getOrCreateGuildSettings(guildId);
      rateLimits.setRateLimit(guildId, commandName, 5, 60);
      rateLimits.recordUsage(guildId, userId, commandName);
      rateLimits.recordUsage(guildId, userId, commandName);

      // Verify usage is recorded
      const usageCountBefore = rateLimits.getUsageCount(
        guildId,
        userId,
        commandName,
        60,
      );
      assert.equal(
        usageCountBefore,
        2,
        "Usage count should be 2 before deletion",
      );

      // Delete guild data
      guildSettings.deleteGuildData(guildId);

      // Verify rate limit usage is also deleted
      const usageCountAfter = rateLimits.getUsageCount(
        guildId,
        userId,
        commandName,
        60,
      );
      assert.equal(
        usageCountAfter,
        0,
        "Usage count should be 0 after cascade deletion",
      );
    });

    it("should cascade delete all related data at once", () => {
      const guildId = randomGuildId();
      const channelId1 = randomChannelId();
      const channelId2 = randomChannelId();
      const roleId = randomRoleId();
      const userId = randomUserId();

      // Create comprehensive guild data
      guildSettings.getOrCreateGuildSettings(guildId);
      guildSettings.setGuildEnabled(guildId, false);
      guildSettings.setChannelMode(guildId, "whitelist");
      guildSettings.setDefaultLanguage(guildId, "ja");
      guildSettings.addDefaultAllowedRole(guildId, roleId);

      // Add channel permissions
      channelPermissions.addChannelPermission(guildId, channelId1, true);
      channelPermissions.addChannelPermission(guildId, channelId2, false);

      // Add command permissions for sketchbook
      commandPermissions.getOrCreateCommandPermission(guildId, "sketchbook");
      commandPermissions.setCommandEnabled(guildId, "sketchbook", false);
      commandPermissions.setCommandChannelMode(
        guildId,
        "sketchbook",
        "blacklist",
      );
      commandPermissions.addCommandChannelPermission(
        guildId,
        "sketchbook",
        channelId1,
      );
      commandPermissions.addAllowedRole(guildId, "sketchbook", roleId);

      // Add command permissions for dialogue
      commandPermissions.getOrCreateCommandPermission(guildId, "dialogue");
      commandPermissions.setCommandChannelMode(
        guildId,
        "dialogue",
        "whitelist",
      );
      commandPermissions.addCommandChannelPermission(
        guildId,
        "dialogue",
        channelId2,
      );

      // Add rate limits
      rateLimits.setRateLimit(guildId, null, 10, 120);
      rateLimits.setRateLimit(guildId, "sketchbook", 5, 60);
      rateLimits.recordUsage(guildId, userId, "sketchbook");
      rateLimits.recordUsage(guildId, userId, null);

      // Delete all guild data
      guildSettings.deleteGuildData(guildId);

      // Verify all data is deleted
      assert.equal(
        guildSettings.getGuildSettings(guildId),
        null,
        "Guild settings should be deleted",
      );
      assert.deepEqual(
        channelPermissions.getChannelPermissions(guildId),
        [],
        "Channel permissions should be deleted",
      );
      assert.deepEqual(
        commandPermissions.getGuildCommandPermissions(guildId),
        [],
        "Command permissions should be deleted",
      );
      assert.deepEqual(
        commandPermissions.getCommandChannelPermissions(guildId, "sketchbook"),
        [],
        "Sketchbook command channels should be deleted",
      );
      assert.deepEqual(
        commandPermissions.getCommandChannelPermissions(guildId, "dialogue"),
        [],
        "Dialogue command channels should be deleted",
      );
      assert.deepEqual(
        rateLimits.getGuildRateLimitSettings(guildId),
        [],
        "Rate limit settings should be deleted",
      );
      assert.equal(
        rateLimits.getUsageCount(guildId, userId, "sketchbook", 3600),
        0,
        "Rate limit usage should be deleted",
      );
    });

    it("should not affect other guilds when deleting one guild", () => {
      const guildId1 = randomGuildId();
      const guildId2 = randomGuildId();
      const channelId = randomChannelId();
      const roleId = randomRoleId();

      // Set up data for both guilds
      guildSettings.getOrCreateGuildSettings(guildId1);
      guildSettings.setGuildEnabled(guildId1, false);
      guildSettings.addDefaultAllowedRole(guildId1, roleId);
      channelPermissions.addChannelPermission(guildId1, channelId, true);
      commandPermissions.getOrCreateCommandPermission(guildId1, "sketchbook");
      rateLimits.setRateLimit(guildId1, null, 5, 60);

      guildSettings.getOrCreateGuildSettings(guildId2);
      guildSettings.setGuildEnabled(guildId2, false);
      guildSettings.addDefaultDeniedRole(guildId2, roleId);
      channelPermissions.addChannelPermission(guildId2, channelId, false);
      commandPermissions.getOrCreateCommandPermission(guildId2, "dialogue");
      rateLimits.setRateLimit(guildId2, "dialogue", 3, 30);

      // Delete only guild1
      guildSettings.deleteGuildData(guildId1);

      // Verify guild1 is deleted
      assert.equal(
        guildSettings.getGuildSettings(guildId1),
        null,
        "Guild 1 settings should be deleted",
      );

      // Verify guild2 is intact
      const guild2Settings = guildSettings.getGuildSettings(guildId2);
      assert.ok(guild2Settings, "Guild 2 settings should still exist");
      assert.equal(guild2Settings!.enabled, false);
      assert.ok(guild2Settings!.denied_roles.includes(roleId));

      const guild2Channels = channelPermissions.getChannelPermissions(guildId2);
      assert.equal(
        guild2Channels.length,
        1,
        "Guild 2 channels should still exist",
      );

      const guild2Commands =
        commandPermissions.getGuildCommandPermissions(guildId2);
      assert.equal(
        guild2Commands.length,
        1,
        "Guild 2 commands should still exist",
      );

      const guild2RateLimits = rateLimits.getGuildRateLimitSettings(guildId2);
      assert.equal(
        guild2RateLimits.length,
        1,
        "Guild 2 rate limits should still exist",
      );
    });

    it("should handle deleting non-existent guild gracefully", () => {
      const guildId = randomGuildId();

      // Should not throw when deleting non-existent guild
      assert.doesNotThrow(() => {
        guildSettings.deleteGuildData(guildId);
      });

      // Verify nothing is affected
      const settings = guildSettings.getGuildSettings(guildId);
      assert.equal(settings, null);
    });
  });
});
