/**
 * Settings Dashboard Panel - Main settings overview
 *
 * Entry point for all server settings with three main categories:
 * - General Bot Settings
 * - Command Permissions
 * - Rate Limits
 */

import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Locale,
} from "discord.js";
import { getOrCreateGuildSettings } from "../../../database/repositories/guildSettings.js";
import { getChannelPermissions } from "../../../database/repositories/channelPermissions.js";
import {
  getGuildCommandPermissions,
  getAllCommandChannelPermissions,
} from "../../../database/repositories/commandPermissions.js";
import { getGuildRateLimitSettings } from "../../../database/repositories/rateLimits.js";
import {
  getSettingsMessage,
  getChannelModeDisplay,
  getLanguageDisplay,
  getSettingsUILabel,
  getSettingsUIMessage,
} from "../../../locales/index.js";
import { createCustomId, BOT_COMMANDS } from "../constants.js";

/**
 * Build the main dashboard
 */
export function buildDashboard(
  guildId: string,
  userId: string,
  locale: Locale | string,
): { embeds: EmbedBuilder[]; components: ActionRowBuilder<ButtonBuilder>[] } {
  const settings = getOrCreateGuildSettings(guildId);
  const globalChannels = getChannelPermissions(guildId);
  const commands = getGuildCommandPermissions(guildId);
  const commandChannels = getAllCommandChannelPermissions(guildId);
  const rateLimits = getGuildRateLimitSettings(guildId);

  // Count channels per command
  const channelCountByCommand = new Map<string, number>();
  for (const ch of commandChannels) {
    channelCountByCommand.set(
      ch.command_name,
      (channelCountByCommand.get(ch.command_name) ?? 0) + 1,
    );
  }

  const embed = new EmbedBuilder()
    .setTitle(getSettingsUIMessage("dashboardTitle", locale))
    .setDescription(getSettingsUIMessage("dashboardDescription", locale))
    .setColor(settings.enabled ? 0x57f287 : 0xed4245)
    .addFields(
      {
        name: getSettingsMessage("embedBotStatus", locale),
        value: settings.enabled
          ? `✅ ${getSettingsMessage("enabled", locale)}`
          : `❌ ${getSettingsMessage("disabled", locale)}`,
        inline: true,
      },
      {
        name: getSettingsMessage("embedBotLanguage", locale),
        value: settings.default_language
          ? getLanguageDisplay(settings.default_language, locale)
          : getSettingsMessage("auto", locale),
        inline: true,
      },
      {
        name: `🌸 ${getSettingsUILabel("defaultPermissions", locale)}`,
        value: `📢 ${getChannelModeDisplay(settings.channel_mode, locale)} (${globalChannels.length} ${getSettingsUILabel("channelsConfigured", locale)})\n👥 ${settings.allowed_roles.length + settings.denied_roles.length} ${getSettingsMessage("rolesConfigured", locale)}`,
        inline: false,
      },
      {
        name: getSettingsMessage("embedCommandPermissions", locale),
        value: BOT_COMMANDS.map((cmd) => {
          const perm = commands.find((c) => c.command_name === cmd);
          const isEnabled = perm?.enabled !== false;
          const channelCount = channelCountByCommand.get(cmd) ?? 0;
          const roleCount =
            (perm?.allowed_roles.length ?? 0) +
            (perm?.denied_roles.length ?? 0);
          const status = isEnabled
            ? `✅ ${getSettingsMessage("enabled", locale)}`
            : `❌ ${getSettingsMessage("disabled", locale)}`;
          return `\`/${cmd}\`: ${status} (📢 ${channelCount}, 👥 ${roleCount})`;
        }).join("\n"),
        inline: false,
      },
      {
        name: getSettingsMessage("embedRateLimits", locale),
        value:
          rateLimits.length > 0
            ? rateLimits
                .map(
                  (r) =>
                    `${r.command_name ? `\`/${r.command_name}\`` : getSettingsMessage("global", locale)}: ${getSettingsUIMessage("rateLimitFormat", locale, { uses: String(r.max_uses), seconds: String(r.window_seconds) })}`,
                )
                .join("\n")
            : getSettingsMessage("defaultRateLimit", locale, {
                uses: "5",
                seconds: "60",
              }),
        inline: false,
      },
    )
    .setTimestamp()
    .setFooter({ text: getSettingsMessage("embedFooter", locale) });

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(createCustomId("general", userId))
      .setEmoji("🤖")
      .setLabel(getSettingsUILabel("generalSettings", locale))
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(createCustomId("commands", userId))
      .setEmoji("🔐")
      .setLabel(getSettingsUILabel("commandPermissions", locale))
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(createCustomId("ratelimits", userId))
      .setEmoji("⏱️")
      .setLabel(getSettingsUILabel("rateLimits", locale))
      .setStyle(ButtonStyle.Primary),
  );

  const dangerRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(createCustomId("factory_reset", userId))
      .setEmoji("⚠️")
      .setLabel(getSettingsUILabel("factoryReset", locale))
      .setStyle(ButtonStyle.Danger),
  );

  return { embeds: [embed], components: [row, dangerRow] };
}
