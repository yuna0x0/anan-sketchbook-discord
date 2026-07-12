/**
 * Game Registry
 * Central registry of all games supported by the dialogue system.
 * To add a game, create src/config/games/<gameId>/ exporting a GameDefinition
 * and add it here — see docs/adding-a-game.md.
 */

import { MANOSABA } from "./manosaba/index.js";
import type { GameDefinition } from "./types.js";

export const GAMES = {
  manosaba: MANOSABA,
} as const satisfies Record<string, GameDefinition>;

// Registered game IDs as a type
export type GameId = keyof typeof GAMES;

// Game used when the `game` option is omitted (the bot's original game)
export const DEFAULT_GAME_ID: GameId = "manosaba";

// Check whether a string is a registered game ID
export function isGameId(value: string): value is GameId {
  return value in GAMES;
}

// Get all registered game IDs
export function getGameIds(): GameId[] {
  return Object.keys(GAMES) as GameId[];
}

// Resolve a (possibly missing or invalid) ID to a game definition,
// falling back to the default game
export function getGame(id: string | null | undefined): GameDefinition {
  return id && isGameId(id) ? GAMES[id] : GAMES[DEFAULT_GAME_ID];
}

// Resolve an ID to a game definition, or undefined if not registered
export function getGameStrict(id: string): GameDefinition | undefined {
  return isGameId(id) ? GAMES[id] : undefined;
}

export * from "./types.js";
export * from "./helpers.js";
export * from "./paths.js";
