/**
 * Font Configuration Tests
 * Tests for font definitions and path utilities
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "fs";
import path from "path";

import { FONTS, FontId, getFontPath } from "../../src/config/fonts.js";

describe("fonts config", () => {
  describe("FONTS constant", () => {
    it("should have miSans font defined", () => {
      assert.ok(FONTS.miSans, "miSans should be defined");
      assert.equal(FONTS.miSans.name, "MiSans Bold");
      assert.equal(FONTS.miSans.file, "MiSans-Bold.ttf");
    });

    it("should have notoSansTCBlack font defined", () => {
      assert.ok(FONTS.notoSansTCBlack, "notoSansTCBlack should be defined");
      assert.equal(FONTS.notoSansTCBlack.name, "Noto Sans TC Black");
      assert.ok(FONTS.notoSansTCBlack.file.endsWith(".otf"));
    });

    it("should have notoSansKRBlack font defined", () => {
      assert.ok(FONTS.notoSansKRBlack, "notoSansKRBlack should be defined");
      assert.equal(FONTS.notoSansKRBlack.name, "Noto Sans KR Black");
    });

    it("should have notoSansThaiBlack font defined", () => {
      assert.ok(FONTS.notoSansThaiBlack, "notoSansThaiBlack should be defined");
      assert.equal(FONTS.notoSansThaiBlack.name, "Noto Sans Thai Black");
    });

    it("should have tsukuMinPr6N font defined", () => {
      assert.ok(FONTS.tsukuMinPr6N, "tsukuMinPr6N should be defined");
      assert.equal(FONTS.tsukuMinPr6N.name, "TsukuMin Pr6N");
    });

    it("should have notoSerifTCSemiBold font defined", () => {
      assert.ok(FONTS.notoSerifTCSemiBold, "notoSerifTCSemiBold should be defined");
      assert.equal(FONTS.notoSerifTCSemiBold.name, "Noto Serif TC SemiBold");
    });

    it("should have notoSerifKRSemiBold font defined", () => {
      assert.ok(FONTS.notoSerifKRSemiBold, "notoSerifKRSemiBold should be defined");
      assert.equal(FONTS.notoSerifKRSemiBold.name, "Noto Serif KR SemiBold");
    });

    it("should have notoSerifThaiSemiBold font defined", () => {
      assert.ok(FONTS.notoSerifThaiSemiBold, "notoSerifThaiSemiBold should be defined");
      assert.equal(FONTS.notoSerifThaiSemiBold.name, "Noto Serif Thai SemiBold");
    });

    it("should have 8 fonts defined", () => {
      const fontCount = Object.keys(FONTS).length;
      assert.equal(fontCount, 8, "Should have exactly 8 fonts");
    });

    it("all fonts should have name and file properties", () => {
      for (const [id, font] of Object.entries(FONTS)) {
        assert.ok(font.name, `Font ${id} should have a name`);
        assert.ok(font.file, `Font ${id} should have a file`);
        assert.ok(
          font.file.endsWith(".ttf") || font.file.endsWith(".otf"),
          `Font ${id} file should be .ttf or .otf`
        );
      }
    });
  });

  describe("getFontPath", () => {
    it("should return a path string", () => {
      const fontPath = getFontPath("miSans");
      assert.equal(typeof fontPath, "string");
      assert.ok(fontPath.length > 0);
    });

    it("should include the font file name", () => {
      const fontPath = getFontPath("miSans");
      assert.ok(fontPath.includes("MiSans-Bold.ttf"));
    });

    it("should include fonts directory", () => {
      const fontPath = getFontPath("miSans");
      assert.ok(fontPath.includes("fonts"));
    });

    it("should return correct path for each font", () => {
      const fontIds: FontId[] = [
        "miSans",
        "notoSansTCBlack",
        "notoSansKRBlack",
        "notoSansThaiBlack",
        "tsukuMinPr6N",
        "notoSerifTCSemiBold",
        "notoSerifKRSemiBold",
        "notoSerifThaiSemiBold",
      ];

      for (const fontId of fontIds) {
        const fontPath = getFontPath(fontId);
        const font = FONTS[fontId];
        assert.ok(
          fontPath.includes(font.file),
          `Path for ${fontId} should include ${font.file}`
        );
      }
    });

    it("should return absolute-looking path", () => {
      const fontPath = getFontPath("miSans");
      // Path should look like it goes to assets/fonts/
      assert.ok(fontPath.includes(path.join("assets", "fonts")));
    });
  });

  describe("FontId type", () => {
    it("should allow valid font IDs", () => {
      const validIds: FontId[] = [
        "miSans",
        "notoSansTCBlack",
        "notoSansKRBlack",
        "notoSansThaiBlack",
        "tsukuMinPr6N",
        "notoSerifTCSemiBold",
        "notoSerifKRSemiBold",
        "notoSerifThaiSemiBold",
      ];

      // This just verifies the IDs are valid at compile time
      for (const id of validIds) {
        assert.ok(id in FONTS, `${id} should be a valid font ID`);
      }
    });
  });
});
