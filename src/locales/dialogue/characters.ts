/**
 * Dialogue Character Localizations
 * Game-aware character name lookup; the per-game name tables live in
 * src/config/games/<gameId>/locales/characters.ts
 */

import { Locale } from "discord.js";
import { getGame } from "../../config/games/index.js";
import { LocaleRecord, getLocalized } from "../types.js";

/**
 * Get localized character name for a game
 */
export function getLocalizedCharacterName(
  gameId: string,
  characterId: string,
  locale: Locale | string,
): string {
  const localizations = getGame(gameId).localizations.characterNames[
    characterId
  ];
  if (!localizations) {
    return characterId;
  }
  return (
    getLocalized(localizations as LocaleRecord, locale, characterId) ??
    characterId
  );
}
