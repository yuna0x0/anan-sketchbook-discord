/**
 * Localization Configuration
 * Provides translations for slash command descriptions in multiple languages.
 * Supported locales: zh-TW (Traditional Chinese), zh-CN (Simplified Chinese), ja (Japanese)
 */

import { LocalizationMap } from "discord.js";
import { EmotionType, EmotionTypeValue } from "./config.js";

// Supported locale codes
export type SupportedLocale = "zh-TW" | "zh-CN" | "ja";

// Character name in different locales
export const CHARACTER_NAME: Record<SupportedLocale, string> = {
  "zh-TW": "夏目安安",
  "zh-CN": "夏目安安",
  ja: "夏目アンアン",
};

// Command description localizations
export const COMMAND_DESCRIPTION_LOCALIZATIONS: LocalizationMap = {
  "zh-TW": "生成一張安安拿著素描本的圖片",
  "zh-CN": "生成一张安安拿着素描本的图片",
  ja: "アンアンがスケッチブックを持っている画像を生成する",
};

// Option description localizations
export const OPTION_DESCRIPTION_LOCALIZATIONS: Record<string, LocalizationMap> =
  {
    text: {
      "zh-TW": "要顯示在素描本上的文字",
      "zh-CN": "要显示在素描本上的文字",
      ja: "スケッチブックに表示するテキスト",
    },
    image: {
      "zh-TW": "要貼在素描本上的圖片",
      "zh-CN": "要贴在素描本上的图片",
      ja: "スケッチブックに貼り付ける画像",
    },
    expression: {
      "zh-TW": "安安的表情",
      "zh-CN": "安安的表情",
      ja: "アンアンの表情",
    },
    align: {
      "zh-TW": "文字水平對齊方式",
      "zh-CN": "文字水平对齐方式",
      ja: "テキストの水平配置",
    },
    valign: {
      "zh-TW": "文字垂直對齊方式",
      "zh-CN": "文字垂直对齐方式",
      ja: "テキストの垂直配置",
    },
    dm: {
      "zh-TW": "將結果發送到私訊而不是頻道",
      "zh-CN": "将结果发送到私信而不是频道",
      ja: "結果をチャンネルではなくDMに送信する",
    },
    overlay: {
      "zh-TW": "套用疊加效果 (預設: True)",
      "zh-CN": "应用叠加效果 (默认: True)",
      ja: "オーバーレイ効果を適用する (デフォルト: True)",
    },
    wrap: {
      "zh-TW": "文字換行演算法",
      "zh-CN": "文字换行算法",
      ja: "テキスト折り返しアルゴリズム",
    },
  };

// Emotion display name localizations
export const EMOTION_DISPLAY_NAME_LOCALIZATIONS: Record<
  EmotionTypeValue,
  LocalizationMap
> = {
  [EmotionType.NORMAL]: {
    "zh-TW": "普通",
    "zh-CN": "普通",
    ja: "通常",
  },
  [EmotionType.HAPPY]: {
    "zh-TW": "開心",
    "zh-CN": "开心",
    ja: "嬉しい",
  },
  [EmotionType.ANGRY]: {
    "zh-TW": "生氣",
    "zh-CN": "生气",
    ja: "怒り",
  },
  [EmotionType.SPEECHLESS]: {
    "zh-TW": "無言",
    "zh-CN": "无语",
    ja: "呆れ",
  },
  [EmotionType.BLUSH]: {
    "zh-TW": "害羞",
    "zh-CN": "害羞",
    ja: "照れ",
  },
  [EmotionType.YANDERE]: {
    "zh-TW": "病嬌",
    "zh-CN": "病娇",
    ja: "ヤンデレ",
  },
  [EmotionType.CLOSED_EYES]: {
    "zh-TW": "閉眼",
    "zh-CN": "闭眼",
    ja: "目を閉じる",
  },
  [EmotionType.SAD]: {
    "zh-TW": "悲傷",
    "zh-CN": "悲伤",
    ja: "悲しい",
  },
  [EmotionType.SCARED]: {
    "zh-TW": "害怕",
    "zh-CN": "害怕",
    ja: "怖い",
  },
  [EmotionType.EXCITED]: {
    "zh-TW": "興奮",
    "zh-CN": "兴奋",
    ja: "興奮",
  },
  [EmotionType.SURPRISED]: {
    "zh-TW": "驚訝",
    "zh-CN": "惊讶",
    ja: "驚き",
  },
  [EmotionType.CRYING]: {
    "zh-TW": "哭泣",
    "zh-CN": "哭泣",
    ja: "泣く",
  },
};

// Alignment choice localizations
export const ALIGN_CHOICE_LOCALIZATIONS: Record<string, LocalizationMap> = {
  left: {
    "zh-TW": "左",
    "zh-CN": "左",
    ja: "左",
  },
  center: {
    "zh-TW": "中",
    "zh-CN": "中",
    ja: "中央",
  },
  right: {
    "zh-TW": "右",
    "zh-CN": "右",
    ja: "右",
  },
};

// Vertical alignment choice localizations
export const VALIGN_CHOICE_LOCALIZATIONS: Record<string, LocalizationMap> = {
  top: {
    "zh-TW": "上",
    "zh-CN": "上",
    ja: "上",
  },
  middle: {
    "zh-TW": "中",
    "zh-CN": "中",
    ja: "中央",
  },
  bottom: {
    "zh-TW": "下",
    "zh-CN": "下",
    ja: "下",
  },
};

// Wrap algorithm choice localizations
export const WRAP_CHOICE_LOCALIZATIONS: Record<string, LocalizationMap> = {
  greedy: {
    "zh-TW": "貪婪演算法（較快）",
    "zh-CN": "贪婪算法（较快）",
    ja: "グリーディ（高速）",
  },
  knuth_plass: {
    "zh-TW": "Knuth-Plass（品質較佳）",
    "zh-CN": "Knuth-Plass（质量较佳）",
    ja: "Knuth-Plass（高品質）",
  },
};
