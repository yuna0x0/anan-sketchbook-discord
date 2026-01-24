/**
 * Sketchbook Configuration Tests
 * Tests for emotion types, config values, and asset path utilities
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "path";

import {
  EmotionType,
  ExpressionOption,
  EMOTION_IMAGE_MAP,
  getRandomEmotion,
  SKETCHBOOK_DEFAULT_FONT,
  SKETCHBOOK_FALLBACK_FONTS,
  SKETCHBOOK_CONFIG,
  getSketchbookAssetPath,
  getEmotionImagePath,
  getSketchbookFontPath,
  getSketchbookFallbackFontPaths,
  EmotionTypeValue,
} from "../../src/config/sketchbook/index.js";
import { FONTS } from "../../src/config/fonts.js";

describe("sketchbook config", () => {
  describe("EmotionType", () => {
    it("should have normal emotion", () => {
      assert.equal(EmotionType.NORMAL, "normal");
    });

    it("should have happy emotion", () => {
      assert.equal(EmotionType.HAPPY, "happy");
    });

    it("should have angry emotion", () => {
      assert.equal(EmotionType.ANGRY, "angry");
    });

    it("should have speechless emotion", () => {
      assert.equal(EmotionType.SPEECHLESS, "speechless");
    });

    it("should have blush emotion", () => {
      assert.equal(EmotionType.BLUSH, "blush");
    });

    it("should have yandere emotion", () => {
      assert.equal(EmotionType.YANDERE, "yandere");
    });

    it("should have closed_eyes emotion", () => {
      assert.equal(EmotionType.CLOSED_EYES, "closed_eyes");
    });

    it("should have sad emotion", () => {
      assert.equal(EmotionType.SAD, "sad");
    });

    it("should have scared emotion", () => {
      assert.equal(EmotionType.SCARED, "scared");
    });

    it("should have excited emotion", () => {
      assert.equal(EmotionType.EXCITED, "excited");
    });

    it("should have surprised emotion", () => {
      assert.equal(EmotionType.SURPRISED, "surprised");
    });

    it("should have crying emotion", () => {
      assert.equal(EmotionType.CRYING, "crying");
    });

    it("should have 12 emotions", () => {
      const emotionCount = Object.keys(EmotionType).length;
      assert.equal(emotionCount, 12, "Should have exactly 12 emotions");
    });
  });

  describe("ExpressionOption", () => {
    it("should include all EmotionType values", () => {
      for (const [key, value] of Object.entries(EmotionType)) {
        assert.equal(
          (ExpressionOption as Record<string, string>)[key],
          value,
          `ExpressionOption should include ${key}`
        );
      }
    });

    it("should have RANDOM option", () => {
      assert.equal(ExpressionOption.RANDOM, "random");
    });

    it("should have 13 options (12 emotions + random)", () => {
      const optionCount = Object.keys(ExpressionOption).length;
      assert.equal(optionCount, 13, "Should have 13 options");
    });
  });

  describe("EMOTION_IMAGE_MAP", () => {
    it("should map all emotions to image files", () => {
      const emotions = Object.values(EmotionType);
      for (const emotion of emotions) {
        assert.ok(
          EMOTION_IMAGE_MAP[emotion],
          `Should have mapping for ${emotion}`
        );
        assert.ok(
          EMOTION_IMAGE_MAP[emotion].endsWith(".png"),
          `Image for ${emotion} should be PNG`
        );
      }
    });

    it("should map normal to base.png", () => {
      assert.equal(EMOTION_IMAGE_MAP.normal, "base.png");
    });

    it("should map happy to happy.png", () => {
      assert.equal(EMOTION_IMAGE_MAP.happy, "happy.png");
    });

    it("should map angry to angry.png", () => {
      assert.equal(EMOTION_IMAGE_MAP.angry, "angry.png");
    });

    it("should have 12 mappings", () => {
      const mappingCount = Object.keys(EMOTION_IMAGE_MAP).length;
      assert.equal(mappingCount, 12, "Should have 12 mappings");
    });
  });

  describe("getRandomEmotion", () => {
    it("should return a valid emotion", () => {
      const emotion = getRandomEmotion();
      const validEmotions = Object.values(EmotionType);
      assert.ok(
        validEmotions.includes(emotion),
        `${emotion} should be a valid emotion`
      );
    });

    it("should return different emotions over multiple calls (probabilistic)", () => {
      const results = new Set<EmotionTypeValue>();
      // Call many times to increase chance of getting different results
      for (let i = 0; i < 100; i++) {
        results.add(getRandomEmotion());
      }
      // Should get at least 2 different emotions in 100 tries
      assert.ok(
        results.size >= 2,
        "Should return various emotions over many calls"
      );
    });
  });

  describe("SKETCHBOOK_DEFAULT_FONT", () => {
    it("should be miSans", () => {
      assert.equal(SKETCHBOOK_DEFAULT_FONT, "miSans");
    });

    it("should be a valid font ID", () => {
      assert.ok(
        SKETCHBOOK_DEFAULT_FONT in FONTS,
        "Default font should exist in FONTS"
      );
    });
  });

  describe("SKETCHBOOK_FALLBACK_FONTS", () => {
    it("should be an array", () => {
      assert.ok(Array.isArray(SKETCHBOOK_FALLBACK_FONTS));
    });

    it("should include miSans", () => {
      assert.ok(SKETCHBOOK_FALLBACK_FONTS.includes("miSans"));
    });

    it("should include notoSansTCBlack", () => {
      assert.ok(SKETCHBOOK_FALLBACK_FONTS.includes("notoSansTCBlack"));
    });

    it("should include notoSansKRBlack", () => {
      assert.ok(SKETCHBOOK_FALLBACK_FONTS.includes("notoSansKRBlack"));
    });

    it("should include notoSansThaiBlack", () => {
      assert.ok(SKETCHBOOK_FALLBACK_FONTS.includes("notoSansThaiBlack"));
    });

    it("all fallback fonts should be valid font IDs", () => {
      for (const fontId of SKETCHBOOK_FALLBACK_FONTS) {
        assert.ok(fontId in FONTS, `${fontId} should be a valid font ID`);
      }
    });
  });

  describe("SKETCHBOOK_CONFIG", () => {
    it("should have textBoxTopLeft coordinates", () => {
      assert.ok(SKETCHBOOK_CONFIG.textBoxTopLeft);
      assert.equal(typeof SKETCHBOOK_CONFIG.textBoxTopLeft.x, "number");
      assert.equal(typeof SKETCHBOOK_CONFIG.textBoxTopLeft.y, "number");
    });

    it("should have textBoxBottomRight coordinates", () => {
      assert.ok(SKETCHBOOK_CONFIG.textBoxBottomRight);
      assert.equal(typeof SKETCHBOOK_CONFIG.textBoxBottomRight.x, "number");
      assert.equal(typeof SKETCHBOOK_CONFIG.textBoxBottomRight.y, "number");
    });

    it("textBoxBottomRight should be greater than textBoxTopLeft", () => {
      assert.ok(
        SKETCHBOOK_CONFIG.textBoxBottomRight.x >
          SKETCHBOOK_CONFIG.textBoxTopLeft.x,
        "Bottom right X should be greater than top left X"
      );
      assert.ok(
        SKETCHBOOK_CONFIG.textBoxBottomRight.y >
          SKETCHBOOK_CONFIG.textBoxTopLeft.y,
        "Bottom right Y should be greater than top left Y"
      );
    });

    it("should have maxFontHeight", () => {
      assert.equal(typeof SKETCHBOOK_CONFIG.maxFontHeight, "number");
      assert.ok(
        SKETCHBOOK_CONFIG.maxFontHeight > 0,
        "Max font height should be positive"
      );
    });

    it("should have lineSpacing", () => {
      assert.equal(typeof SKETCHBOOK_CONFIG.lineSpacing, "number");
      assert.ok(
        SKETCHBOOK_CONFIG.lineSpacing >= 0,
        "Line spacing should be non-negative"
      );
    });

    it("should have defaultTextColor", () => {
      assert.ok(SKETCHBOOK_CONFIG.defaultTextColor);
      assert.equal(typeof SKETCHBOOK_CONFIG.defaultTextColor.r, "number");
      assert.equal(typeof SKETCHBOOK_CONFIG.defaultTextColor.g, "number");
      assert.equal(typeof SKETCHBOOK_CONFIG.defaultTextColor.b, "number");
    });

    it("should have bracketTextColor", () => {
      assert.ok(SKETCHBOOK_CONFIG.bracketTextColor);
      assert.equal(typeof SKETCHBOOK_CONFIG.bracketTextColor.r, "number");
      assert.equal(typeof SKETCHBOOK_CONFIG.bracketTextColor.g, "number");
      assert.equal(typeof SKETCHBOOK_CONFIG.bracketTextColor.b, "number");
    });

    it("should have overlayImage", () => {
      assert.equal(typeof SKETCHBOOK_CONFIG.overlayImage, "string");
      assert.ok(SKETCHBOOK_CONFIG.overlayImage.endsWith(".png"));
    });

    it("should have imagePadding", () => {
      assert.equal(typeof SKETCHBOOK_CONFIG.imagePadding, "number");
      assert.ok(
        SKETCHBOOK_CONFIG.imagePadding >= 0,
        "Image padding should be non-negative"
      );
    });
  });

  describe("getSketchbookAssetPath", () => {
    it("should return a path string", () => {
      const assetPath = getSketchbookAssetPath("test.png");
      assert.equal(typeof assetPath, "string");
      assert.ok(assetPath.length > 0);
    });

    it("should include sketchbook directory", () => {
      const assetPath = getSketchbookAssetPath("test.png");
      assert.ok(assetPath.includes("sketchbook"));
    });

    it("should include the filename", () => {
      const assetPath = getSketchbookAssetPath("myfile.png");
      assert.ok(assetPath.includes("myfile.png"));
    });
  });

  describe("getEmotionImagePath", () => {
    it("should return path for normal emotion", () => {
      const imagePath = getEmotionImagePath("normal");
      assert.ok(imagePath.includes("base.png"));
      assert.ok(imagePath.includes("sketchbook"));
    });

    it("should return path for happy emotion", () => {
      const imagePath = getEmotionImagePath("happy");
      assert.ok(imagePath.includes("happy.png"));
    });

    it("should return valid paths for all emotions", () => {
      const emotions = Object.values(EmotionType);
      for (const emotion of emotions) {
        const imagePath = getEmotionImagePath(emotion);
        assert.ok(imagePath.includes(".png"), `${emotion} path should be PNG`);
        assert.ok(
          imagePath.includes("sketchbook"),
          `${emotion} path should be in sketchbook`
        );
      }
    });
  });

  describe("getSketchbookFontPath", () => {
    it("should return a path string", () => {
      const fontPath = getSketchbookFontPath();
      assert.equal(typeof fontPath, "string");
      assert.ok(fontPath.length > 0);
    });

    it("should include fonts directory", () => {
      const fontPath = getSketchbookFontPath();
      assert.ok(fontPath.includes("fonts"));
    });

    it("should be the default font path", () => {
      const fontPath = getSketchbookFontPath();
      assert.ok(
        fontPath.includes(FONTS[SKETCHBOOK_DEFAULT_FONT].file),
        "Should include default font file"
      );
    });
  });

  describe("getSketchbookFallbackFontPaths", () => {
    it("should return an array", () => {
      const paths = getSketchbookFallbackFontPaths();
      assert.ok(Array.isArray(paths));
    });

    it("should have same length as fallback fonts", () => {
      const paths = getSketchbookFallbackFontPaths();
      assert.equal(paths.length, SKETCHBOOK_FALLBACK_FONTS.length);
    });

    it("should return valid paths for all fallback fonts", () => {
      const paths = getSketchbookFallbackFontPaths();
      for (let i = 0; i < paths.length; i++) {
        const fontPath = paths[i];
        const fontId = SKETCHBOOK_FALLBACK_FONTS[i];
        assert.ok(
          fontPath.includes("fonts"),
          `Path for ${fontId} should include fonts directory`
        );
        assert.ok(
          fontPath.includes(FONTS[fontId].file),
          `Path for ${fontId} should include font file`
        );
      }
    });
  });
});
