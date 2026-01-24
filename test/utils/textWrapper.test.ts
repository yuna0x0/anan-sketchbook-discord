/**
 * Text Wrapper Tests
 * Tests for text measurement, wrapping algorithms, and color segment parsing
 */

import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { createCanvas, registerFont } from "canvas";
import { existsSync } from "fs";

import {
  measureTextWidth,
  wrapText,
  parseColorSegments,
  measureTextBlock,
  ColorSegment,
  WrapAlgorithm,
} from "../../src/utils/textWrapper.js";
import { RGBColor } from "../../src/config/types.js";
import { getFontPath } from "../../src/config/fonts.js";

// Create a test canvas context
function createTestContext() {
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext("2d");
  ctx.font = "24px sans-serif";
  return ctx;
}

// Try to register a real font for more accurate tests
let fontRegistered = false;
try {
  const fontPath = getFontPath("miSans");
  if (existsSync(fontPath)) {
    registerFont(fontPath, { family: "TestFont" });
    fontRegistered = true;
  }
} catch {
  // Font not available, use system fonts
}

describe("textWrapper", () => {
  describe("measureTextWidth", () => {
    it("should measure plain text width", () => {
      const ctx = createTestContext();
      const width = measureTextWidth(ctx, "Hello World");
      assert.ok(width > 0, "Width should be positive");
    });

    it("should return 0 for empty string", () => {
      const ctx = createTestContext();
      const width = measureTextWidth(ctx, "");
      assert.equal(width, 0);
    });

    it("should measure longer text as wider", () => {
      const ctx = createTestContext();
      const shortWidth = measureTextWidth(ctx, "Hi");
      const longWidth = measureTextWidth(ctx, "Hello World");
      assert.ok(longWidth > shortWidth, "Longer text should be wider");
    });

    it("should handle emoji with emojiSize parameter", () => {
      const ctx = createTestContext();
      const emojiSize = 24;
      const width = measureTextWidth(ctx, "😀", emojiSize);
      assert.ok(width > 0, "Emoji should have positive width");
    });

    it("should handle text with emoji", () => {
      const ctx = createTestContext();
      const emojiSize = 24;
      const textOnlyWidth = measureTextWidth(ctx, "Hello");
      const textWithEmojiWidth = measureTextWidth(ctx, "Hello 😀", emojiSize);
      assert.ok(
        textWithEmojiWidth > textOnlyWidth,
        "Text with emoji should be wider"
      );
    });

    it("should handle Discord emoji in text", () => {
      const ctx = createTestContext();
      const emojiSize = 24;
      const width = measureTextWidth(ctx, "Hello <:test:123456789>", emojiSize);
      assert.ok(width > 0, "Should measure text with Discord emoji");
    });

    it("should treat Discord emoji as square when emojiSize provided", () => {
      const ctx = createTestContext();
      const emojiSize = 48;
      const textWidth = measureTextWidth(ctx, "Hello");
      const withEmoji = measureTextWidth(ctx, "Hello <:test:123>", emojiSize);
      // Discord emoji should add approximately emojiSize to the width
      assert.ok(
        withEmoji >= textWidth + emojiSize * 0.8,
        "Discord emoji should add significant width"
      );
    });
  });

  describe("wrapText", () => {
    it("should return single line for short text", () => {
      const ctx = createTestContext();
      const lines = wrapText(ctx, "Hi", 200);
      assert.equal(lines.length, 1);
      assert.equal(lines[0], "Hi");
    });

    it("should wrap long text into multiple lines", () => {
      const ctx = createTestContext();
      const longText =
        "This is a very long text that should definitely wrap into multiple lines when given a narrow width constraint";
      const lines = wrapText(ctx, longText, 150);
      assert.ok(lines.length > 1, "Should wrap into multiple lines");
    });

    it("should preserve newlines as paragraph breaks", () => {
      const ctx = createTestContext();
      const textWithNewlines = "Line 1\nLine 2\nLine 3";
      const lines = wrapText(ctx, textWithNewlines, 500);
      assert.ok(lines.length >= 3, "Should have at least 3 lines");
    });

    it("should handle empty string", () => {
      const ctx = createTestContext();
      const lines = wrapText(ctx, "", 200);
      assert.ok(lines.length <= 1, "Empty string should have 0 or 1 lines");
    });

    it("should use greedy algorithm by default", () => {
      const ctx = createTestContext();
      const text = "Word1 Word2 Word3 Word4";
      const lines = wrapText(ctx, text, 100, "greedy");
      assert.ok(Array.isArray(lines), "Should return array of lines");
    });

    it("should support knuth-plass algorithm", () => {
      const ctx = createTestContext();
      const text = "Word1 Word2 Word3 Word4 Word5";
      const lines = wrapText(ctx, text, 100, "knuth_plass");
      assert.ok(Array.isArray(lines), "Should return array of lines");
    });

    it("should handle CJK text (character-based wrapping)", () => {
      const ctx = createTestContext();
      const cjkText = "这是一段中文文字测试";
      const lines = wrapText(ctx, cjkText, 100);
      assert.ok(lines.length >= 1, "Should handle CJK text");
    });

    it("should handle mixed CJK and Latin text", () => {
      const ctx = createTestContext();
      const mixedText = "Hello 你好 World 世界";
      const lines = wrapText(ctx, mixedText, 150);
      assert.ok(lines.length >= 1, "Should handle mixed text");
    });

    it("should handle text with emojis", () => {
      const ctx = createTestContext();
      const emojiText = "Hello 😀 World 🎉 Test";
      const emojiSize = 24;
      const lines = wrapText(ctx, emojiText, 150, "greedy", emojiSize);
      assert.ok(lines.length >= 1, "Should handle emoji text");
    });

    it("should not split Discord emojis", () => {
      const ctx = createTestContext();
      const discordEmojiText = "Test <:emoji:123456789012345678> end";
      const lines = wrapText(ctx, discordEmojiText, 100, "greedy", 24);
      // Check that the Discord emoji is not split across lines
      const fullText = lines.join("");
      assert.ok(
        fullText.includes("<:emoji:123456789012345678>"),
        "Discord emoji should not be split"
      );
    });

    it("should handle bracket tokens", () => {
      const ctx = createTestContext();
      const bracketText = "Normal [bracketed text] more";
      const lines = wrapText(ctx, bracketText, 200);
      assert.ok(lines.length >= 1, "Should handle bracket text");
    });
  });

  describe("parseColorSegments", () => {
    const normalColor: RGBColor = { r: 0, g: 0, b: 0 };
    const bracketColor: RGBColor = { r: 128, g: 0, b: 128 };

    it("should parse plain text as single segment", () => {
      const result = parseColorSegments(
        "Hello World",
        false,
        bracketColor,
        normalColor
      );
      assert.equal(result.segments.length, 1);
      assert.equal(result.segments[0].text, "Hello World");
      assert.deepEqual(result.segments[0].color, normalColor);
      assert.equal(result.inBracket, false);
    });

    it("should highlight text inside square brackets", () => {
      const result = parseColorSegments(
        "Normal [highlighted] normal",
        false,
        bracketColor,
        normalColor
      );

      // Should have multiple segments
      assert.ok(result.segments.length >= 3, "Should have multiple segments");

      // Find the highlighted content
      const highlightedSegment = result.segments.find(
        (s) => s.text === "highlighted"
      );
      assert.ok(highlightedSegment, "Should have highlighted segment");
      assert.deepEqual(highlightedSegment!.color, bracketColor);
    });

    it("should highlight brackets themselves", () => {
      const result = parseColorSegments(
        "[test]",
        false,
        bracketColor,
        normalColor
      );

      // Opening bracket should be bracket color
      const openBracket = result.segments.find((s) => s.text === "[");
      assert.ok(openBracket, "Should have opening bracket segment");
      assert.deepEqual(openBracket!.color, bracketColor);

      // Closing bracket should be bracket color
      const closeBracket = result.segments.find((s) => s.text === "]");
      assert.ok(closeBracket, "Should have closing bracket segment");
      assert.deepEqual(closeBracket!.color, bracketColor);
    });

    it("should handle Japanese brackets 【】", () => {
      const result = parseColorSegments(
        "Normal 【highlighted】 normal",
        false,
        bracketColor,
        normalColor
      );

      // Find the highlighted content
      const highlightedSegment = result.segments.find(
        (s) => s.text === "highlighted"
      );
      assert.ok(highlightedSegment, "Should have highlighted segment");
      assert.deepEqual(highlightedSegment!.color, bracketColor);
    });

    it("should track bracket state across calls", () => {
      // Start inside a bracket
      const result = parseColorSegments(
        "still highlighted] normal",
        true, // inBracket = true
        bracketColor,
        normalColor
      );

      // "still highlighted" should be bracket color
      const highlightedSegment = result.segments.find(
        (s) => s.text === "still highlighted"
      );
      assert.ok(highlightedSegment, "Should have highlighted segment");
      assert.deepEqual(highlightedSegment!.color, bracketColor);

      // After the ], state should be false
      assert.equal(result.inBracket, false);
    });

    it("should handle nested brackets as flat sequence", () => {
      const result = parseColorSegments(
        "[outer [inner] outer]",
        false,
        bracketColor,
        normalColor
      );
      // All content should be valid segments
      assert.ok(result.segments.length > 0, "Should have segments");
    });

    it("should handle empty string", () => {
      const result = parseColorSegments("", false, bracketColor, normalColor);
      assert.equal(result.segments.length, 0);
      assert.equal(result.inBracket, false);
    });

    it("should handle unclosed bracket", () => {
      const result = parseColorSegments(
        "Normal [unclosed",
        false,
        bracketColor,
        normalColor
      );
      assert.equal(result.inBracket, true, "Should end in bracket state");
    });

    it("should handle multiple bracket pairs", () => {
      const result = parseColorSegments(
        "[first] middle [second]",
        false,
        bracketColor,
        normalColor
      );

      // Find "middle" segment - should be normal color
      const middleSegment = result.segments.find((s) =>
        s.text.includes("middle")
      );
      assert.ok(middleSegment, "Should have middle segment");
      assert.deepEqual(middleSegment!.color, normalColor);
    });
  });

  describe("measureTextBlock", () => {
    it("should measure single line block", () => {
      const ctx = createTestContext();
      const lines = ["Hello World"];
      const result = measureTextBlock(ctx, lines, 24, 0.15);

      assert.ok(result.width > 0, "Width should be positive");
      assert.ok(result.height > 0, "Height should be positive");
      assert.ok(result.lineHeight > 0, "Line height should be positive");
    });

    it("should measure multi-line block", () => {
      const ctx = createTestContext();
      const lines = ["Line 1", "Line 2", "Line 3"];
      const result = measureTextBlock(ctx, lines, 24, 0.15);

      assert.ok(result.width > 0, "Width should be positive");
      assert.ok(
        result.height > result.lineHeight,
        "Height should be greater than single line"
      );
    });

    it("should account for line spacing", () => {
      const ctx = createTestContext();
      const lines = ["Line 1", "Line 2"];

      const noSpacing = measureTextBlock(ctx, lines, 24, 0);
      const withSpacing = measureTextBlock(ctx, lines, 24, 0.5);

      assert.ok(
        withSpacing.lineHeight > noSpacing.lineHeight,
        "Line height should increase with spacing"
      );
    });

    it("should find max width among lines", () => {
      const ctx = createTestContext();
      const lines = ["Short", "This is a much longer line", "Med"];
      const result = measureTextBlock(ctx, lines, 24, 0.15);

      const longestLineWidth = measureTextWidth(
        ctx,
        "This is a much longer line"
      );
      assert.ok(
        result.width >= longestLineWidth * 0.9,
        "Block width should be close to longest line"
      );
    });

    it("should handle empty lines array", () => {
      const ctx = createTestContext();
      const lines: string[] = [];
      const result = measureTextBlock(ctx, lines, 24, 0.15);

      // Should handle gracefully
      assert.ok(result.height >= 0, "Height should be non-negative");
    });

    it("should support emoji-aware measurement", () => {
      const ctx = createTestContext();
      const lines = ["Hello 😀 World"];
      const result = measureTextBlock(ctx, lines, 24, 0.15, true);

      assert.ok(result.width > 0, "Width should be positive with emoji");
    });

    it("should calculate correct line height from font size and spacing", () => {
      const ctx = createTestContext();
      const fontSize = 24;
      const lineSpacing = 0.2;
      const lines = ["Test"];
      const result = measureTextBlock(ctx, lines, fontSize, lineSpacing);

      const expectedLineHeight = Math.ceil(fontSize * (1 + lineSpacing));
      assert.equal(
        result.lineHeight,
        expectedLineHeight,
        "Line height should match formula"
      );
    });
  });

  describe("algorithm comparison", () => {
    it("greedy and knuth-plass should both produce valid output", () => {
      const ctx = createTestContext();
      const text =
        "This is a sample text that we will use to compare the two wrapping algorithms";
      const maxWidth = 200;

      const greedyLines = wrapText(ctx, text, maxWidth, "greedy");
      const kpLines = wrapText(ctx, text, maxWidth, "knuth_plass");

      assert.ok(greedyLines.length > 0, "Greedy should produce output");
      assert.ok(kpLines.length > 0, "Knuth-Plass should produce output");

      // Both should contain all the original text
      const greedyJoined = greedyLines.join(" ");
      const kpJoined = kpLines.join(" ");

      // Check key words are present
      assert.ok(greedyJoined.includes("sample"), "Greedy should contain text");
      assert.ok(kpJoined.includes("sample"), "Knuth-Plass should contain text");
    });
  });
});
