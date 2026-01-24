/**
 * Command Permissions Repository Tests
 * Tests for per-command permission CRUD operations
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
  randomRoleId,
} from "../setup.js";

// Import after environment is set up
let commandPermissions: typeof import("../../src/database/repositories/commandPermissions.js");
let guildSettings: typeof import("../../src/database/repositories/guildSettings.js");

describe("commandPermissions repository", () => {
  before(async () => {
    setupTestEnvironment();
    await createTestDatabase();
    commandPermissions =
      await import("../../src/database/repositories/commandPermissions.js");
    guildSettings =
      await import("../../src/database/repositories/guildSettings.js");
  });

  after(async () => {
    await closeTestDatabase();
    teardownTestEnvironment();
  });

  describe("getCommandPermission", () => {
    it("should return null for non-existent permission", () => {
      const guildId = randomGuildId();
      const permission = commandPermissions.getCommandPermission(
        guildId,
        "sketchbook",
      );
      assert.equal(permission, null);
    });
  });

  describe("getOrCreateCommandPermission", () => {
    it("should create default permission for new command", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);

      const permission = commandPermissions.getOrCreateCommandPermission(
        guildId,
        "sketchbook",
      );

      assert.ok(permission, "Should return permission");
      assert.equal(permission.guild_id, guildId);
      assert.equal(permission.command_name, "sketchbook");
      assert.equal(permission.enabled, true, "Should be enabled by default");
      assert.deepEqual(permission.allowed_roles, []);
      assert.deepEqual(permission.denied_roles, []);
      assert.equal(permission.channel_mode, "inherit");
    });

    it("should return existing permission", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);

      const first = commandPermissions.getOrCreateCommandPermission(
        guildId,
        "sketchbook",
      );
      const second = commandPermissions.getOrCreateCommandPermission(
        guildId,
        "sketchbook",
      );

      assert.equal(first.id, second.id);
      assert.equal(first.created_at, second.created_at);
    });
  });

  describe("getGuildCommandPermissions", () => {
    it("should return empty array for guild with no command permissions", () => {
      const guildId = randomGuildId();
      const permissions =
        commandPermissions.getGuildCommandPermissions(guildId);

      assert.ok(Array.isArray(permissions));
      assert.equal(permissions.length, 0);
    });

    it("should return all command permissions for guild", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);

      commandPermissions.getOrCreateCommandPermission(guildId, "sketchbook");
      commandPermissions.getOrCreateCommandPermission(guildId, "dialogue");
      commandPermissions.getOrCreateCommandPermission(guildId, "settings");

      const permissions =
        commandPermissions.getGuildCommandPermissions(guildId);

      assert.equal(permissions.length, 3);
    });
  });

  describe("setCommandEnabled", () => {
    it("should enable command", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);
      commandPermissions.setCommandEnabled(guildId, "sketchbook", false);

      commandPermissions.setCommandEnabled(guildId, "sketchbook", true);

      const permission = commandPermissions.getCommandPermission(
        guildId,
        "sketchbook",
      );
      assert.equal(permission!.enabled, true);
    });

    it("should disable command", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);

      commandPermissions.setCommandEnabled(guildId, "sketchbook", false);

      const permission = commandPermissions.getCommandPermission(
        guildId,
        "sketchbook",
      );
      assert.equal(permission!.enabled, false);
    });
  });

  describe("isCommandEnabled", () => {
    it("should return true for non-configured command (default)", () => {
      const guildId = randomGuildId();
      const enabled = commandPermissions.isCommandEnabled(
        guildId,
        "sketchbook",
      );
      assert.equal(enabled, true);
    });

    it("should return configured state", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);
      commandPermissions.setCommandEnabled(guildId, "sketchbook", false);

      const enabled = commandPermissions.isCommandEnabled(
        guildId,
        "sketchbook",
      );
      assert.equal(enabled, false);
    });
  });

  describe("role permissions", () => {
    describe("addAllowedRole", () => {
      it("should add role to allowed list", () => {
        const guildId = randomGuildId();
        const roleId = randomRoleId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.addAllowedRole(guildId, "sketchbook", roleId);

        const permission = commandPermissions.getCommandPermission(
          guildId,
          "sketchbook",
        );
        assert.ok(permission!.allowed_roles.includes(roleId));
      });

      it("should not duplicate role", () => {
        const guildId = randomGuildId();
        const roleId = randomRoleId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.addAllowedRole(guildId, "sketchbook", roleId);
        commandPermissions.addAllowedRole(guildId, "sketchbook", roleId);

        const permission = commandPermissions.getCommandPermission(
          guildId,
          "sketchbook",
        );
        const roleCount = permission!.allowed_roles.filter(
          (r) => r === roleId,
        ).length;
        assert.equal(roleCount, 1);
      });

      it("should remove role from denied list when adding to allowed", () => {
        const guildId = randomGuildId();
        const roleId = randomRoleId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.addDeniedRole(guildId, "sketchbook", roleId);
        commandPermissions.addAllowedRole(guildId, "sketchbook", roleId);

        const permission = commandPermissions.getCommandPermission(
          guildId,
          "sketchbook",
        );
        assert.ok(permission!.allowed_roles.includes(roleId));
        assert.ok(!permission!.denied_roles.includes(roleId));
      });
    });

    describe("removeAllowedRole", () => {
      it("should remove role from allowed list", () => {
        const guildId = randomGuildId();
        const roleId = randomRoleId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.addAllowedRole(guildId, "sketchbook", roleId);
        commandPermissions.removeAllowedRole(guildId, "sketchbook", roleId);

        const permission = commandPermissions.getCommandPermission(
          guildId,
          "sketchbook",
        );
        assert.ok(!permission!.allowed_roles.includes(roleId));
      });
    });

    describe("addDeniedRole", () => {
      it("should add role to denied list", () => {
        const guildId = randomGuildId();
        const roleId = randomRoleId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.addDeniedRole(guildId, "sketchbook", roleId);

        const permission = commandPermissions.getCommandPermission(
          guildId,
          "sketchbook",
        );
        assert.ok(permission!.denied_roles.includes(roleId));
      });

      it("should remove role from allowed list when adding to denied", () => {
        const guildId = randomGuildId();
        const roleId = randomRoleId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.addAllowedRole(guildId, "sketchbook", roleId);
        commandPermissions.addDeniedRole(guildId, "sketchbook", roleId);

        const permission = commandPermissions.getCommandPermission(
          guildId,
          "sketchbook",
        );
        assert.ok(!permission!.allowed_roles.includes(roleId));
        assert.ok(permission!.denied_roles.includes(roleId));
      });
    });

    describe("removeDeniedRole", () => {
      it("should remove role from denied list", () => {
        const guildId = randomGuildId();
        const roleId = randomRoleId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.addDeniedRole(guildId, "sketchbook", roleId);
        commandPermissions.removeDeniedRole(guildId, "sketchbook", roleId);

        const permission = commandPermissions.getCommandPermission(
          guildId,
          "sketchbook",
        );
        assert.ok(!permission!.denied_roles.includes(roleId));
      });
    });

    describe("clearCommandRoles", () => {
      it("should clear all role permissions for command", () => {
        const guildId = randomGuildId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.addAllowedRole(
          guildId,
          "sketchbook",
          randomRoleId(),
        );
        commandPermissions.addAllowedRole(
          guildId,
          "sketchbook",
          randomRoleId(),
        );
        commandPermissions.addDeniedRole(guildId, "sketchbook", randomRoleId());

        commandPermissions.clearCommandRoles(guildId, "sketchbook");

        const permission = commandPermissions.getCommandPermission(
          guildId,
          "sketchbook",
        );
        assert.deepEqual(permission!.allowed_roles, []);
        assert.deepEqual(permission!.denied_roles, []);
      });
    });
  });

  describe("canUserUseCommand", () => {
    it("should allow by default (no roles configured)", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);

      const canUse = commandPermissions.canUserUseCommand(
        guildId,
        "sketchbook",
        ["some_role"],
      );
      assert.equal(canUse, true);
    });

    it("should deny user with denied role", () => {
      const guildId = randomGuildId();
      const deniedRole = randomRoleId();
      guildSettings.getOrCreateGuildSettings(guildId);
      commandPermissions.addDeniedRole(guildId, "sketchbook", deniedRole);

      const canUse = commandPermissions.canUserUseCommand(
        guildId,
        "sketchbook",
        [deniedRole],
      );
      assert.equal(canUse, false);
    });

    it("should allow user with allowed role", () => {
      const guildId = randomGuildId();
      const allowedRole = randomRoleId();
      guildSettings.getOrCreateGuildSettings(guildId);
      commandPermissions.addAllowedRole(guildId, "sketchbook", allowedRole);

      const canUse = commandPermissions.canUserUseCommand(
        guildId,
        "sketchbook",
        [allowedRole],
      );
      assert.equal(canUse, true);
    });

    it("should deny user without allowed role when allowed roles exist", () => {
      const guildId = randomGuildId();
      const allowedRole = randomRoleId();
      guildSettings.getOrCreateGuildSettings(guildId);
      commandPermissions.addAllowedRole(guildId, "sketchbook", allowedRole);

      const canUse = commandPermissions.canUserUseCommand(
        guildId,
        "sketchbook",
        ["other_role"],
      );
      assert.equal(canUse, false);
    });

    it("denied role should take priority over allowed role", () => {
      const guildId = randomGuildId();
      const allowedRole = randomRoleId();
      const deniedRole = randomRoleId();
      guildSettings.getOrCreateGuildSettings(guildId);
      commandPermissions.addAllowedRole(guildId, "sketchbook", allowedRole);
      commandPermissions.addDeniedRole(guildId, "sketchbook", deniedRole);

      const canUse = commandPermissions.canUserUseCommand(
        guildId,
        "sketchbook",
        [allowedRole, deniedRole],
      );
      assert.equal(canUse, false);
    });
  });

  describe("command channel permissions", () => {
    describe("setCommandChannelMode", () => {
      it("should set whitelist mode", () => {
        const guildId = randomGuildId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.setCommandChannelMode(
          guildId,
          "sketchbook",
          "whitelist",
        );

        const mode = commandPermissions.getCommandChannelMode(
          guildId,
          "sketchbook",
        );
        assert.equal(mode, "whitelist");
      });

      it("should set blacklist mode", () => {
        const guildId = randomGuildId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.setCommandChannelMode(
          guildId,
          "sketchbook",
          "blacklist",
        );

        const mode = commandPermissions.getCommandChannelMode(
          guildId,
          "sketchbook",
        );
        assert.equal(mode, "blacklist");
      });

      it("should set inherit mode (use default)", () => {
        const guildId = randomGuildId();
        guildSettings.getOrCreateGuildSettings(guildId);
        commandPermissions.setCommandChannelMode(
          guildId,
          "sketchbook",
          "whitelist",
        );

        commandPermissions.setCommandChannelMode(
          guildId,
          "sketchbook",
          "inherit",
        );

        const mode = commandPermissions.getCommandChannelMode(
          guildId,
          "sketchbook",
        );
        assert.equal(mode, "inherit");
      });
    });

    describe("getCommandChannelMode", () => {
      it("should return inherit for non-configured command", () => {
        const guildId = randomGuildId();
        guildSettings.getOrCreateGuildSettings(guildId);
        commandPermissions.getOrCreateCommandPermission(guildId, "sketchbook");
        const mode = commandPermissions.getCommandChannelMode(
          guildId,
          "sketchbook",
        );
        assert.equal(mode, "inherit");
      });
    });

    describe("addCommandChannelPermission", () => {
      it("should add channel to command list", () => {
        const guildId = randomGuildId();
        const channelId = randomChannelId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.addCommandChannelPermission(
          guildId,
          "sketchbook",
          channelId,
        );

        const inList = commandPermissions.isChannelInCommandList(
          guildId,
          "sketchbook",
          channelId,
        );
        assert.equal(inList, true);
      });
    });

    describe("getCommandChannelPermission", () => {
      it("should return null for non-existent permission", () => {
        const guildId = randomGuildId();
        const channelId = randomChannelId();

        const permission = commandPermissions.getCommandChannelPermission(
          guildId,
          "sketchbook",
          channelId,
        );
        assert.equal(permission, null);
      });

      it("should return existing permission", () => {
        const guildId = randomGuildId();
        const channelId = randomChannelId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.addCommandChannelPermission(
          guildId,
          "sketchbook",
          channelId,
        );

        const permission = commandPermissions.getCommandChannelPermission(
          guildId,
          "sketchbook",
          channelId,
        );
        assert.ok(permission);
        assert.equal(permission!.channel_id, channelId);
      });
    });

    describe("getCommandChannelPermissions", () => {
      it("should return all channels for command", () => {
        const guildId = randomGuildId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.addCommandChannelPermission(
          guildId,
          "sketchbook",
          randomChannelId(),
        );
        commandPermissions.addCommandChannelPermission(
          guildId,
          "sketchbook",
          randomChannelId(),
        );
        commandPermissions.addCommandChannelPermission(
          guildId,
          "sketchbook",
          randomChannelId(),
        );

        const permissions = commandPermissions.getCommandChannelPermissions(
          guildId,
          "sketchbook",
        );
        assert.equal(permissions.length, 3);
      });

      it("should not include channels from other commands", () => {
        const guildId = randomGuildId();
        const channel1 = randomChannelId();
        const channel2 = randomChannelId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.addCommandChannelPermission(
          guildId,
          "sketchbook",
          channel1,
        );
        commandPermissions.addCommandChannelPermission(
          guildId,
          "dialogue",
          channel2,
        );

        const permissions = commandPermissions.getCommandChannelPermissions(
          guildId,
          "sketchbook",
        );
        assert.equal(permissions.length, 1);
        assert.equal(permissions[0].channel_id, channel1);
      });
    });

    describe("removeCommandChannelPermission", () => {
      it("should remove channel from command list", () => {
        const guildId = randomGuildId();
        const channelId = randomChannelId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.addCommandChannelPermission(
          guildId,
          "sketchbook",
          channelId,
        );
        const removed = commandPermissions.removeCommandChannelPermission(
          guildId,
          "sketchbook",
          channelId,
        );

        assert.equal(removed, true);

        const inList = commandPermissions.isChannelInCommandList(
          guildId,
          "sketchbook",
          channelId,
        );
        assert.equal(inList, false);
      });

      it("should return false for non-existent permission", () => {
        const guildId = randomGuildId();
        const channelId = randomChannelId();

        const removed = commandPermissions.removeCommandChannelPermission(
          guildId,
          "sketchbook",
          channelId,
        );
        assert.equal(removed, false);
      });
    });

    describe("clearCommandChannels", () => {
      it("should clear all channel permissions for command", () => {
        const guildId = randomGuildId();
        guildSettings.getOrCreateGuildSettings(guildId);
        commandPermissions.getOrCreateCommandPermission(guildId, "sketchbook");

        commandPermissions.addCommandChannelPermission(
          guildId,
          "sketchbook",
          randomChannelId(),
        );
        commandPermissions.addCommandChannelPermission(
          guildId,
          "sketchbook",
          randomChannelId(),
        );

        // Verify channels exist before clearing
        const beforePermissions =
          commandPermissions.getCommandChannelPermissions(
            guildId,
            "sketchbook",
          );
        assert.equal(beforePermissions.length, 2);

        // clearCommandChannels returns void
        commandPermissions.clearCommandChannels(guildId, "sketchbook");

        const permissions = commandPermissions.getCommandChannelPermissions(
          guildId,
          "sketchbook",
        );
        assert.equal(permissions.length, 0);
      });
    });

    describe("clearCommandChannelsAndMode", () => {
      it("should clear channels and reset mode to inherit", () => {
        const guildId = randomGuildId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.setCommandChannelMode(
          guildId,
          "sketchbook",
          "whitelist",
        );
        commandPermissions.addCommandChannelPermission(
          guildId,
          "sketchbook",
          randomChannelId(),
        );

        commandPermissions.clearCommandChannelsAndMode(guildId, "sketchbook");

        const mode = commandPermissions.getCommandChannelMode(
          guildId,
          "sketchbook",
        );
        assert.equal(mode, "inherit");

        const permissions = commandPermissions.getCommandChannelPermissions(
          guildId,
          "sketchbook",
        );
        assert.equal(permissions.length, 0);
      });
    });
  });

  describe("canCommandUseChannel", () => {
    it("should return null when no command-specific mode set (use default)", () => {
      const guildId = randomGuildId();
      const channelId = randomChannelId();
      guildSettings.getOrCreateGuildSettings(guildId);

      const result = commandPermissions.canCommandUseChannel(
        guildId,
        "sketchbook",
        channelId,
      );
      assert.equal(result, null);
    });

    describe("mode: whitelist", () => {
      it("should allow channel in whitelist", () => {
        const guildId = randomGuildId();
        const channelId = randomChannelId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.setCommandChannelMode(
          guildId,
          "sketchbook",
          "whitelist",
        );
        commandPermissions.addCommandChannelPermission(
          guildId,
          "sketchbook",
          channelId,
        );

        const result = commandPermissions.canCommandUseChannel(
          guildId,
          "sketchbook",
          channelId,
        );
        assert.equal(result, true);
      });

      it("should deny channel not in whitelist", () => {
        const guildId = randomGuildId();
        const allowedChannel = randomChannelId();
        const notAllowedChannel = randomChannelId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.setCommandChannelMode(
          guildId,
          "sketchbook",
          "whitelist",
        );
        commandPermissions.addCommandChannelPermission(
          guildId,
          "sketchbook",
          allowedChannel,
        );

        const result = commandPermissions.canCommandUseChannel(
          guildId,
          "sketchbook",
          notAllowedChannel,
        );
        assert.equal(result, false);
      });

      it("should allow thread if parent is whitelisted", () => {
        const guildId = randomGuildId();
        const parentChannelId = randomChannelId();
        const threadId = randomChannelId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.setCommandChannelMode(
          guildId,
          "sketchbook",
          "whitelist",
        );
        commandPermissions.addCommandChannelPermission(
          guildId,
          "sketchbook",
          parentChannelId,
        );

        const result = commandPermissions.canCommandUseChannel(
          guildId,
          "sketchbook",
          threadId,
          parentChannelId,
        );
        assert.equal(result, true);
      });
    });

    describe("mode: blacklist", () => {
      it("should deny channel in blacklist", () => {
        const guildId = randomGuildId();
        const channelId = randomChannelId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.setCommandChannelMode(
          guildId,
          "sketchbook",
          "blacklist",
        );
        commandPermissions.addCommandChannelPermission(
          guildId,
          "sketchbook",
          channelId,
        );

        const result = commandPermissions.canCommandUseChannel(
          guildId,
          "sketchbook",
          channelId,
        );
        assert.equal(result, false);
      });

      it("should allow channel not in blacklist", () => {
        const guildId = randomGuildId();
        const blockedChannel = randomChannelId();
        const allowedChannel = randomChannelId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.setCommandChannelMode(
          guildId,
          "sketchbook",
          "blacklist",
        );
        commandPermissions.addCommandChannelPermission(
          guildId,
          "sketchbook",
          blockedChannel,
        );

        const result = commandPermissions.canCommandUseChannel(
          guildId,
          "sketchbook",
          allowedChannel,
        );
        assert.equal(result, true);
      });

      it("should deny thread if parent is blacklisted", () => {
        const guildId = randomGuildId();
        const parentChannelId = randomChannelId();
        const threadId = randomChannelId();
        guildSettings.getOrCreateGuildSettings(guildId);

        commandPermissions.setCommandChannelMode(
          guildId,
          "sketchbook",
          "blacklist",
        );
        commandPermissions.addCommandChannelPermission(
          guildId,
          "sketchbook",
          parentChannelId,
        );

        const result = commandPermissions.canCommandUseChannel(
          guildId,
          "sketchbook",
          threadId,
          parentChannelId,
        );
        assert.equal(result, false);
      });
    });
  });

  describe("clearCommandPermissions", () => {
    it("should reset command to default state", () => {
      const guildId = randomGuildId();
      guildSettings.getOrCreateGuildSettings(guildId);

      commandPermissions.setCommandEnabled(guildId, "sketchbook", false);
      commandPermissions.addAllowedRole(guildId, "sketchbook", randomRoleId());
      commandPermissions.addDeniedRole(guildId, "sketchbook", randomRoleId());
      commandPermissions.setCommandChannelMode(
        guildId,
        "sketchbook",
        "whitelist",
      );
      commandPermissions.addCommandChannelPermission(
        guildId,
        "sketchbook",
        randomChannelId(),
      );

      commandPermissions.clearCommandPermissions(guildId, "sketchbook");

      const permission = commandPermissions.getCommandPermission(
        guildId,
        "sketchbook",
      );
      assert.equal(permission!.enabled, true);
      assert.deepEqual(permission!.allowed_roles, []);
      assert.deepEqual(permission!.denied_roles, []);
      assert.equal(permission!.channel_mode, "inherit");

      const channels = commandPermissions.getCommandChannelPermissions(
        guildId,
        "sketchbook",
      );
      assert.equal(channels.length, 0);
    });
  });

  describe("cleanupDeletedCommandChannels", () => {
    it("should remove channels not in existing set", () => {
      const guildId = randomGuildId();
      const existingChannel = randomChannelId();
      const deletedChannel = randomChannelId();
      guildSettings.getOrCreateGuildSettings(guildId);

      commandPermissions.addCommandChannelPermission(
        guildId,
        "sketchbook",
        existingChannel,
      );
      commandPermissions.addCommandChannelPermission(
        guildId,
        "sketchbook",
        deletedChannel,
      );

      const existingChannelIds = new Set([existingChannel]);
      const removedCount = commandPermissions.cleanupDeletedCommandChannels(
        guildId,
        "sketchbook",
        existingChannelIds,
      );

      assert.equal(removedCount, 1);

      const permissions = commandPermissions.getCommandChannelPermissions(
        guildId,
        "sketchbook",
      );
      assert.equal(permissions.length, 1);
      assert.equal(permissions[0].channel_id, existingChannel);
    });
  });

  describe("cleanupDeletedCommandRoles", () => {
    it("should remove roles not in existing set", () => {
      const guildId = randomGuildId();
      const existingAllowed = randomRoleId();
      const deletedAllowed = randomRoleId();
      const deletedDenied = randomRoleId();
      guildSettings.getOrCreateGuildSettings(guildId);

      commandPermissions.addAllowedRole(guildId, "sketchbook", existingAllowed);
      commandPermissions.addAllowedRole(guildId, "sketchbook", deletedAllowed);
      commandPermissions.addDeniedRole(guildId, "sketchbook", deletedDenied);

      const existingRoleIds = new Set([existingAllowed]);
      const removedCount = commandPermissions.cleanupDeletedCommandRoles(
        guildId,
        "sketchbook",
        existingRoleIds,
      );

      assert.equal(removedCount, 2);

      const permission = commandPermissions.getCommandPermission(
        guildId,
        "sketchbook",
      );
      assert.ok(permission!.allowed_roles.includes(existingAllowed));
      assert.ok(!permission!.allowed_roles.includes(deletedAllowed));
      assert.ok(!permission!.denied_roles.includes(deletedDenied));
    });
  });
});
