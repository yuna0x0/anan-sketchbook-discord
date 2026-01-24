/**
 * Per-command Permissions Panel - Individual command permission settings
 *
 * Shows all permissions for a specific command:
 * - Enable/disable toggle
 * - Channel settings (inherit/all/whitelist/blacklist)
 * - Role permissions (allowed/denied)
 *
 * Permission Resolution Logic:
 * 1. If user has any denied role → DENY
 * 2. If allowed roles exist and user has one → ALLOW
 * 3. If allowed roles exist but user has none → DENY
 * 4. Otherwise → ALLOW (default)
 */

import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Locale,
  roleMention,
  channelMention,
} from "discord.js";
import {
  getCommandPermission,
  getCommandChannelPermissions,
} from "../../../../database/repositories/commandPermissions.js";
import {
  getSettingsMessage,
  getSettingsUILabel,
  getSettingsUIMessage,
} from "../../../../locales/index.js";
import { createCustomId } from "../../constants.js";
import { getCommandChannelModeDisplay } from "../../utils.js";

/**
 * Build the command detail panel
 */
export function buildCommandDetailPanel(
  guildId: string,
  userId: string,
  locale: Locale | string,
  commandName: string,
): {
  embeds: EmbedBuilder[];
  components: ActionRowBuilder<ButtonBuilder>[];
} {
  const permission = getCommandPermission(guildId, commandName);
  const isEnabled = permission?.enabled !== false;
  const channelMode = permission?.channel_mode ?? "inherit";

  // Get channels from separate table
  const channelPermissions = getCommandChannelPermissions(guildId, commandName);
  const channels = channelPermissions.map((cp) => cp.channel_id);

  // Build channel settings display
  const channelModeDisplay = getCommandChannelModeDisplay(channelMode, locale);
  let channelSettingsValue = channelModeDisplay;
  if (
    (channelMode === "whitelist" || channelMode === "blacklist") &&
    channels.length > 0
  ) {
    const labelKey =
      channelMode === "whitelist"
        ? "allowedChannelsLabel"
        : "deniedChannelsLabel";
    channelSettingsValue += `\n${getSettingsUILabel(labelKey, locale)}: ${channels
      .slice(0, 5)
      .map((c: string) => channelMention(c))
      .join(", ")}`;
    if (channels.length > 5) {
      channelSettingsValue += ` (+${channels.length - 5})`;
    }
  }

  // Build role settings display
  const allowedRoles = permission?.allowed_roles ?? [];
  const deniedRoles = permission?.denied_roles ?? [];
  let roleSettingsValue = "";
  if (allowedRoles.length > 0) {
    roleSettingsValue += `✅ ${getSettingsMessage("allowedRoles", locale)}: ${allowedRoles
      .slice(0, 3)
      .map((r) => roleMention(r))
      .join(", ")}`;
    if (allowedRoles.length > 3) {
      roleSettingsValue += ` (+${allowedRoles.length - 3})`;
    }
  }
  if (deniedRoles.length > 0) {
    if (roleSettingsValue) roleSettingsValue += "\n";
    roleSettingsValue += `🚫 ${getSettingsMessage("deniedRoles", locale)}: ${deniedRoles
      .slice(0, 3)
      .map((r) => roleMention(r))
      .join(", ")}`;
    if (deniedRoles.length > 3) {
      roleSettingsValue += ` (+${deniedRoles.length - 3})`;
    }
  }
  if (!roleSettingsValue) {
    roleSettingsValue = getSettingsMessage("noneEveryoneAllowed", locale);
  }

  const embed = new EmbedBuilder()
    .setTitle(
      getSettingsUIMessage("commandPermissionTitle", locale, {
        command: commandName,
      }),
    )
    .setDescription(getSettingsUIMessage("commandDetailDescription", locale))
    .setColor(isEnabled ? 0x57f287 : 0xed4245)
    .addFields(
      {
        name: getSettingsMessage("status", locale),
        value: isEnabled
          ? `✅ ${getSettingsMessage("enabled", locale)}`
          : `❌ ${getSettingsMessage("disabled", locale)}`,
        inline: true,
      },
      {
        name: `📢 ${getSettingsUILabel("channelSettingsLabel", locale)}`,
        value: channelSettingsValue,
        inline: false,
      },
      {
        name: `👥 ${getSettingsUILabel("roleSettingsLabel", locale)}`,
        value: roleSettingsValue,
        inline: false,
      },
    );

  // Add permission logic explanation
  embed.addFields({
    name: `💡 ${getSettingsUILabel("permissionLogicTitle", locale)}`,
    value: getSettingsUILabel("permissionLogicDesc", locale),
    inline: false,
  });

  const toggleCommandButton = new ButtonBuilder()
    .setCustomId(createCustomId("toggle_command", userId, commandName))
    .setLabel(
      isEnabled
        ? getSettingsUILabel("disableCommand", locale)
        : getSettingsUILabel("enableCommand", locale),
    )
    .setStyle(isEnabled ? ButtonStyle.Danger : ButtonStyle.Success);

  // Only add emoji for enable button (green)
  if (!isEnabled) {
    toggleCommandButton.setEmoji("✅");
  }

  const toggleRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    toggleCommandButton,
    new ButtonBuilder()
      .setCustomId(createCustomId("command_channels", userId, commandName))
      .setEmoji("📢")
      .setLabel(getSettingsUILabel("manageChannels", locale))
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(createCustomId("command_roles", userId, commandName))
      .setEmoji("👥")
      .setLabel(getSettingsUILabel("manageRoles", locale))
      .setStyle(ButtonStyle.Primary),
  );

  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(createCustomId("reset_command", userId, commandName))
      .setEmoji("🔄")
      .setLabel(getSettingsUILabel("resetPermissions", locale))
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(createCustomId("commands", userId))
      .setEmoji("◀️")
      .setLabel(getSettingsUILabel("backButton", locale))
      .setStyle(ButtonStyle.Secondary),
  );

  return {
    embeds: [embed],
    components: [toggleRow, actionRow],
  };
}
