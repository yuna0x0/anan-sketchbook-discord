/**
 * Rate Limits Panel - Usage rate limiting settings
 *
 * Part of the main settings dashboard.
 * Configures rate limits to prevent command spam.
 * Rate limits can be set as default (for all commands) or per-command.
 *
 * Rate Limit Resolution:
 * 1. Check per-command rate limit first
 * 2. If no per-command limit, use default rate limit
 * 3. If no default limit, commands are unlimited
 *
 * Features:
 * - Default rate limit: Applies to all commands
 * - Per-command rate limit: Overrides default for specific commands
 *
 * Rate limits are tracked per-user and reset after the time window.
 */

import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  Locale,
} from "discord.js";
import { getGuildRateLimitSettings } from "../../../../database/repositories/rateLimits.js";
import {
  getSettingsMessage,
  getSettingsUILabel,
  getSettingsUIMessage,
} from "../../../../locales/index.js";
import { createCustomId, BOT_COMMANDS } from "../../constants.js";

/**
 * Build the rate limits panel
 */
export function buildRateLimitsPanel(
  guildId: string,
  userId: string,
  locale: Locale | string,
): {
  embeds: EmbedBuilder[];
  components: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[];
} {
  const rateLimits = getGuildRateLimitSettings(guildId);

  // Separate default and per-command rate limits
  const defaultLimit = rateLimits.find((r) => r.command_name === null);
  const commandLimits = rateLimits.filter((r) => r.command_name !== null);

  // Build rate limit display
  let rateLimitDisplay: string;
  if (rateLimits.length === 0) {
    rateLimitDisplay = getSettingsMessage("noRateLimitsConfigured", locale);
  } else {
    const parts: string[] = [];
    if (defaultLimit) {
      parts.push(
        `🌸 **${getSettingsUILabel("defaultRateLimit", locale)}**: ${getSettingsUIMessage("rateLimitFormat", locale, { uses: String(defaultLimit.max_uses), seconds: String(defaultLimit.window_seconds) })}`,
      );
    }
    for (const limit of commandLimits) {
      parts.push(
        `\`/${limit.command_name}\`: ${getSettingsUIMessage("rateLimitFormat", locale, { uses: String(limit.max_uses), seconds: String(limit.window_seconds) })}`,
      );
    }
    rateLimitDisplay = parts.join("\n");
  }

  const embed = new EmbedBuilder()
    .setTitle(getSettingsUIMessage("rateLimitsTitle", locale))
    .setDescription(getSettingsUIMessage("rateLimitsDescription", locale))
    .setColor(0x5865f2)
    .addFields({
      name: getSettingsUIMessage("currentRateLimits", locale),
      value: rateLimitDisplay,
      inline: false,
    });

  // Add explanation of rate limit resolution
  embed.addFields({
    name: `💡 ${getSettingsUILabel("rateLimitLogicTitle", locale)}`,
    value: getSettingsUILabel("rateLimitLogicDesc", locale),
    inline: false,
  });

  // Target selection for setting rate limit
  const targetOptions = [
    {
      label: getSettingsUILabel("defaultRateLimit", locale),
      description: getSettingsUILabel("applyToAllCommands", locale),
      value: "__default__",
      emoji: "🌸",
    },
    ...BOT_COMMANDS.map((cmd) => ({
      label: `/${cmd}`,
      value: cmd,
    })),
  ];

  const targetRow =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(createCustomId("select_ratelimit_target", userId))
        .setPlaceholder(getSettingsUILabel("selectRateLimitTarget", locale))
        .addOptions(targetOptions),
    );

  const components: ActionRowBuilder<
    ButtonBuilder | StringSelectMenuBuilder
  >[] = [targetRow];

  // Add remove rate limit select if there are rate limits configured
  if (rateLimits.length > 0) {
    const removeRow =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(createCustomId("remove_ratelimit", userId))
          .setPlaceholder(getSettingsUILabel("removeRateLimit", locale))
          .addOptions(
            rateLimits.map((r) => ({
              label: r.command_name
                ? `/${r.command_name}`
                : getSettingsUILabel("defaultRateLimit", locale),
              description: getSettingsUIMessage("rateLimitFormat", locale, {
                uses: String(r.max_uses),
                seconds: String(r.window_seconds),
              }),
              value: r.command_name || "__default__",
              emoji: r.command_name ? undefined : "🌸",
            })),
          ),
      );
    components.push(removeRow);
  }

  const hasRateLimits = rateLimits.length > 0;

  const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(createCustomId("clear_ratelimits", userId))
      .setEmoji("🗑️")
      .setLabel(getSettingsUILabel("clearAllRateLimits", locale))
      .setStyle(ButtonStyle.Danger)
      .setDisabled(!hasRateLimits),
    new ButtonBuilder()
      .setCustomId(createCustomId("dashboard", userId))
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
