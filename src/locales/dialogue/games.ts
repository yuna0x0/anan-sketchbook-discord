/**
 * Dialogue Game Localizations
 * Game display-name lookup for the /dialogue `game` option and messages
 */

import { Locale } from "discord.js";
import { getGame } from "../../config/games/index.js";
import { LocaleRecord, getLocalized } from "../types.js";

/**
 * Get localized game display name
 */
export function getLocalizedGameName(
  gameId: string,
  locale: Locale | string,
): string {
  const localizations = getGame(gameId).localizations.gameName;
  return getLocalized(localizations as LocaleRecord, locale, gameId) ?? gameId;
}
