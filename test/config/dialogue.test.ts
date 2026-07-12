/**
 * Dialogue Configuration Tests
 * Tests for stretch modes, game-scoped characters/backgrounds helpers,
 * and game-aware asset paths (exercised against the Manosaba game)
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { STRETCH_MODES } from "../../src/config/dialogue/index.js";
import { GAMES } from "../../src/config/games/index.js";
import {
  getCharacter,
  getCharacterIds,
  getBackgroundIds,
  getExpressionNumber,
  getExpressionNames,
  getNameConfig,
  getCharacterNameFontForLocale,
} from "../../src/config/games/helpers.js";
import {
  getGameAssetPath,
  getCharacterImagePath,
  getBackgroundImagePath,
  getDialogueFontPath,
  getDialogueOverlayPath,
} from "../../src/config/games/paths.js";
import { Locale } from "discord.js";
import { FONTS } from "../../src/config/fonts.js";

const manosaba = GAMES.manosaba;

describe("dialogue config", () => {
  describe("STRETCH_MODES", () => {
    it("should have stretch mode", () => {
      assert.ok(STRETCH_MODES.stretch);
      assert.equal(STRETCH_MODES.stretch, "Stretch to fill");
    });

    it("should have stretch_x mode", () => {
      assert.ok(STRETCH_MODES.stretch_x);
      assert.equal(STRETCH_MODES.stretch_x, "Stretch horizontally");
    });

    it("should have stretch_y mode", () => {
      assert.ok(STRETCH_MODES.stretch_y);
      assert.equal(STRETCH_MODES.stretch_y, "Stretch vertically");
    });

    it("should have zoom_x mode", () => {
      assert.ok(STRETCH_MODES.zoom_x);
      assert.equal(STRETCH_MODES.zoom_x, "Zoom horizontally (keep ratio)");
    });

    it("should have zoom_y mode", () => {
      assert.ok(STRETCH_MODES.zoom_y);
      assert.equal(STRETCH_MODES.zoom_y, "Zoom vertically (keep ratio)");
    });

    it("should have original mode", () => {
      assert.ok(STRETCH_MODES.original);
      assert.equal(STRETCH_MODES.original, "Original size (centered)");
    });

    it("should have 6 modes", () => {
      const modeCount = Object.keys(STRETCH_MODES).length;
      assert.equal(modeCount, 6, "Should have exactly 6 stretch modes");
    });
  });

  describe("backgrounds", () => {
    it("should have backgrounds defined", () => {
      const backgroundCount = Object.keys(manosaba.backgrounds).length;
      assert.ok(backgroundCount > 0, "Should have backgrounds defined");
    });

    it("should have bg_001_001 as default", () => {
      assert.equal(manosaba.defaultBackgroundId, "bg_001_001");
      assert.equal(
        manosaba.backgrounds.bg_001_001,
        "Background_001_001.webp",
      );
    });

    it("all backgrounds should be WebP files", () => {
      for (const [id, filename] of Object.entries(manosaba.backgrounds)) {
        assert.ok(
          filename.endsWith(".webp"),
          `Background ${id} should be WebP file`,
        );
      }
    });

    it("all background IDs should follow naming convention", () => {
      for (const id of Object.keys(manosaba.backgrounds)) {
        assert.ok(
          id.startsWith("bg_"),
          `Background ID ${id} should start with 'bg_'`,
        );
      }
    });
  });

  describe("getBackgroundIds", () => {
    it("should return an array", () => {
      const ids = getBackgroundIds(manosaba);
      assert.ok(Array.isArray(ids));
    });

    it("should return all background IDs", () => {
      const ids = getBackgroundIds(manosaba);
      const expectedCount = Object.keys(manosaba.backgrounds).length;
      assert.equal(ids.length, expectedCount);
    });

    it("should include bg_001_001", () => {
      const ids = getBackgroundIds(manosaba);
      assert.ok(ids.includes("bg_001_001"));
    });
  });

  describe("getCharacter", () => {
    it("should return ema character", () => {
      const ema = getCharacter(manosaba, "ema");
      assert.ok(ema, "Should return ema character");
      assert.equal(ema!.id, "ema");
    });

    it("should return hiro character", () => {
      const hiro = getCharacter(manosaba, "hiro");
      assert.ok(hiro, "Should return hiro character");
      assert.equal(hiro!.id, "hiro");
    });

    it("should return anan character", () => {
      const anan = getCharacter(manosaba, "anan");
      assert.ok(anan, "Should return anan character");
      assert.equal(anan!.id, "anan");
    });

    it("should return undefined for unknown character", () => {
      const unknown = getCharacter(manosaba, "unknown");
      assert.equal(unknown, undefined);
    });

    it("characters should have expressions array", () => {
      const ema = getCharacter(manosaba, "ema");
      assert.ok(ema, "ema should exist");
      assert.ok(
        Array.isArray(ema!.expressions),
        "Should have expressions array",
      );
      assert.ok(
        ema!.expressions.length > 0,
        "Should have at least one expression",
      );
    });

    it("characters should have themeColor", () => {
      const ema = getCharacter(manosaba, "ema");
      assert.ok(ema, "ema should exist");
      assert.ok(ema!.themeColor, "Should have themeColor");
      assert.equal(typeof ema!.themeColor.r, "number");
      assert.equal(typeof ema!.themeColor.g, "number");
      assert.equal(typeof ema!.themeColor.b, "number");
    });

    it("characters should have nameConfig", () => {
      const ema = getCharacter(manosaba, "ema");
      assert.ok(ema, "ema should exist");
      assert.ok(ema!.nameConfig, "Should have nameConfig");
    });
  });

  describe("getCharacterIds", () => {
    it("should return an array", () => {
      const ids = getCharacterIds(manosaba);
      assert.ok(Array.isArray(ids));
    });

    it("should include known characters", () => {
      const ids = getCharacterIds(manosaba);
      assert.ok(ids.includes("ema"), "Should include ema");
      assert.ok(ids.includes("hiro"), "Should include hiro");
      assert.ok(ids.includes("anan"), "Should include anan");
      assert.ok(ids.includes("yuki"), "Should include yuki");
    });

    it("should have multiple characters", () => {
      const ids = getCharacterIds(manosaba);
      assert.ok(ids.length >= 10, "Should have at least 10 characters");
    });
  });

  describe("fallbackNameLocale", () => {
    it("should be defined", () => {
      assert.ok(manosaba.fallbackNameLocale, "Should have fallback locale");
    });

    it("should be Japanese locale", () => {
      assert.equal(manosaba.fallbackNameLocale, "ja");
    });
  });

  describe("getExpressionNumber", () => {
    it("should return 1-based index for first expression", () => {
      const ema = getCharacter(manosaba, "ema");
      assert.ok(ema, "ema should exist");
      const expressionNum = getExpressionNumber(ema!, ema!.expressions[0]);
      assert.equal(expressionNum, 1);
    });

    it("should return correct index for other expressions", () => {
      const ema = getCharacter(manosaba, "ema");
      assert.ok(ema, "ema should exist");
      // Second expression should be 2
      const expressionNum = getExpressionNumber(ema!, ema!.expressions[1]);
      assert.equal(expressionNum, 2);
    });

    it("should return undefined for unknown expression", () => {
      const ema = getCharacter(manosaba, "ema");
      assert.ok(ema, "ema should exist");
      const expressionNum = getExpressionNumber(ema!, "nonexistent_expression");
      assert.equal(expressionNum, undefined);
    });

    it("should work for different characters", () => {
      const hiro = getCharacter(manosaba, "hiro");
      assert.ok(hiro, "hiro should exist");
      const expressionNum = getExpressionNumber(hiro!, hiro!.expressions[0]);
      assert.equal(expressionNum, 1);
    });
  });

  describe("getExpressionNames", () => {
    it("should return array of expression names", () => {
      const ema = getCharacter(manosaba, "ema");
      assert.ok(ema, "ema should exist");
      const names = getExpressionNames(ema!);
      assert.ok(Array.isArray(names));
      assert.ok(names.length > 0);
    });

    it("should return same expressions as character.expressions", () => {
      const ema = getCharacter(manosaba, "ema");
      assert.ok(ema, "ema should exist");
      const names = getExpressionNames(ema!);
      assert.deepEqual(names, ema!.expressions);
    });

    it("should work for different characters", () => {
      const yuki = getCharacter(manosaba, "yuki");
      assert.ok(yuki, "yuki should exist");
      const names = getExpressionNames(yuki!);
      assert.ok(Array.isArray(names));
      assert.deepEqual(names, yuki!.expressions);
    });
  });

  describe("getNameConfig", () => {
    it("should return name config for Japanese locale", () => {
      const ema = getCharacter(manosaba, "ema");
      assert.ok(ema, "ema should exist");
      const config = getNameConfig(manosaba, ema!, Locale.Japanese);
      assert.ok(Array.isArray(config));
      assert.ok(config.length > 0, "Should have name config entries");
    });

    it("should return name config for Chinese CN locale", () => {
      const ema = getCharacter(manosaba, "ema");
      assert.ok(ema, "ema should exist");
      const config = getNameConfig(manosaba, ema!, Locale.ChineseCN);
      assert.ok(Array.isArray(config));
      assert.ok(config.length > 0, "Should have name config entries");
    });

    it("should return name config for Chinese TW locale", () => {
      const ema = getCharacter(manosaba, "ema");
      assert.ok(ema, "ema should exist");
      const config = getNameConfig(manosaba, ema!, Locale.ChineseTW);
      assert.ok(Array.isArray(config));
      assert.ok(config.length > 0, "Should have name config entries");
    });

    it("should fallback to Japanese for unsupported locales", () => {
      const ema = getCharacter(manosaba, "ema");
      assert.ok(ema, "ema should exist");
      // Use a locale that is not configured for characters
      const config = getNameConfig(manosaba, ema!, Locale.EnglishUS);
      const japaneseConfig = getNameConfig(manosaba, ema!, Locale.Japanese);
      // Should fallback to Japanese
      assert.deepEqual(config, japaneseConfig);
    });

    it("name config entries should have required properties", () => {
      const ema = getCharacter(manosaba, "ema");
      assert.ok(ema, "ema should exist");
      const config = getNameConfig(manosaba, ema!, Locale.Japanese);
      for (const entry of config) {
        assert.equal(typeof entry.text, "string", "Should have text");
        assert.ok(entry.position, "Should have position");
        assert.equal(
          typeof entry.position.x,
          "number",
          "Position should have x",
        );
        assert.equal(
          typeof entry.position.y,
          "number",
          "Position should have y",
        );
        assert.ok(entry.fontColor, "Should have fontColor");
        assert.equal(
          typeof entry.fontColor.r,
          "number",
          "fontColor should have r",
        );
        assert.equal(
          typeof entry.fontColor.g,
          "number",
          "fontColor should have g",
        );
        assert.equal(
          typeof entry.fontColor.b,
          "number",
          "fontColor should have b",
        );
        assert.equal(typeof entry.fontSize, "number", "Should have fontSize");
      }
    });

    it("should work for different characters", () => {
      const hiro = getCharacter(manosaba, "hiro");
      assert.ok(hiro, "hiro should exist");
      const config = getNameConfig(manosaba, hiro!, Locale.Japanese);
      assert.ok(Array.isArray(config));
      assert.ok(config.length > 0);
    });
  });

  describe("layout", () => {
    it("should have canvas dimensions", () => {
      assert.equal(typeof manosaba.layout.canvasWidth, "number");
      assert.equal(typeof manosaba.layout.canvasHeight, "number");
      assert.ok(manosaba.layout.canvasWidth > 0);
      assert.ok(manosaba.layout.canvasHeight > 0);
    });

    it("should have character position", () => {
      assert.ok(manosaba.layout.characterPosition);
      assert.equal(typeof manosaba.layout.characterPosition.x, "number");
      assert.equal(typeof manosaba.layout.characterPosition.y, "number");
    });

    it("should have text position", () => {
      assert.ok(manosaba.layout.textPosition);
      assert.equal(typeof manosaba.layout.textPosition.x, "number");
      assert.equal(typeof manosaba.layout.textPosition.y, "number");
    });

    it("should have textAreaEnd", () => {
      assert.ok(manosaba.layout.textAreaEnd);
      assert.ok(
        manosaba.layout.textAreaEnd.x > manosaba.layout.textPosition.x,
        "Text area end X should be greater than start",
      );
      assert.ok(
        manosaba.layout.textAreaEnd.y > manosaba.layout.textPosition.y,
        "Text area end Y should be greater than start",
      );
    });

    it("should have defaultFontSize", () => {
      assert.equal(typeof manosaba.layout.defaultFontSize, "number");
      assert.ok(manosaba.layout.defaultFontSize > 0);
    });

    it("should have lineHeightMultiplier", () => {
      assert.equal(typeof manosaba.layout.lineHeightMultiplier, "number");
      assert.ok(manosaba.layout.lineHeightMultiplier > 0);
    });

    it("should have shadowOffset", () => {
      assert.ok(manosaba.layout.shadowOffset);
      assert.equal(typeof manosaba.layout.shadowOffset.x, "number");
      assert.equal(typeof manosaba.layout.shadowOffset.y, "number");
    });

    it("should have shadowColor", () => {
      assert.ok(manosaba.layout.shadowColor);
      assert.equal(typeof manosaba.layout.shadowColor.r, "number");
      assert.equal(typeof manosaba.layout.shadowColor.g, "number");
      assert.equal(typeof manosaba.layout.shadowColor.b, "number");
    });

    it("should have defaultTextColor", () => {
      assert.ok(manosaba.layout.defaultTextColor);
      assert.equal(typeof manosaba.layout.defaultTextColor.r, "number");
      assert.equal(typeof manosaba.layout.defaultTextColor.g, "number");
      assert.equal(typeof manosaba.layout.defaultTextColor.b, "number");
    });
  });

  describe("fonts.textDefaultFont", () => {
    it("should be tsukuMinPr6N", () => {
      assert.equal(manosaba.fonts.textDefaultFont, "tsukuMinPr6N");
    });

    it("should be a valid font ID", () => {
      assert.ok(
        manosaba.fonts.textDefaultFont in FONTS,
        "Default font should exist in FONTS",
      );
    });
  });

  describe("fonts.textFallbackFonts", () => {
    it("should be an array", () => {
      assert.ok(Array.isArray(manosaba.fonts.textFallbackFonts));
    });

    it("all fallback fonts should be valid font IDs", () => {
      for (const fontId of manosaba.fonts.textFallbackFonts) {
        assert.ok(fontId in FONTS, `${fontId} should be a valid font ID`);
      }
    });

    it("should include default font", () => {
      assert.ok(
        manosaba.fonts.textFallbackFonts.includes(
          manosaba.fonts.textDefaultFont,
        ),
      );
    });
  });

  describe("fonts.nameLocaleFonts", () => {
    it("should be an object", () => {
      assert.ok(typeof manosaba.fonts.nameLocaleFonts === "object");
    });

    it("all locale fonts should be valid font IDs", () => {
      for (const [locale, fontId] of Object.entries(
        manosaba.fonts.nameLocaleFonts,
      )) {
        if (fontId) {
          assert.ok(fontId in FONTS, `${fontId} for ${locale} should be valid`);
        }
      }
    });

    it("should fall back to nameFallbackFont for unmapped locales", () => {
      assert.equal(
        getCharacterNameFontForLocale(manosaba, Locale.EnglishUS),
        manosaba.fonts.nameFallbackFont,
      );
    });
  });

  describe("getGameAssetPath", () => {
    it("should return path for characters", () => {
      const path = getGameAssetPath("manosaba", "characters", "ema", "ema_1.webp");
      assert.ok(path.includes("games"));
      assert.ok(path.includes("manosaba"));
      assert.ok(path.includes("dialogue"));
      assert.ok(path.includes("characters"));
      assert.ok(path.includes("ema"));
      assert.ok(path.includes("ema_1.webp"));
    });

    it("should return path for backgrounds", () => {
      const path = getGameAssetPath("manosaba", "backgrounds", "test.webp");
      assert.ok(path.includes("manosaba"));
      assert.ok(path.includes("backgrounds"));
      assert.ok(path.includes("test.webp"));
    });

    it("should return path for ui", () => {
      const path = getGameAssetPath("manosaba", "ui", "overlay.webp");
      assert.ok(path.includes("manosaba"));
      assert.ok(path.includes("ui"));
      assert.ok(path.includes("overlay.webp"));
    });
  });

  describe("getCharacterImagePath", () => {
    it("should return correct path format", () => {
      const path = getCharacterImagePath("manosaba", "ema", 1);
      assert.ok(path.includes("manosaba"));
      assert.ok(path.includes("characters"));
      assert.ok(path.includes("ema"));
      assert.ok(path.includes("ema_1.webp"));
    });

    it("should handle different expression numbers", () => {
      const path1 = getCharacterImagePath("manosaba", "ema", 1);
      const path2 = getCharacterImagePath("manosaba", "ema", 2);
      assert.ok(path1.includes("ema_1.webp"));
      assert.ok(path2.includes("ema_2.webp"));
    });
  });

  describe("getBackgroundImagePath", () => {
    it("should return path for valid background", () => {
      const path = getBackgroundImagePath(manosaba, "bg_001_001");
      assert.ok(path.includes("manosaba"));
      assert.ok(path.includes("backgrounds"));
      assert.ok(path.includes("Background_001_001.webp"));
    });

    it("should throw for unknown background", () => {
      assert.throws(
        () => getBackgroundImagePath(manosaba, "nonexistent"),
        /Unknown background ID/,
      );
    });
  });

  describe("getDialogueFontPath", () => {
    it("should return font path", () => {
      const path = getDialogueFontPath("tsukuMinPr6N");
      assert.ok(path.includes("fonts"));
      assert.ok(path.includes(FONTS.tsukuMinPr6N.file));
    });
  });

  describe("getDialogueOverlayPath", () => {
    it("should return overlay path", () => {
      const path = getDialogueOverlayPath(manosaba);
      assert.ok(path.includes("manosaba"));
      assert.ok(path.includes("ui"));
      assert.ok(path.includes("overlay.webp"));
    });
  });
});
