/**
 * Dialogue Expression Localizations
 * Game-aware expression name lookup; the per-game name tables live in
 * src/config/games/<gameId>/locales/expressions.ts
 */

import { Locale } from "discord.js";
import { getGame } from "../../config/games/index.js";

/**
 * Get localized expression name for autocomplete display
 */
export function getLocalizedExpressionName(
  gameId: string,
  expressionId: string,
  locale: Locale | string,
): string {
  const localization = getGame(gameId).localizations.expressionNames[
    expressionId
  ];

  if (!localization) {
    // Fallback: extract a display name from the expression ID
    // e.g., "ema_expression_1" -> "Expression 1"
    const match = expressionId.match(/expression_(\d+)$/);
    if (match) {
      return `Expression ${match[1]}`;
    }
    return expressionId;
  }

  // Try exact locale match first
  const localeKey = locale as Locale;
  if (localization[localeKey]) {
    return localization[localeKey] as string;
  }

  // Try English locales as fallback
  const englishLocales = [Locale.EnglishUS, Locale.EnglishGB];
  for (const englishLocale of englishLocales) {
    if (localization[englishLocale]) {
      return localization[englishLocale] as string;
    }
  }

  // Final fallback: return the expression ID
  return expressionId;
}
