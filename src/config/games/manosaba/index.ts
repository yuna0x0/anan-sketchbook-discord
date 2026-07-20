/**
 * Manosaba Game Definition
 * Magical Girl Witch Trials (Manosaba) by Re,AER LLC./Acacia
 */

import { Locale } from "discord.js";
import type { GameDefinition } from "../types.js";
import { MANOSABA_CHARACTERS } from "./characters.js";
import {
  MANOSABA_BACKGROUNDS,
  MANOSABA_DEFAULT_BACKGROUND_ID,
} from "./backgrounds.js";
import { MANOSABA_CHARACTER_NAMES } from "./locales/characters.js";
import { MANOSABA_BACKGROUND_NAMES } from "./locales/backgrounds.js";
import { MANOSABA_EXPRESSION_NAMES } from "./locales/expressions.js";
import { MANOSABA_GAME_NAME } from "./locales/gameName.js";

export const MANOSABA: GameDefinition = {
  id: "manosaba",
  characters: MANOSABA_CHARACTERS,
  backgrounds: MANOSABA_BACKGROUNDS,
  defaultBackgroundId: MANOSABA_DEFAULT_BACKGROUND_ID,
  layout: {
    // Canvas dimensions (matching the game's dialogue box)
    canvasWidth: 2560,
    canvasHeight: 834,
    // Character sprite position
    characterPosition: { x: 0, y: 134 },
    // Text area boundaries
    textPosition: { x: 728, y: 355 },
    textAreaEnd: { x: 2339, y: 800 },
    // Default text settings
    defaultFontSize: 72,
    minFontSize: 36,
    lineHeightMultiplier: 1.2,
    // Shadow settings
    shadowOffset: { x: 2, y: 2 },
    shadowColor: { r: 0, g: 0, b: 0 },
    // Default text color
    defaultTextColor: { r: 255, g: 255, b: 255 },
  },
  fonts: {
    textDefaultFont: "tsukuMinPr6N",
    textFallbackFonts: [
      "tsukuMinPr6N",
      "notoSerifTCSemiBold",
      "notoSerifSCSemiBold",
      "notoSerifKRSemiBold",
      "notoSerifThaiSemiBold",
    ],
    nameLocaleFonts: {
      [Locale.Japanese]: "tsukuMinPr6N",
      [Locale.ChineseCN]: "notoSerifSCSemiBold",
      [Locale.ChineseTW]: "notoSerifTCSemiBold",
    },
    nameFallbackFont: "tsukuMinPr6N",
  },
  overlayFilename: "overlay.webp",
  supportedNameLocales: [Locale.Japanese, Locale.ChineseTW, Locale.ChineseCN],
  fallbackNameLocale: Locale.Japanese,
  localizations: {
    gameName: MANOSABA_GAME_NAME,
    characterNames: MANOSABA_CHARACTER_NAMES,
    backgroundNames: MANOSABA_BACKGROUND_NAMES,
    expressionNames: MANOSABA_EXPRESSION_NAMES,
  },
};
