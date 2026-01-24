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
    align: {
      [Locale.EnglishUS]: "Horizontal text alignment",
      [Locale.EnglishGB]: "Horizontal text alignment",
      [Locale.ChineseTW]: "文字水平對齊方式",
      [Locale.ChineseCN]: "文字水平对齐方式",
      [Locale.Japanese]: "テキストの水平配置",
    },
    valign: {
      [Locale.EnglishUS]: "Vertical text alignment",
      [Locale.EnglishGB]: "Vertical text alignment",
      [Locale.ChineseTW]: "文字垂直對齊方式",
      [Locale.ChineseCN]: "文字垂直对齐方式",
      [Locale.Japanese]: "テキストの垂直配置",
    },
    dm: {
      [Locale.EnglishUS]: "Send the result to your DMs instead of the channel",
      [Locale.EnglishGB]: "Send the result to your DMs instead of the channel",
      [Locale.ChineseTW]: "將結果發送到私訊而不是頻道",
      [Locale.ChineseCN]: "将结果发送到私信而不是频道",
      [Locale.Japanese]: "結果をチャンネルではなくDMに送信する",
    },
    overlay: {
      [Locale.EnglishUS]: "Apply the overlay effect (default: True)",
      [Locale.EnglishGB]: "Apply the overlay effect (default: True)",
      [Locale.ChineseTW]: "套用疊加效果 (預設: True)",
      [Locale.ChineseCN]: "应用叠加效果 (默认: True)",
      [Locale.Japanese]: "オーバーレイ効果を適用する (デフォルト: True)",
    },
    wrap: {
      [Locale.EnglishUS]: "Text wrapping algorithm",
      [Locale.EnglishGB]: "Text wrapping algorithm",
      [Locale.ChineseTW]: "文字換行演算法",
      [Locale.ChineseCN]: "文字换行算法",
      [Locale.Japanese]: "テキスト折り返しアルゴリズム",
    },
    font: {
      [Locale.EnglishUS]: "Font for the text",
      [Locale.EnglishGB]: "Font for the text",
      [Locale.ChineseTW]: "文字的字體",
      [Locale.ChineseCN]: "文字的字体",
      [Locale.Japanese]: "テキストのフォント",
    },
  };
