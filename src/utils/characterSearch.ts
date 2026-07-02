/**
 * Character Search
 * Autocomplete suggestions for the /dialogue character option, with
 * anti-spoiler handling for hidden characters.
 *
 * Visible characters match loosely against their ID and every localized name
 * (so a Chinese name still works on an English client). Hidden characters are
 * never listed by default and only appear when the query closely matches one
 * of their names, so players who already know them can still find them while
 * everyone else never sees a hint.
 */

import { Locale } from "discord.js";
import { CHARACTERS, CharacterId } from "../config/dialogue/characters.js";
import { CHARACTER_NAME_LOCALIZATIONS } from "../locales/index.js";

// Discord's autocomplete result limit
const MAX_SUGGESTIONS = 25;

// Minimum query length before a hidden character can be revealed:
// short ASCII fragments are common while browsing, so they never reveal;
// CJK characters carry enough meaning that a single one may.
const HIDDEN_MIN_QUERY_ASCII = 3;
const HIDDEN_MIN_QUERY_OTHER = 1;

export interface CharacterSuggestion {
  id: CharacterId;
  displayName: string;
}

/** All lowercased search candidates for a character: ID plus every localized name */
function searchCandidates(id: CharacterId): string[] {
  const names = Object.values(CHARACTER_NAME_LOCALIZATIONS[id] ?? {}).filter(
    (name): name is string => typeof name === "string",
  );
  return [id, ...names].map((name) => name.toLowerCase());
}

function displayName(id: CharacterId, locale: string): string {
  const localizations = CHARACTER_NAME_LOCALIZATIONS[id] ?? {};
  return (
    localizations[locale as Locale] ?? localizations[Locale.EnglishUS] ?? id
  );
}

function isAscii(value: string): boolean {
  // eslint-disable-next-line no-control-regex
  return /^[\x00-\x7F]*$/.test(value);
}

/**
 * Whether a query is a close enough match to reveal a hidden character
 */
export function matchesHiddenCharacter(
  id: CharacterId,
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  const minLength = isAscii(q) ? HIDDEN_MIN_QUERY_ASCII : HIDDEN_MIN_QUERY_OTHER;
  if (q.length < minLength) {
    return false;
  }
  return searchCandidates(id).some((candidate) => candidate.includes(q));
}

/**
 * Get character suggestions for an autocomplete query.
 * Hidden characters are excluded unless the query closely matches them.
 */
export function searchCharacters(
  query: string,
  locale: string,
): CharacterSuggestion[] {
  const q = query.trim().toLowerCase();
  const results: CharacterSuggestion[] = [];

  for (const [id, info] of Object.entries(CHARACTERS)) {
    if (info.hidden) {
      if (!matchesHiddenCharacter(id, query)) {
        continue;
      }
    } else if (
      q.length > 0 &&
      !searchCandidates(id).some((candidate) => candidate.includes(q))
    ) {
      continue;
    }

    results.push({ id, displayName: displayName(id, locale) });
  }

  return results.slice(0, MAX_SUGGESTIONS);
}
