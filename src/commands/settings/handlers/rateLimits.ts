/**
 * Rate Limit Handlers - Rate limit setting and management actions
 *
 * Handlers for:
 * - Select rate limit target (default or per-command)
 * - Set rate limit via modal
 * - Remove rate limit
 * - Clear all rate limits
 */

import {
  ButtonInteraction,
  StringSelectMenuInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Locale,
} from "discord.js";
import {
  setRateLimit,
  removeRateLimit,
  clearAllRateLimits,
  getRateLimitSetting,
} from "../../../database/repositories/rateLimits.js";
import {
  getSettingsUILabel,
  getSettingsUIMessage,
} from "../../../locales/index.js";
import { buildRateLimitsPanel } from "../panels/ratelimits/settings.js";
import { createCustomId } from "../constants.js";

/**
 * Handle rate limit target selection (shows modal to set rate limit)
 */
export async function handleSelectRateLimitTarget(
  interaction: StringSelectMenuInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  const target = interaction.values[0];
  const commandName = target === "__default__" ? null : target;

  await showRateLimitModal(interaction, guildId, userId, locale, commandName);
}

/**
 * Show rate limit modal for setting uses and window
 */
export async function showRateLimitModal(
  interaction: ButtonInteraction | StringSelectMenuInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
  commandName: string | null,
): Promise<void> {
  const existing = getRateLimitSetting(guildId, commandName);

  const modal = new ModalBuilder()
    .setCustomId(
      createCustomId("modal_ratelimit", userId, commandName ?? "__default__"),
    )
    .setTitle(getSettingsUILabel("rateLimitModalTitle", locale));

  const usesInput = new TextInputBuilder()
    .setCustomId("uses")
    .setLabel(getSettingsUILabel("usesLabel", locale))
    .setPlaceholder(getSettingsUILabel("usesPlaceholder", locale))
    .setStyle(TextInputStyle.Short)
    .setValue(existing ? String(existing.max_uses) : "5")
    .setRequired(true)
    .setMinLength(1)
    .setMaxLength(3);

  const secondsInput = new TextInputBuilder()
    .setCustomId("seconds")
    .setLabel(getSettingsUILabel("secondsLabel", locale))
    .setPlaceholder(getSettingsUILabel("secondsPlaceholder", locale))
    .setStyle(TextInputStyle.Short)
    .setValue(existing ? String(existing.window_seconds) : "60")
    .setRequired(true)
    .setMinLength(1)
    .setMaxLength(5);

  const usesRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
    usesInput,
  );
  const secondsRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
    secondsInput,
  );

  modal.addComponents(usesRow, secondsRow);

  await interaction.showModal(modal);
}

/**
 * Handle removing a rate limit
 */
export async function handleRemoveRateLimit(
  interaction: StringSelectMenuInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  const target = interaction.values[0];
  const commandName = target === "__default__" ? null : target;

  removeRateLimit(guildId, commandName);

  await interaction.update(buildRateLimitsPanel(guildId, userId, locale));
}

/**
 * Handle showing clear rate limits confirmation
 */
export async function handleClearRateLimits(
  interaction: ButtonInteraction,
  _guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  const embed = new EmbedBuilder()
    .setTitle(getSettingsUIMessage("confirmClearRateLimits", locale))
    .setColor(0xed4245);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(createCustomId("confirm_clear_ratelimits", userId))
      .setEmoji("🗑️")
      .setLabel(getSettingsUILabel("confirmClear", locale))
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(createCustomId("ratelimits", userId))
      .setEmoji("❌")
      .setLabel(getSettingsUILabel("cancel", locale))
      .setStyle(ButtonStyle.Secondary),
  );

  await interaction.update({
    embeds: [embed],
    components: [row],
  });
}

/**
 * Handle confirming clear all rate limits
 */
export async function handleConfirmClearRateLimits(
  interaction: ButtonInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  clearAllRateLimits(guildId);

  await interaction.update(buildRateLimitsPanel(guildId, userId, locale));
}

/**
 * Handle rate limit modal submission
 * This is called from the main modal submit handler
 */
export function handleRateLimitModalSubmit(
  guildId: string,
  target: string,
  usesStr: string,
  secondsStr: string,
): { success: boolean; error?: string } {
  const uses = parseInt(usesStr, 10);
  const seconds = parseInt(secondsStr, 10);

  if (isNaN(uses) || isNaN(seconds) || uses <= 0 || seconds <= 0) {
    return { success: false, error: "Invalid values" };
  }

  const commandName = target === "__default__" ? null : target;
  setRateLimit(guildId, commandName, uses, seconds);

  return { success: true };
}
