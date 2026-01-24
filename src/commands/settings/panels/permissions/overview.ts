/**
 * Command Permissions Panel - Command selection and overview
 *
 * Provides:
 * - Default permissions entry point (channels, roles)
 * - Per-command permissions navigation
 * - Overview of all command statuses
 */

import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  Locale,
} from "discord.js";
import { getOrCreateGuildSettings } from "../../../../database/repositories/guildSettings.js";
import {
  getChannelPermissions,
  cleanupDeletedChannels,
} from "../../../../database/repositories/channelPermissions.js";
import {
  getGuildCommandPermissions,
  getAllCommandChannelPermissions,
} from "../../../../database/repositories/commandPermissions.js";
import {
  getSettingsMessage,
  getChannelModeDisplay,
  getSettingsUILabel,
  getSettingsUIMessage,
} from "../../../../locales/index.js";
import { createCustomId, BOT_COMMANDS } from "../../constants.js";

/**
 * Build the command permissions panel
 */
export function buildCommandsPanel(
  guildId: string,
  userId: string,
  locale: Locale | string,
  existingChannelIds?: Set<string>,
): {
  embeds: EmbedBuilder[];
  components: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[];
} {
  const settings = getOrCreateGuildSettings(guildId);
  const globalChannels = getChannelPermissions(guildId);
  const commands = getGuildCommandPermissions(guildId);
  const commandChannels = getAllCommandChannelPermissions(guildId);

  // Count channels per command
  const channelCountByCommand = new Map<string, number>();
  for (const ch of commandChannels) {
    channelCountByCommand.set(
      ch.command_name,
      (channelCountByCommand.get(ch.command_name) ?? 0) + 1,
    );
  }

  // Clean up deleted channels if we have the existing channel IDs
  if (existingChannelIds) {
    cleanupDeletedChannels(guildId, existingChannelIds);
  }

  const embed = new EmbedBuilder()
    .setTitle(getSettingsUIMessage("commandPermissionsTitle", locale))
    .setDescription(
      getSettingsUIMessage("commandPermissionsDescription", locale),
    )
    .setColor(0x5865f2)
    .addFields(
      {
        name: `🌸 ${getSettingsUILabel("defaultPermissions", locale)}`,
        value: `📢 ${getChannelModeDisplay(settings.channel_mode, locale)} (${globalChannels.length} ${getSettingsUILabel("channelsConfigured", locale)})\n👥 ${settings.allowed_roles.length + settings.denied_roles.length} ${getSettingsMessage("rolesConfigured", locale)}`,
        inline: false,
      },
      {
        name: getSettingsUIMessage("commandSelectPrompt", locale),
        value: BOT_COMMANDS.map((cmd) => {
          const perm = commands.find((c) => c.command_name === cmd);
          const channelCount = channelCountByCommand.get(cmd) ?? 0;
          const roleCount =
            (perm?.allowed_roles.length ?? 0) +
            (perm?.denied_roles.length ?? 0);
          const status =
            perm?.enabled === false
              ? `❌ ${getSettingsMessage("disabled", locale)}`
              : `✅ ${getSettingsMessage("enabled", locale)}`;
          return `\`/${cmd}\`: ${status} (📢 ${channelCount}, 👥 ${roleCount})`;
        }).join("\n"),
        inline: false,
      },
    );

  const selectRow =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(createCustomId("select_command", userId))
        .setPlaceholder(getSettingsUILabel("selectCommand", locale))
        .addOptions([
          {
            label: getSettingsUILabel("defaultPermissions", locale),
            description: getSettingsUILabel("defaultPermissionsDesc", locale),
            value: "__default__",
            emoji: "🌸",
          },
          ...BOT_COMMANDS.map((cmd) => ({
            label: `/${cmd}`,
            description: getSettingsUILabel("perCommandSettingsDesc", locale),
            value: cmd,
          })),
        ]),
    );

  const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(createCustomId("reset_all_commands", userId))
      .setEmoji("🔄")
      .setLabel(getSettingsUILabel("resetAllCommandPermissions", locale))
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(createCustomId("dashboard", userId))
      .setEmoji("◀️")
      .setLabel(getSettingsUILabel("backButton", locale))
      .setStyle(ButtonStyle.Secondary),
  );

  return {
    embeds: [embed],
    components: [selectRow, buttonRow],
  };
}
