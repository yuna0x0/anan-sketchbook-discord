/**
 * Settings Command Localizations
 * Contains command descriptions and channel mode choices
 */

import { Locale, LocalizationMap } from "discord.js";

/**
 * Settings command description localizations
 */
export const SETTINGS_COMMAND_LOCALIZATIONS = {
  description: {
    [Locale.EnglishUS]: "Configure bot settings for this server",
    [Locale.EnglishGB]: "Configure bot settings for this server",
    [Locale.ChineseTW]: "設定此伺服器的機器人",
    [Locale.ChineseCN]: "配置此服务器的机器人",
    [Locale.Japanese]: "このサーバーのボット設定を構成",
  } as LocalizationMap,

  // Channel mode choices (used in default channels panel)
  channelModeChoices: {
    all: {
      [Locale.EnglishUS]: "All Channels",
      [Locale.EnglishGB]: "All Channels",
      [Locale.ChineseTW]: "所有頻道",
      [Locale.ChineseCN]: "所有频道",
      [Locale.Japanese]: "すべてのチャンネル",
    } as LocalizationMap,
    whitelist: {
      [Locale.EnglishUS]: "Whitelist",
      [Locale.EnglishGB]: "Whitelist",
      [Locale.ChineseTW]: "白名單",
      [Locale.ChineseCN]: "白名单",
      [Locale.Japanese]: "ホワイトリスト",
    } as LocalizationMap,
    blacklist: {
      [Locale.EnglishUS]: "Blacklist",
      [Locale.EnglishGB]: "Blacklist",
      [Locale.ChineseTW]: "黑名單",
      [Locale.ChineseCN]: "黑名单",
      [Locale.Japanese]: "ブラックリスト",
    } as LocalizationMap,
  },
} as const;
