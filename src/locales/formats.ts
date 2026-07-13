/**
 * Output Format Option Localizations
 * Shared by /sketchbook and /dialogue for the optional format choice
 */

import { Locale, LocalizationMap } from "discord.js";
import {
  OUTPUT_FORMATS,
  type OutputFormat,
} from "../config/outputFormats.js";

export const FORMAT_OPTION_DESCRIPTION_LOCALIZATIONS: LocalizationMap = {
  [Locale.EnglishUS]: "Output image format (default: WebP)",
  [Locale.EnglishGB]: "Output image format (default: WebP)",
  [Locale.ChineseTW]: "輸出圖片格式（預設：WebP）",
  [Locale.ChineseCN]: "输出图片格式（默认：WebP）",
  [Locale.Japanese]: "出力画像形式（デフォルト：WebP）",
};

const FORMAT_CHOICE_LOCALIZATIONS: Record<
  OutputFormat,
  LocalizationMap
> = {
  webp: {
    [Locale.EnglishUS]: "WebP (default, smallest file)",
    [Locale.EnglishGB]: "WebP (default, smallest file)",
    [Locale.ChineseTW]: "WebP（預設，檔案最小）",
    [Locale.ChineseCN]: "WebP（默认，文件最小）",
    [Locale.Japanese]: "WebP（デフォルト・最小サイズ）",
  },
  png: {
    [Locale.EnglishUS]: "PNG (lossless, best for re-sharing)",
    [Locale.EnglishGB]: "PNG (lossless, best for re-sharing)",
    [Locale.ChineseTW]: "PNG（無損，轉發相容性最佳）",
    [Locale.ChineseCN]: "PNG（无损，转发兼容性最佳）",
    [Locale.Japanese]: "PNG（劣化なし・共有互換性が高い）",
  },
  jpg: {
    [Locale.EnglishUS]: "JPEG (no transparency)",
    [Locale.EnglishGB]: "JPEG (no transparency)",
    [Locale.ChineseTW]: "JPEG（不支援透明）",
    [Locale.ChineseCN]: "JPEG（不支持透明）",
    [Locale.Japanese]: "JPEG（透過非対応）",
  },
};

// Prebuilt slash command choices, shared by /sketchbook and /dialogue
export const FORMAT_CHOICES = OUTPUT_FORMATS.map((value) => ({
  name: FORMAT_CHOICE_LOCALIZATIONS[value][Locale.EnglishUS]!,
  name_localizations: FORMAT_CHOICE_LOCALIZATIONS[value],
  value,
}));
