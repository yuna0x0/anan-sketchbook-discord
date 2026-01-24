/**
 * Dialogue Choice Localizations
 * Contains language and stretch mode choice localizations for the dialogue command
 */

import { Locale, LocalizationMap } from "discord.js";
import { NameConfigLocale } from "../../config/dialogue/characters.js";

// =============================================================================
// Language Choice Localizations
// =============================================================================

export const LANGUAGE_CHOICE_LOCALIZATIONS: Partial<
  Record<NameConfigLocale, LocalizationMap>
> = {
  [Locale.ChineseCN]: {
    [Locale.EnglishUS]: "Simplified Chinese (zh-CN)",
    [Locale.EnglishGB]: "Simplified Chinese (zh-CN)",
    [Locale.ChineseTW]: "簡體中文 (zh-CN)",
    [Locale.ChineseCN]: "简体中文 (zh-CN)",
    [Locale.Japanese]: "簡体字中国語 (zh-CN)",
  },
  [Locale.ChineseTW]: {
    [Locale.EnglishUS]: "Traditional Chinese (zh-TW)",
    [Locale.EnglishGB]: "Traditional Chinese (zh-TW)",
    [Locale.ChineseTW]: "繁體中文 (zh-TW)",
    [Locale.ChineseCN]: "繁体中文 (zh-TW)",
    [Locale.Japanese]: "繁体字中国語 (zh-TW)",
  },
  [Locale.Japanese]: {
    [Locale.EnglishUS]: "Japanese (ja)",
    [Locale.EnglishGB]: "Japanese (ja)",
    [Locale.ChineseTW]: "日文 (ja)",
    [Locale.ChineseCN]: "日文 (ja)",
    [Locale.Japanese]: "日本語 (ja)",
  },
};

// =============================================================================
// Stretch Mode Localizations
// =============================================================================

export const STRETCH_MODE_LOCALIZATIONS: Record<string, LocalizationMap> = {
  stretch: {
    [Locale.EnglishUS]: "Stretch",
    [Locale.EnglishGB]: "Stretch",
    [Locale.ChineseTW]: "拉伸",
    [Locale.ChineseCN]: "拉伸",
    [Locale.Japanese]: "ストレッチ",
  },
  stretch_x: {
    [Locale.EnglishUS]: "Stretch X",
    [Locale.EnglishGB]: "Stretch X",
    [Locale.ChineseTW]: "水平拉伸",
    [Locale.ChineseCN]: "水平拉伸",
    [Locale.Japanese]: "水平ストレッチ",
  },
  stretch_y: {
    [Locale.EnglishUS]: "Stretch Y",
    [Locale.EnglishGB]: "Stretch Y",
    [Locale.ChineseTW]: "垂直拉伸",
    [Locale.ChineseCN]: "垂直拉伸",
    [Locale.Japanese]: "垂直ストレッチ",
  },
  zoom_x: {
    [Locale.EnglishUS]: "Zoom X",
    [Locale.EnglishGB]: "Zoom X",
    [Locale.ChineseTW]: "水平縮放",
    [Locale.ChineseCN]: "水平缩放",
    [Locale.Japanese]: "水平ズーム",
  },
  zoom_y: {
    [Locale.EnglishUS]: "Zoom Y",
    [Locale.EnglishGB]: "Zoom Y",
    [Locale.ChineseTW]: "垂直縮放",
    [Locale.ChineseCN]: "垂直缩放",
    [Locale.Japanese]: "垂直ズーム",
  },
  original: {
    [Locale.EnglishUS]: "Original",
    [Locale.EnglishGB]: "Original",
    [Locale.ChineseTW]: "原始大小",
    [Locale.ChineseCN]: "原始大小",
    [Locale.Japanese]: "オリジナル",
  },
};
