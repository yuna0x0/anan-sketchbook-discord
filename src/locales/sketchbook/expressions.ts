/**
 * Sketchbook Expression Localizations
 * Contains expression display name localizations for the sketchbook command
 */

import { Locale, LocalizationMap } from "discord.js";
import {
  EmotionType,
  ExpressionOption,
  ExpressionOptionValue,
} from "../../config/sketchbook/index.js";

// =============================================================================
// Expression Display Names
// =============================================================================

export const EXPRESSION_DISPLAY_NAME_LOCALIZATIONS: Record<
  ExpressionOptionValue,
  LocalizationMap
> = {
  [EmotionType.NORMAL]: {
    [Locale.EnglishUS]: "Normal",
    [Locale.EnglishGB]: "Normal",
    [Locale.ChineseTW]: "普通",
    [Locale.ChineseCN]: "普通",
    [Locale.Japanese]: "通常",
  },
  [EmotionType.HAPPY]: {
    [Locale.EnglishUS]: "Happy",
    [Locale.EnglishGB]: "Happy",
    [Locale.ChineseTW]: "開心",
    [Locale.ChineseCN]: "开心",
    [Locale.Japanese]: "嬉しい",
  },
  [EmotionType.ANGRY]: {
    [Locale.EnglishUS]: "Angry",
    [Locale.EnglishGB]: "Angry",
    [Locale.ChineseTW]: "生氣",
    [Locale.ChineseCN]: "生气",
    [Locale.Japanese]: "怒り",
  },
  [EmotionType.SPEECHLESS]: {
    [Locale.EnglishUS]: "Speechless",
    [Locale.EnglishGB]: "Speechless",
    [Locale.ChineseTW]: "無言",
    [Locale.ChineseCN]: "无语",
    [Locale.Japanese]: "呆れ",
  },
  [EmotionType.BLUSH]: {
    [Locale.EnglishUS]: "Blush",
    [Locale.EnglishGB]: "Blush",
    [Locale.ChineseTW]: "害羞",
    [Locale.ChineseCN]: "害羞",
    [Locale.Japanese]: "照れ",
  },
  [EmotionType.YANDERE]: {
    [Locale.EnglishUS]: "Yandere",
    [Locale.EnglishGB]: "Yandere",
    [Locale.ChineseTW]: "病嬌",
    [Locale.ChineseCN]: "病娇",
    [Locale.Japanese]: "ヤンデレ",
  },
  [EmotionType.CLOSED_EYES]: {
    [Locale.EnglishUS]: "Closed Eyes",
    [Locale.EnglishGB]: "Closed Eyes",
    [Locale.ChineseTW]: "閉眼",
    [Locale.ChineseCN]: "闭眼",
    [Locale.Japanese]: "目を閉じる",
  },
  [EmotionType.SAD]: {
    [Locale.EnglishUS]: "Sad",
    [Locale.EnglishGB]: "Sad",
    [Locale.ChineseTW]: "悲傷",
    [Locale.ChineseCN]: "悲伤",
    [Locale.Japanese]: "悲しい",
  },
  [EmotionType.SCARED]: {
    [Locale.EnglishUS]: "Scared",
    [Locale.EnglishGB]: "Scared",
    [Locale.ChineseTW]: "害怕",
    [Locale.ChineseCN]: "害怕",
    [Locale.Japanese]: "怖い",
  },
  [EmotionType.EXCITED]: {
    [Locale.EnglishUS]: "Excited",
    [Locale.EnglishGB]: "Excited",
    [Locale.ChineseTW]: "興奮",
    [Locale.ChineseCN]: "兴奋",
    [Locale.Japanese]: "興奮",
  },
  [EmotionType.SURPRISED]: {
    [Locale.EnglishUS]: "Surprised",
    [Locale.EnglishGB]: "Surprised",
    [Locale.ChineseTW]: "驚訝",
    [Locale.ChineseCN]: "惊讶",
    [Locale.Japanese]: "驚き",
  },
  [EmotionType.CRYING]: {
    [Locale.EnglishUS]: "Crying",
    [Locale.EnglishGB]: "Crying",
    [Locale.ChineseTW]: "哭泣",
    [Locale.ChineseCN]: "哭泣",
    [Locale.Japanese]: "泣く",
  },
  [ExpressionOption.RANDOM]: {
    [Locale.EnglishUS]: "(Random)",
    [Locale.EnglishGB]: "(Random)",
    [Locale.ChineseTW]: "(隨機)",
    [Locale.ChineseCN]: "(随机)",
    [Locale.Japanese]: "(ランダム)",
  },
};
