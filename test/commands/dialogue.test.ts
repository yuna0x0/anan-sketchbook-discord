/**
 * Dialogue Command Tests
 * Asserts the slash command builder shape (game option first and required),
 * the wrong-game lookup helpers, and message localization completeness.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Locale } from "discord.js";

import { data } from "../../src/commands/dialogue.js";
import { getGameIds } from "../../src/config/games/index.js";
import {
  findOtherGamesWithBackground,
  findOtherGamesWithCharacter,
} from "../../src/config/games/helpers.js";
import type { GameDefinition } from "../../src/config/games/types.js";
import { DIALOGUE_MESSAGES } from "../../src/locales/dialogue/messages.js";

describe("dialogue command builder", () => {
  const options = (data.toJSON().options ?? []) as {
    name: string;
    required?: boolean;
    choices?: unknown[];
  }[];

  it("game should be the first option, required, with one choice per game", () => {
    const game = options[0];
    assert.equal(game.name, "game");
    assert.equal(game.required, true);
    assert.equal(game.choices?.length, getGameIds().length);
  });

  it("required options should precede optional ones", () => {
    let seenOptional = false;
    for (const option of options) {
      if (!option.required) {
        seenOptional = true;
      } else {
        assert.equal(
          seenOptional,
          false,
          `required option ${option.name} appears after an optional one`,
        );
      }
    }
  });
});

describe("wrong-game lookup helpers", () => {
  // Only the rosters matter for the lookup, so a minimal stub is enough
  function stubGame(
    characterIds: string[],
    backgroundIds: string[],
  ): GameDefinition {
    return {
      characters: Object.fromEntries(characterIds.map((id) => [id, {}])),
      backgrounds: Object.fromEntries(backgroundIds.map((id) => [id, {}])),
    } as unknown as GameDefinition;
  }

  const registry = {
    alpha: stubGame(["shared", "alpha_only"], ["bg_shared", "bg_alpha"]),
    beta: stubGame(["shared", "beta_only"], ["bg_shared"]),
    gamma: stubGame(["shared"], ["bg_gamma"]),
  };

  it("should find the single other game containing a character", () => {
    assert.deepEqual(findOtherGamesWithCharacter(registry, "beta_only", "alpha"), [
      "beta",
    ]);
  });

  it("should list every other game sharing a character ID", () => {
    assert.deepEqual(findOtherGamesWithCharacter(registry, "shared", "alpha"), [
      "beta",
      "gamma",
    ]);
  });

  it("should exclude the selected game and return [] for unknown IDs", () => {
    assert.deepEqual(
      findOtherGamesWithCharacter(registry, "alpha_only", "alpha"),
      [],
    );
    assert.deepEqual(findOtherGamesWithCharacter(registry, "missing", "alpha"), []);
  });

  it("should apply the same rules to backgrounds", () => {
    assert.deepEqual(findOtherGamesWithBackground(registry, "bg_shared", "gamma"), [
      "alpha",
      "beta",
    ]);
    assert.deepEqual(findOtherGamesWithBackground(registry, "bg_alpha", "beta"), [
      "alpha",
    ]);
    assert.deepEqual(findOtherGamesWithBackground(registry, "bg_alpha", "alpha"), []);
    assert.deepEqual(findOtherGamesWithBackground(registry, "missing", "alpha"), []);
  });
});

describe("dialogue messages", () => {
  const REQUIRED_LOCALES = [
    Locale.EnglishUS,
    Locale.EnglishGB,
    Locale.ChineseTW,
    Locale.ChineseCN,
    Locale.Japanese,
  ];

  it("every message should cover all supported locales", () => {
    for (const [key, record] of Object.entries(DIALOGUE_MESSAGES)) {
      for (const locale of REQUIRED_LOCALES) {
        const text = (record as Record<string, string>)[locale];
        assert.ok(text && text.length > 0, `${key} is missing locale ${locale}`);
      }
    }
  });

  it("every locale should use the same placeholders as EnglishUS", () => {
    const placeholders = (text: string): string[] =>
      [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
    for (const [key, record] of Object.entries(DIALOGUE_MESSAGES)) {
      const reference = placeholders(
        (record as Record<string, string>)[Locale.EnglishUS],
      );
      for (const locale of REQUIRED_LOCALES) {
        assert.deepEqual(
          placeholders((record as Record<string, string>)[locale]),
          reference,
          `${key} placeholder mismatch in locale ${locale}`,
        );
      }
    }
  });
});
