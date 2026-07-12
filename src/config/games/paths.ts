/**
 * Game Asset Path Utilities
 * Builds paths to per-game dialogue assets under assets/games/<gameId>/dialogue/
 */

import { join } from "path";
import { ASSETS_DIR } from "../assets.js";
import { FontId, getFontPath } from "../fonts.js";
import type { GameDefinition } from "./types.js";

// Get the full path to a game's dialogue asset file
export function getGameAssetPath(
  gameId: string,
  type: "characters" | "backgrounds" | "ui",
  ...parts: string[]
): string {
  return join(ASSETS_DIR, "games", gameId, "dialogue", type, ...parts);
}

// File extension for character sprite assets
export const SPRITE_EXTENSION = ".webp";

// Get character image path
export function getCharacterImagePath(
  gameId: string,
  characterId: string,
  expression: number,
): string {
  return getGameAssetPath(
    gameId,
    "characters",
    characterId,
    `${characterId}_${expression}${SPRITE_EXTENSION}`,
  );
}

// Get background image path
export function getBackgroundImagePath(
  game: GameDefinition,
  backgroundId: string,
): string {
  const filename = game.backgrounds[backgroundId];
  if (!filename) {
    throw new Error(
      `Unknown background ID for game ${game.id}: ${backgroundId}`,
    );
  }
  return getGameAssetPath(game.id, "backgrounds", filename);
}

// Get UI overlay path
export function getDialogueOverlayPath(game: GameDefinition): string {
  return getGameAssetPath(game.id, "ui", game.overlayFilename);
}

// Get dialogue font path (fonts are shared across games via the unified font system)
export function getDialogueFontPath(fontId: FontId): string {
  return getFontPath(fontId);
}
