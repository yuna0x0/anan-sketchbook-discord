/**
 * Per-command Permissions - Role Panel
 *
 * Part of "Command Permissions > Per-command" settings.
 * Configures role-specific permissions for a single command.
 * Roles can be allowed or denied access to the command.
 *
 * Permission Resolution Logic (in order):
 * 1. User has any denied role → DENY
 * 2. If allowed roles exist:
 *    - User has an allowed role → ALLOW
 *    - User has no allowed role → DENY
 * 3. No role restrictions → ALLOW (default)
 *
 * Key behaviors:
 * - Denied roles take priority over allowed roles
 * - If any allowed roles are set, users without those roles are denied
 *
 * Example scenarios:
 * - Allow @Moderator, deny @Muted: Moderators can use unless they also have @Muted
 * - Only allow @VIP: Only users with @VIP role can use the command
 * - Deny @Banned: Everyone except users with @Banned can use
 */

import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  RoleSelectMenuBuilder,
  Locale,
  roleMention,
} from "discord.js";
import type { Guild } from "discord.js";
import {
  getCommandPermission,
  cleanupDeletedCommandRoles,
} from "../../../../database/repositories/commandPermissions.js";
import {
  getSettingsMessage,
  getSettingsUILabel,
  getSettingsUIMessage,
} from "../../../../locales/index.js";
import { createCustomId } from "../../constants.js";

/**
 * Build the command roles panel
 */
export function buildCommandRolesPanel(
  guildId: string,
  userId: string,
  locale: Locale | string,
  commandName: string,
  guild?: Guild | null,
): {
  embeds: EmbedBuilder[];
  components: ActionRowBuilder<
    ButtonBuilder | StringSelectMenuBuilder | RoleSelectMenuBuilder
  >[];
} {
  // Cleanup deleted roles when viewing the panel
  if (guild) {
    const existingRoleIds = new Set(guild.roles.cache.keys());
    cleanupDeletedCommandRoles(guildId, commandName, existingRoleIds);
  }

  const permission = getCommandPermission(guildId, commandName);
  const allowedRoles = permission?.allowed_roles ?? [];
  const deniedRoles = permission?.denied_roles ?? [];

  // Build behavior description based on current settings
  let behaviorDescription: string;
  if (allowedRoles.length === 0 && deniedRoles.length === 0) {
    behaviorDescription = getSettingsUILabel("roleNoneDesc", locale);
  } else if (allowedRoles.length > 0 && deniedRoles.length === 0) {
    behaviorDescription = getSettingsUILabel("roleAllowOnlyDesc", locale);
  } else if (allowedRoles.length === 0 && deniedRoles.length > 0) {
    behaviorDescription = getSettingsUILabel("roleDenyOnlyDesc", locale);
  } else {
    behaviorDescription = getSettingsUILabel("roleMixedDesc", locale);
  }

  const embed = new EmbedBuilder()
    .setTitle(
      getSettingsUIMessage("rolePermissionsTitle", locale, {
        command: commandName,
      }),
    )
    .setDescription(getSettingsUIMessage("commandRolesDescription", locale))
    .setColor(0x5865f2)
    .addFields(
      {
        name: `✅ ${getSettingsMessage("allowedRoles", locale)}`,
        value:
          allowedRoles.length > 0
            ? allowedRoles.map((r) => roleMention(r)).join(", ")
            : getSettingsMessage("noneEveryoneAllowed", locale),
        inline: false,
      },
      {
        name: `🚫 ${getSettingsMessage("deniedRoles", locale)}`,
        value:
          deniedRoles.length > 0
            ? deniedRoles.map((r) => roleMention(r)).join(", ")
            : getSettingsMessage("none", locale),
        inline: false,
      },
      {
        name: `📋 ${getSettingsUILabel("currentBehavior", locale)}`,
        value: behaviorDescription,
        inline: false,
      },
    );

  // Add permission logic explanation
  embed.addFields({
    name: `💡 ${getSettingsUILabel("roleLogicTitle", locale)}`,
    value: getSettingsUILabel("roleLogicDesc", locale),
    inline: false,
  });

  // Role selectors
  const allowRoleRow =
    new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
      new RoleSelectMenuBuilder()
        .setCustomId(createCustomId("allow_role", userId, commandName))
        .setPlaceholder(getSettingsUILabel("selectRoleToAllow", locale)),
    );

  const denyRoleRow =
    new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
      new RoleSelectMenuBuilder()
        .setCustomId(createCustomId("deny_role", userId, commandName))
        .setPlaceholder(getSettingsUILabel("selectRoleToDeny", locale)),
    );

  const components: ActionRowBuilder<
    ButtonBuilder | StringSelectMenuBuilder | RoleSelectMenuBuilder
  >[] = [allowRoleRow, denyRoleRow];

  // Add remove role select if there are roles configured
  const allRoles = [...new Set([...allowedRoles, ...deniedRoles])];
  if (allRoles.length > 0) {
    const removeRoleRow =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(createCustomId("remove_role", userId, commandName))
          .setPlaceholder(getSettingsUILabel("selectRoleToRemove", locale))
          .addOptions(
            allRoles.slice(0, 25).map((roleId) => {
              const role = guild?.roles.cache.get(roleId);
              const isAllowed = allowedRoles.includes(roleId);
              const isDenied = deniedRoles.includes(roleId);
              let description: string;
              if (isAllowed && isDenied) {
                description = `${getSettingsUILabel("allowedLabel", locale)} & ${getSettingsUILabel("deniedLabel", locale)}`;
              } else if (isAllowed) {
                description = getSettingsUILabel("allowedLabel", locale);
              } else {
                description = getSettingsUILabel("deniedLabel", locale);
              }
              return {
                label: role ? `@${role.name}` : `@${roleId}`,
                description,
                value: roleId,
                emoji: isAllowed ? "✅" : "🚫",
              };
            }),
          ),
      );
    components.push(removeRoleRow);
  }

  const hasRoles = allRoles.length > 0;

  const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(createCustomId("clear_command_roles", userId, commandName))
      .setEmoji("🗑️")
      .setLabel(getSettingsUILabel("clearAllRoles", locale))
      .setStyle(ButtonStyle.Danger)
      .setDisabled(!hasRoles),
    new ButtonBuilder()
      .setCustomId(createCustomId("back_to_command", userId, commandName))
      .setEmoji("◀️")
      .setLabel(getSettingsUILabel("backButton", locale))
      .setStyle(ButtonStyle.Secondary),
  );
  components.push(buttonRow);

  return {
    embeds: [embed],
    components,
  };
}
