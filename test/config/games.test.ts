/**
 * Game Registry Tests
 * Per-game invariants that keep adding a new game a mechanical step:
 * every registered game must have consistent data, complete localization
 * tables, and all referenced asset files present on disk.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { Locale } from "discord.js";

import {
  GAMES,
  DEFAULT_GAME_ID,
  getGame,
  getGameStrict,
  getGameIds,
  isGameId,
} from "../../src/config/games/index.js";
import {
  getCharacterImagePath,
  getBackgroundImagePath,
  getDialogueOverlayPath,
} from "../../src/config/games/paths.js";
import { FONTS } from "../../src/config/fonts.js";

describe("game registry", () => {
  it("should contain manosaba", () => {
    assert.ok(isGameId("manosaba"));
    assert.ok(getGameIds().includes("manosaba"));
  });

  it("default game should be registered", () => {
    assert.ok(isGameId(DEFAULT_GAME_ID));
  });

  it("getGame should fall back to the default game", () => {
    assert.equal(getGame(null).id, DEFAULT_GAME_ID);
    assert.equal(getGame(undefined).id, DEFAULT_GAME_ID);
    assert.equal(getGame("not-a-game").id, DEFAULT_GAME_ID);
    assert.equal(getGame("manosaba").id, "manosaba");
  });

  it("getGameStrict should return undefined for unknown ids", () => {
    assert.equal(getGameStrict("not-a-game"), undefined);
    assert.equal(getGameStrict("manosaba")?.id, "manosaba");
  });

  for (const [gameId, game] of Object.entries(GAMES)) {
    describe(`game "${gameId}" invariants`, () => {
      it("id should match its registry key", () => {
        assert.equal(game.id, gameId);
      });

      it("should have at least one character and one background", () => {
        assert.ok(Object.keys(game.characters).length > 0);
        assert.ok(Object.keys(game.backgrounds).length > 0);
      });

      it("character ids should match their keys", () => {
        for (const [id, info] of Object.entries(game.characters)) {
          assert.equal(info.id, id, `character key ${id} should match info.id`);
        }
      });

      it("defaultBackgroundId should be a registered background", () => {
        assert.ok(
          game.backgrounds[game.defaultBackgroundId],
          `default background ${game.defaultBackgroundId} should exist`,
        );
      });

      it("fallbackNameLocale should be in supportedNameLocales", () => {
        assert.ok(game.supportedNameLocales.includes(game.fallbackNameLocale));
      });

      it("all fonts should be valid font IDs", () => {
        assert.ok(game.fonts.textDefaultFont in FONTS);
        assert.ok(game.fonts.nameFallbackFont in FONTS);
        for (const fontId of game.fonts.textFallbackFonts) {
          assert.ok(fontId in FONTS, `${fontId} should be a valid font ID`);
        }
        for (const fontId of Object.values(game.fonts.nameLocaleFonts)) {
          assert.ok(fontId in FONTS, `${fontId} should be a valid font ID`);
        }
      });

      it("every character should have a name localization", () => {
        for (const id of Object.keys(game.characters)) {
          assert.ok(
            game.localizations.characterNames[id],
            `character ${id} should have a name localization`,
          );
        }
      });

      it("every background should have a name localization", () => {
        for (const id of Object.keys(game.backgrounds)) {
          assert.ok(
            game.localizations.backgroundNames[id],
            `background ${id} should have a name localization`,
          );
        }
      });

      it("every expression should have a name localization", () => {
        for (const [charId, info] of Object.entries(game.characters)) {
          for (const expressionId of info.expressions) {
            assert.ok(
              game.localizations.expressionNames[expressionId],
              `expression ${expressionId} of ${charId} should have a name localization`,
            );
          }
        }
      });

      it("game name should have an English localization", () => {
        assert.ok(game.localizations.gameName[Locale.EnglishUS]);
      });

      it("every character sprite file should exist on disk", () => {
        for (const [charId, info] of Object.entries(game.characters)) {
          for (let n = 1; n <= info.expressions.length; n++) {
            const path = getCharacterImagePath(game.id, charId, n);
            assert.ok(
              existsSync(path),
              `sprite ${path} should exist for ${charId} expression ${n}`,
            );
          }
        }
      });

      it("every background file should exist on disk", () => {
        for (const id of Object.keys(game.backgrounds)) {
          const path = getBackgroundImagePath(game, id);
          assert.ok(existsSync(path), `background ${path} should exist`);
        }
      });

      it("the overlay file should exist on disk", () => {
        const path = getDialogueOverlayPath(game);
        assert.ok(existsSync(path), `overlay ${path} should exist`);
      });
    });
  }
});
