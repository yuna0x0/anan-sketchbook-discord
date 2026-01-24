/**
 * Settings Display Localizations
 * Contains channel mode and language display names with helper functions
 */

import { Locale } from "discord.js";

/**
 * Channel mode display names
 */
export const CHANNEL_MODE_DISPLAY = {
  all: {
    [Locale.EnglishUS]: "All Channels",
    [Locale.EnglishGB]: "All Channels",
    [Locale.ChineseTW]: "所有頻道",
    [Locale.ChineseCN]: "所有频道",
    [Locale.Japanese]: "すべてのチャンネル",
  },
  whitelist: {
    [Locale.EnglishUS]: "Whitelist Only",
    [Locale.EnglishGB]: "Whitelist Only",
    [Locale.ChineseTW]: "僅白名單",
    [Locale.ChineseCN]: "仅白名单",
    [Locale.Japanese]: "ホワイトリストのみ",
  },
  blacklist: {
    [Locale.EnglishUS]: "Blacklist",
    [Locale.EnglishGB]: "Blacklist",
    [Locale.ChineseTW]: "黑名單",
    [Locale.ChineseCN]: "黑名单",
    [Locale.Japanese]: "ブラックリスト",
  },
} as const;

/**
 * Language display names
 */
export const LANGUAGE_DISPLAY = {
  [Locale.EnglishUS]: {
    [Locale.EnglishUS]: "English",
    [Locale.EnglishGB]: "English",
    [Locale.ChineseTW]: "英文",
    [Locale.ChineseCN]: "英文",
    [Locale.Japanese]: "英語",
  },
  [Locale.EnglishGB]: {
    [Locale.EnglishUS]: "English (UK)",
    [Locale.EnglishGB]: "English (UK)",
    [Locale.ChineseTW]: "英文（英國）",
    [Locale.ChineseCN]: "英文（英国）",
    [Locale.Japanese]: "英語（イギリス）",
  },
  [Locale.ChineseTW]: {
    [Locale.EnglishUS]: "Traditional Chinese",
    [Locale.EnglishGB]: "Traditional Chinese",
    [Locale.ChineseTW]: "繁體中文",
    [Locale.ChineseCN]: "繁体中文",
    [Locale.Japanese]: "繁体字中国語",
  },
  [Locale.ChineseCN]: {
    [Locale.EnglishUS]: "Simplified Chinese",
    [Locale.EnglishGB]: "Simplified Chinese",
    [Locale.ChineseTW]: "簡體中文",
    [Locale.ChineseCN]: "简体中文",
    [Locale.Japanese]: "簡体字中国語",
  },
  [Locale.Japanese]: {
    [Locale.EnglishUS]: "Japanese",
    [Locale.EnglishGB]: "Japanese",
    [Locale.ChineseTW]: "日文",
    [Locale.ChineseCN]: "日文",
    [Locale.Japanese]: "日本語",
  },
} as const;

/**
 * Get localized channel mode display name
 */
export function getChannelModeDisplay(
  mode: "all" | "whitelist" | "blacklist",
  locale: Locale | string,
): string {
  const display = CHANNEL_MODE_DISPLAY[mode];
  return display[locale as keyof typeof display] || display[Locale.EnglishUS];
}

/**
 * Get localized language display name
 */
export function getLanguageDisplay(
  language: Locale | string,
  displayLocale: Locale | string,
): string {
  const display = LANGUAGE_DISPLAY[language as keyof typeof LANGUAGE_DISPLAY];
  if (!display) {
    return language;
  }
  return (
    display[displayLocale as keyof typeof display] || display[Locale.EnglishUS]
  );
}
