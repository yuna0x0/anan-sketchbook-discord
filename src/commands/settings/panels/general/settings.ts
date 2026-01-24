/**
 * General Bot Settings Panel - Bot enable/disable and language selection
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
  getSettingsMessage,
  getLanguageDisplay,
  getSettingsUILabel,
  getSettingsUIMessage,
} from "../../../../locales/index.js";
import { createCustomId } from "../../constants.js";

/**
 * Build the general settings panel
 */
export function buildGeneralPanel(
  guildId: string,
  userId: string,
  locale: Locale | string,
): {
  embeds: EmbedBuilder[];
  components: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[];
} {
  const settings = getOrCreateGuildSettings(guildId);

  const embed = new EmbedBuilder()
    .setTitle(getSettingsUIMessage("generalTitle", locale))
    .setDescription(getSettingsUIMessage("generalDescription", locale))
    .setColor(settings.enabled ? 0x57f287 : 0xed4245)
    .addFields(
      {
        name: getSettingsUIMessage("currentStatus", locale),
        value: settings.enabled
          ? `✅ ${getSettingsMessage("enabled", locale)}`
          : `❌ ${getSettingsMessage("disabled", locale)}`,
        inline: true,
      },
      {
        name: getSettingsUIMessage("currentLanguage", locale),
        value: settings.default_language
          ? getLanguageDisplay(settings.default_language, locale)
          : getSettingsMessage("auto", locale),
        inline: true,
      },
    );

  const toggleBotButton = new ButtonBuilder()
    .setCustomId(createCustomId("toggle_bot", userId))
    .setLabel(
      settings.enabled
        ? getSettingsUILabel("disableBot", locale)
        : getSettingsUILabel("enableBot", locale),
    )
    .setStyle(settings.enabled ? ButtonStyle.Danger : ButtonStyle.Success);

  // Only add emoji for enable button (green)
  if (!settings.enabled) {
    toggleBotButton.setEmoji("✅");
  }

  const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    toggleBotButton,
    new ButtonBuilder()
      .setCustomId(createCustomId("reset_general", userId))
      .setEmoji("🔄")
      .setLabel(getSettingsUILabel("resetGeneralSettings", locale))
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(createCustomId("dashboard", userId))
      .setEmoji("◀️")
      .setLabel(getSettingsUILabel("backButton", locale))
      .setStyle(ButtonStyle.Secondary),
  );

  const languageRow =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(createCustomId("set_language", userId))
        .setPlaceholder(getSettingsUILabel("selectLanguage", locale))
        .addOptions([
          {
            label: getSettingsUILabel("languageAutoLabel", locale),
            description: getSettingsUILabel("languageAutoDescription", locale),
            value: "auto",
            default: !settings.default_language,
          },
          {
            label: getLanguageDisplay(Locale.EnglishUS, locale),
            value: Locale.EnglishUS,
            default: settings.default_language === Locale.EnglishUS,
          },
          {
            label: getLanguageDisplay(Locale.ChineseTW, locale),
            value: Locale.ChineseTW,
            default: settings.default_language === Locale.ChineseTW,
          },
          {
            label: getLanguageDisplay(Locale.ChineseCN, locale),
            value: Locale.ChineseCN,
            default: settings.default_language === Locale.ChineseCN,
          },
          {
            label: getLanguageDisplay(Locale.Japanese, locale),
            value: Locale.Japanese,
            default: settings.default_language === Locale.Japanese,
          },
        ]),
    );

  return {
    embeds: [embed],
    components: [languageRow, buttonRow],
  };
}
