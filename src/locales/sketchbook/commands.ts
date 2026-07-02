/**
 * Sketchbook Command Localizations
 * Contains command descriptions and option localizations
 */

import { Locale, LocalizationMap } from "discord.js";

// =============================================================================
// Command Description
// =============================================================================

export const COMMAND_DESCRIPTION_LOCALIZATIONS: LocalizationMap = {
  [Locale.EnglishUS]: "Generate an image with Anan holding a sketchbook",
  [Locale.EnglishGB]: "Generate an image with Anan holding a sketchbook",
  [Locale.ChineseTW]: "生成一張安安拿著素描本的圖片",
  [Locale.ChineseCN]: "生成一张安安拿着素描本的图片",
  [Locale.Japanese]: "アンアンがスケッチブックを持っている画像を生成する",
};

// =============================================================================
// Option Descriptions
// =============================================================================

export const OPTION_DESCRIPTION_LOCALIZATIONS: Record<string, LocalizationMap> =
  {
    text: {
      [Locale.EnglishUS]: "The text to display on the sketchbook",
      [Locale.EnglishGB]: "The text to display on the sketchbook",
      [Locale.ChineseTW]: "要顯示在素描本上的文字",
      [Locale.ChineseCN]: "要显示在素描本上的文字",
      [Locale.Japanese]: "スケッチブックに表示するテキスト",
    },
    image: {
      [Locale.EnglishUS]: "An image to paste on the sketchbook",
      [Locale.EnglishGB]: "An image to paste on the sketchbook",
      [Locale.ChineseTW]: "要貼在素描本上的圖片",
      [Locale.ChineseCN]: "要贴在素描本上的图片",
      [Locale.Japanese]: "スケッチブックに貼り付ける画像",
    },
    expression: {
      [Locale.EnglishUS]: "Anan's facial expression",
      [Locale.EnglishGB]: "Anan's facial expression",
      [Locale.ChineseTW]: "安安的表情",
      [Locale.ChineseCN]: "安安的表情",
      [Locale.Japanese]: "アンアンの表情",
    },
    dm: {
      [Locale.EnglishUS]: "Send the result to your DMs instead of the channel",
      [Locale.EnglishGB]: "Send the result to your DMs instead of the channel",
      [Locale.ChineseTW]: "將結果發送到私訊而不是頻道",
      [Locale.ChineseCN]: "将结果发送到私信而不是频道",
      [Locale.Japanese]: "結果をチャンネルではなくDMに送信する",
    },
    spoiler: {
      [Locale.EnglishUS]: "Mark the generated image as a spoiler (default: False)",
      [Locale.EnglishGB]: "Mark the generated image as a spoiler (default: False)",
      [Locale.ChineseTW]: "將生成的圖片標記為劇透 (預設: False)",
      [Locale.ChineseCN]: "将生成的图片标记为剧透 (默认: False)",
      [Locale.Japanese]: "生成画像をネタバレとしてマークする (デフォルト: False)",
    },
  };
