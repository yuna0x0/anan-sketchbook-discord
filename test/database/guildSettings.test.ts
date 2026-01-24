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
} from "../setup.js";

// Import after environment is set up
let guildSettings: typeof import("../../src/database/repositories/guildSettings.js");

describe("guildSettings repository", () => {
  before(async () => {
    setupTestEnvironment();
    await createTestDatabase();
    guildSettings = await import(
      "../../src/database/repositories/guildSettings.js"
    );
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
        "Should have 'all' channel mode by default"
      );
      assert.equal(
        settings.default_language,
        null,
        "Should have no default language"
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
          (r) => r === roleId
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
        existingRoleIds
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
        existingRoleIds
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
  });
});
