/**
 * General Settings Handlers
 *
 * Handlers for:
 * - Bot enable/disable toggle
 * - Language selection
 * - Reset general settings
 * - Factory reset (delete all guild data)
 */

import {
  ButtonInteraction,
  StringSelectMenuInteraction,
  Locale,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import {
  setGuildEnabled,
  getOrCreateGuildSettings,
  setDefaultLanguage,
  resetGeneralSettings,
  deleteGuildData,
} from "../../../database/repositories/guildSettings.js";
import {
  getSettingsUILabel,
  getSettingsUIMessage,
} from "../../../locales/index.js";
import { buildGeneralPanel } from "../panels/general/settings.js";
import { createCustomId } from "../constants.js";

/**
 * Handle bot enable/disable toggle
 */
export async function handleToggleBot(
  interaction: ButtonInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  const settings = getOrCreateGuildSettings(guildId);
  const newState = !settings.enabled;
  setGuildEnabled(guildId, newState);

  await interaction.update(buildGeneralPanel(guildId, userId, locale));
}

/**
 * Handle language selection
 */
export async function handleSetLanguage(
  interaction: StringSelectMenuInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  const value = interaction.values[0];
  const language = value === "auto" ? null : value;

  setDefaultLanguage(guildId, language);

  await interaction.update(buildGeneralPanel(guildId, userId, locale));
}

/**
 * Handle showing reset general settings confirmation
 */
export async function handleResetGeneralSettings(
  interaction: ButtonInteraction,
  _guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  const embed = new EmbedBuilder()
    .setTitle(getSettingsUIMessage("confirmResetGeneralSettings", locale))
    .setColor(0xed4245);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(createCustomId("confirm_reset_general", userId))
      .setEmoji("🔄")
      .setLabel(getSettingsUILabel("confirmReset", locale))
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(createCustomId("general", userId))
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
 * Handle confirming reset general settings
 */
export async function handleConfirmResetGeneralSettings(
  interaction: ButtonInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  resetGeneralSettings(guildId);

  await interaction.update(buildGeneralPanel(guildId, userId, locale));
}

// ============================================================================
// Factory Reset Handlers
// ============================================================================

/**
 * Handle showing factory reset confirmation
 */
export async function handleFactoryReset(
  interaction: ButtonInteraction,
  _guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  const embed = new EmbedBuilder()
    .setTitle(getSettingsUIMessage("confirmFactoryReset", locale))
    .setColor(0xff0000);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(createCustomId("confirm_factory_reset", userId))
      .setEmoji("⚠️")
      .setLabel(getSettingsUILabel("confirmDelete", locale))
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(createCustomId("dashboard", userId))
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
 * Handle confirming factory reset (delete all guild data)
 */
export async function handleConfirmFactoryReset(
  interaction: ButtonInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  deleteGuildData(guildId);

  // After factory reset, show a fresh dashboard (will create new default settings)
  const { buildDashboard } = await import("../panels/dashboard.js");
  await interaction.update(buildDashboard(guildId, userId, locale));
}
