/**
 * Dialogue Background Localizations
 * Game-aware background name lookup; the per-game name tables live in
 * src/config/games/<gameId>/locales/backgrounds.ts
 */

import { Locale } from "discord.js";
import { getGame } from "../../config/games/index.js";

/**
 * Get localized background name based on Discord locale
 * @param gameId - The game the background belongs to
 * @param backgroundId - The background ID (e.g., "bg_001_001")
 * @param locale - The Discord locale string (e.g., "zh-TW", "ja", "en-US")
 * @returns The localized background name, or the ID if no localization exists
 */
export function getLocalizedBackgroundName(
  gameId: string,
  backgroundId: string,
  locale: string,
): string {
  const localization = getGame(gameId).localizations.backgroundNames[
    backgroundId
  ];
  if (!localization) {
    return backgroundId;
  }

  // Check for direct match first
  if (locale in localization) {
    return localization[locale as Locale] ?? backgroundId;
  }

  // Fall back to English for unsupported locales
  return localization[Locale.EnglishUS] ?? backgroundId;
}
