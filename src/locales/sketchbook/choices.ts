/**
 * Sketchbook Choice Localizations
 * Contains alignment and wrap choice localizations for the sketchbook command
 */

import { Locale, LocalizationMap } from "discord.js";

// =============================================================================
// Alignment Choice Localizations
// =============================================================================

export const ALIGN_CHOICE_LOCALIZATIONS: Record<string, LocalizationMap> = {
  left: {
    [Locale.EnglishUS]: "Left",
    [Locale.EnglishGB]: "Left",
    [Locale.ChineseTW]: "左",
    [Locale.ChineseCN]: "左",
    [Locale.Japanese]: "左",
  },
  center: {
    [Locale.EnglishUS]: "Center",
    [Locale.EnglishGB]: "Centre",
    [Locale.ChineseTW]: "中",
    [Locale.ChineseCN]: "中",
    [Locale.Japanese]: "中央",
  },
  right: {
    [Locale.EnglishUS]: "Right",
    [Locale.EnglishGB]: "Right",
    [Locale.ChineseTW]: "右",
    [Locale.ChineseCN]: "右",
    [Locale.Japanese]: "右",
  },
};

// =============================================================================
// Vertical Alignment Choice Localizations
// =============================================================================

export const VALIGN_CHOICE_LOCALIZATIONS: Record<string, LocalizationMap> = {
  top: {
    [Locale.EnglishUS]: "Top",
    [Locale.EnglishGB]: "Top",
    [Locale.ChineseTW]: "上",
    [Locale.ChineseCN]: "上",
    [Locale.Japanese]: "上",
  },
  middle: {
    [Locale.EnglishUS]: "Middle",
    [Locale.EnglishGB]: "Middle",
    [Locale.ChineseTW]: "中",
    [Locale.ChineseCN]: "中",
    [Locale.Japanese]: "中央",
  },
  bottom: {
    [Locale.EnglishUS]: "Bottom",
    [Locale.EnglishGB]: "Bottom",
    [Locale.ChineseTW]: "下",
    [Locale.ChineseCN]: "下",
    [Locale.Japanese]: "下",
  },
};

// =============================================================================
// Wrap Choice Localizations
// =============================================================================

export const WRAP_CHOICE_LOCALIZATIONS: Record<string, LocalizationMap> = {
  greedy: {
    [Locale.EnglishUS]: "Greedy (faster)",
    [Locale.EnglishGB]: "Greedy (faster)",
    [Locale.ChineseTW]: "貪婪演算法（較快）",
    [Locale.ChineseCN]: "贪婪算法（较快）",
    [Locale.Japanese]: "グリーディ（高速）",
  },
  knuth_plass: {
    [Locale.EnglishUS]: "Knuth-Plass (better quality)",
    [Locale.EnglishGB]: "Knuth-Plass (better quality)",
    [Locale.ChineseTW]: "Knuth-Plass（品質較佳）",
    [Locale.ChineseCN]: "Knuth-Plass（质量较佳）",
    [Locale.Japanese]: "Knuth-Plass（高品質）",
  },
};
