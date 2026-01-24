/**
 * Locale Types and Utilities
 * Common types and helper functions for localization
 */

import { Locale } from "discord.js";

// Re-export Locale for convenience
export { Locale };

/**
 * Supported locales for this bot
 */
export const SUPPORTED_LOCALES = [
  Locale.EnglishUS,
  Locale.EnglishGB,
  Locale.ChineseTW,
  Locale.ChineseCN,
  Locale.Japanese,
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Supported guild languages (subset of locales that can be set as guild default)
 */
export const SUPPORTED_GUILD_LANGUAGES = [
  Locale.EnglishUS,
  Locale.ChineseTW,
  Locale.ChineseCN,
  Locale.Japanese,
] as const;

export type SupportedGuildLanguage = (typeof SUPPORTED_GUILD_LANGUAGES)[number];

/**
 * Check if a value is a supported guild language
 */
export function isSupportedGuildLanguage(
  value: string | null | undefined,
): value is SupportedGuildLanguage {
  if (!value) return false;
  return (SUPPORTED_GUILD_LANGUAGES as readonly string[]).includes(value);
}

/**
 * Locale record type for defining translations
 */
export type LocaleRecord<T = string> = {
  [K in SupportedLocale]?: T;
};

/**
 * Get a localized string from a locale record
 */
export function getLocalized<T>(
  record: LocaleRecord<T>,
  locale: Locale | string,
  fallback?: T,
): T | undefined {
  const result = record[locale as SupportedLocale];
  if (result !== undefined) return result;

  // Fallback to English US
  const enResult = record[Locale.EnglishUS];
  if (enResult !== undefined) return enResult;

  return fallback;
}

/**
 * Get a localized string with guaranteed return value
 */
export function getLocalizedRequired<T>(
  record: LocaleRecord<T>,
  locale: Locale | string,
  fallback: T,
): T {
  return getLocalized(record, locale, fallback) ?? fallback;
}

/**
 * Resolves the effective locale for a user, considering guild defaults.
 * For public messages in guilds with a default language set, uses guild language.
 * Otherwise uses user's locale, falling back to English.
 *
 * @param userLocale - The user's Discord locale
 * @param guildDefaultLanguage - The guild's default language (null if not set)
 * @param isPublic - Whether this is a public (non-ephemeral) response
 */
export function resolveLocale(
  userLocale: Locale | string,
  guildDefaultLanguage: string | null,
  isPublic: boolean = false,
): Locale {
  // For public messages in guilds with a default language set, use guild language
  if (isPublic && guildDefaultLanguage) {
    return guildDefaultLanguage as Locale;
  }

  // Otherwise use user's locale, falling back to English
  return (userLocale as Locale) || Locale.EnglishUS;
}

/**
 * Replace placeholders in a localized string
 * Placeholders are in the format {key}
 */
export function formatLocalized(
  template: string,
  replacements?: Record<string, string>,
): string {
  if (!replacements) return template;

  let result = template;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
  }
  return result;
}
