/**
 * Dialogue Configuration
 * Main configuration for the dialogue command including layout settings,
 * font configuration, and asset path utilities
 */

import { join } from "path";
import { Locale } from "discord.js";
import { ASSETS_DIR } from "../assets.js";
import { FontId, getFontPath } from "../fonts.js";
import { RGBColor } from "../types.js";
import { BACKGROUNDS } from "./backgrounds.js";

// Re-export everything from sub-modules
export * from "./characters.js";
export * from "./backgrounds.js";

// =============================================================================
// Font Configuration
// =============================================================================

// Default font for dialogue text
export const DIALOGUE_TEXT_DEFAULT_FONT: FontId = "tsukuMinPr6N";

// Fallback fonts for dialogue text
export const DIALOGUE_TEXT_FALLBACK_FONTS: FontId[] = [
  "tsukuMinPr6N",
  "notoSerifTCSemiBold",
  "notoSerifKRSemiBold",
  "notoSerifThaiSemiBold",
];

// Character name font mapping by Discord locale
export const CHARACTER_NAME_LOCALE_FONTS: Partial<Record<Locale, FontId>> = {
  [Locale.Japanese]: "tsukuMinPr6N",
  [Locale.ChineseCN]: "notoSerifTCSemiBold",
  [Locale.ChineseTW]: "notoSerifTCSemiBold",
};

// Get character name font for a specific locale
export function getCharacterNameFontForLocale(locale: Locale): FontId {
  return CHARACTER_NAME_LOCALE_FONTS[locale] ?? "tsukuMinPr6N";
}

// =============================================================================
// Layout Configuration
// =============================================================================

// Dialogue canvas configuration
export const DIALOGUE_CONFIG = {
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
  lineHeightMultiplier: 1.2,
  // Shadow settings
  shadowOffset: { x: 2, y: 2 },
  shadowColor: { r: 0, g: 0, b: 0 } as RGBColor,
  // Default text color
  defaultTextColor: { r: 255, g: 255, b: 255 } as RGBColor,
} as const;

// =============================================================================
// Asset Path Utilities
// =============================================================================

// Get the full path to a dialogue asset file
export function getDialogueAssetPath(
  type: "characters" | "backgrounds" | "ui",
  ...parts: string[]
): string {
  return join(ASSETS_DIR, "dialogue", type, ...parts);
}

// Get character image path
export function getCharacterImagePath(
  characterId: string,
  expression: number,
): string {
  return getDialogueAssetPath(
    "characters",
    characterId,
    `${characterId}_${expression}.png`,
  );
}

// Get background image path
export function getBackgroundImagePath(backgroundId: string): string {
  const filename = BACKGROUNDS[backgroundId];
  if (!filename) {
    throw new Error(`Unknown background ID: ${backgroundId}`);
  }
  return getDialogueAssetPath("backgrounds", filename);
}

// Get dialogue font path (uses the unified font system)
export function getDialogueFontPath(fontId: FontId): string {
  return getFontPath(fontId);
}

// Get UI overlay path
export function getDialogueOverlayPath(): string {
  return getDialogueAssetPath("ui", "overlay.png");
}
