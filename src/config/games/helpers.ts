/**
 * Game Helpers
 * Game-scoped accessors for characters, expressions, name configs, and fonts.
 */

import type { FontId } from "../fonts.js";
import type {
  CharacterInfo,
  GameDefinition,
  NameConfigLocale,
  NameTextConfig,
} from "./types.js";

// Get a game's character by ID
export function getCharacter(
  game: GameDefinition,
  id: string,
): CharacterInfo | undefined {
  return game.characters[id];
}

// Get all character IDs of a game
export function getCharacterIds(game: GameDefinition): string[] {
  return Object.keys(game.characters);
}

// Get all background IDs of a game
export function getBackgroundIds(game: GameDefinition): string[] {
  return Object.keys(game.backgrounds);
}

// Get expression number from expression name for a character
export function getExpressionNumber(
  character: CharacterInfo,
  expressionName: string,
): number | undefined {
  const index = character.expressions.indexOf(expressionName);
  return index >= 0 ? index + 1 : undefined;
}

// Get all expression names for a character
export function getExpressionNames(character: CharacterInfo): string[] {
  return character.expressions;
}

// Get name config for a specific locale, falling back to the game's fallback locale
export function getNameConfig(
  game: GameDefinition,
  character: CharacterInfo,
  locale: NameConfigLocale,
): NameTextConfig[] {
  return (
    character.nameConfig[locale] ??
    character.nameConfig[game.fallbackNameLocale] ??
    []
  );
}

// Get character name font for a specific locale
export function getCharacterNameFontForLocale(
  game: GameDefinition,
  locale: NameConfigLocale,
): FontId {
  return game.fonts.nameLocaleFonts[locale] ?? game.fonts.nameFallbackFont;
}

// Check if a Discord locale is supported for name display in a game
export function isSupportedNameLocale(
  game: GameDefinition,
  locale: NameConfigLocale | string,
): locale is NameConfigLocale {
  return game.supportedNameLocales.includes(locale as NameConfigLocale);
}
