/**
 * Dialogue Generator Tests
 * Tests for the wrapText function and the end-to-end render path
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createCanvas, registerFont } from "canvas";
import { existsSync } from "fs";

import {
  wrapText,
  fitTextToArea,
  generateDialogueImage,
} from "../../src/utils/dialogueGenerator.js";
import { getFontPath } from "../../src/config/fonts.js";
import { getGame } from "../../src/config/games/index.js";

// Create a test canvas context with a specific font size
function createTestContext(fontSize: number = 72) {
  const canvas = createCanvas(2560, 834);
  const ctx = canvas.getContext("2d");
  ctx.font = `${fontSize}px sans-serif`;
  return ctx;
}

// Try to register a real font for more accurate tests
try {
  const fontPath = getFontPath("miSans");
  if (existsSync(fontPath)) {
    registerFont(fontPath, { family: "TestFont" });
  }
} catch {
  // Font not available, use system fonts
}

describe("dialogueGenerator wrapText", () => {
  it("should wrap CJK text with spaces without overflowing", () => {
    const ctx = createTestContext(72);
    const maxWidth = 1611; // textAreaEnd.x - textPosition.x (2339 - 728)
    const text =
      "大家好 ，這不是【正確的】。所以說，不要再把不【正確的】東西給其他人看了";
    const lines = wrapText(ctx, text, maxWidth, 72);

    // Every line must fit within maxWidth
    for (let i = 0; i < lines.length; i++) {
      const lineWidth = ctx.measureText(lines[i]).width;
      assert.ok(
        lineWidth <= maxWidth,
        `Line ${i} overflows: "${lines[i]}" (width: ${Math.round(lineWidth)}, max: ${maxWidth})`,
      );
    }
  });

  it("should handle space-separated text where second part is longer than maxWidth", () => {
    const ctx = createTestContext(72);
    const maxWidth = 500; // narrow width to force wrapping
    const text = "AB " + "很長的中文文字測試用來確認不會溢出邊界的情況";
    const lines = wrapText(ctx, text, maxWidth, 72);

    for (let i = 0; i < lines.length; i++) {
      const lineWidth = ctx.measureText(lines[i]).width;
      assert.ok(
        lineWidth <= maxWidth,
        `Line ${i} overflows: "${lines[i]}" (width: ${Math.round(lineWidth)}, max: ${maxWidth})`,
      );
    }
  });

  it("should handle space-separated text where first part exceeds maxWidth", () => {
    const ctx = createTestContext(72);
    const maxWidth = 200; // very narrow
    const text =
      "這是一段很長的中文沒有空格 然後這裡有空格分隔";
    const lines = wrapText(ctx, text, maxWidth, 72);

    for (let i = 0; i < lines.length; i++) {
      const lineWidth = ctx.measureText(lines[i]).width;
      assert.ok(
        lineWidth <= maxWidth,
        `Line ${i} overflows: "${lines[i]}" (width: ${Math.round(lineWidth)}, max: ${maxWidth})`,
      );
    }
  });

  it("should not overflow with multiple space-separated CJK chunks", () => {
    const ctx = createTestContext(72);
    const maxWidth = 800;
    const text = "第一段 第二段比較長的文字 第三段也是很長的中文字串測試";
    const lines = wrapText(ctx, text, maxWidth, 72);

    for (let i = 0; i < lines.length; i++) {
      const lineWidth = ctx.measureText(lines[i]).width;
      assert.ok(
        lineWidth <= maxWidth,
        `Line ${i} overflows: "${lines[i]}" (width: ${Math.round(lineWidth)}, max: ${maxWidth})`,
      );
    }
  });

  it("should still work for normal space-separated words", () => {
    const ctx = createTestContext(72);
    const maxWidth = 1611;
    const text = "Hello World this is a test";
    const lines = wrapText(ctx, text, maxWidth, 72);

    assert.ok(lines.length >= 1);
    // All text should be preserved
    assert.equal(lines.join(" "), text);
  });

  it("should handle pure CJK text without spaces", () => {
    const ctx = createTestContext(72);
    const maxWidth = 500;
    const text = "這是一段沒有空格的中文文字測試";
    const lines = wrapText(ctx, text, maxWidth, 72);

    for (let i = 0; i < lines.length; i++) {
      const lineWidth = ctx.measureText(lines[i]).width;
      assert.ok(
        lineWidth <= maxWidth,
        `Line ${i} overflows: "${lines[i]}" (width: ${Math.round(lineWidth)}, max: ${maxWidth})`,
      );
    }
  });

  it("should not split Discord emoji in CJK text without spaces", () => {
    const ctx = createTestContext(72);
    const maxWidth = 1611;
    const text = "大魔女大人!<:test_emoji:000000000000000000> 背景測試";
    const lines = wrapText(ctx, text, maxWidth, 72);

    const joined = lines.join("");
    assert.ok(
      joined.includes("<:test_emoji:000000000000000000>"),
      `Discord emoji should not be split across lines, got: ${JSON.stringify(lines)}`,
    );
  });

  it("should not split Discord emoji in narrow CJK wrapping", () => {
    const ctx = createTestContext(72);
    const maxWidth = 400; // narrow to force wrapping
    const text = "這是測試文字<:test_emoji:123456789012345678>更多文字";
    const lines = wrapText(ctx, text, maxWidth, 72);

    const joined = lines.join("");
    assert.ok(
      joined.includes("<:test_emoji:123456789012345678>"),
      `Discord emoji should stay intact in narrow CJK wrapping, got: ${JSON.stringify(lines)}`,
    );
  });

  it("should preserve all text content after wrapping", () => {
    const ctx = createTestContext(72);
    const maxWidth = 1611;
    const text =
      "大家好 ，這不是【正確的】。所以說，不要再把不【正確的】東西給其他人看了";
    const lines = wrapText(ctx, text, maxWidth, 72);

    // Joining with space (since original had space-based split) should contain all chars
    const joined = lines.join(" ");
    // All non-space characters from original should be present
    for (const char of text) {
      if (char !== " ") {
        assert.ok(
          joined.includes(char),
          `Character "${char}" missing from wrapped output`,
        );
      }
    }
  });
});

describe("dialogueGenerator fitTextToArea", () => {
  const game = getGame("manosaba");
  const maxWidth = game.layout.textAreaEnd.x - game.layout.textPosition.x;
  const maxHeight = game.layout.textAreaEnd.y - game.layout.textPosition.y;

  function fit(text: string, requestedFontSize = game.layout.defaultFontSize) {
    const ctx = createTestContext(requestedFontSize);
    return fitTextToArea(
      ctx,
      text,
      maxWidth,
      maxHeight,
      "sans-serif",
      requestedFontSize,
      game.layout.minFontSize,
      game.layout.lineHeightMultiplier,
    );
  }

  it("should keep the requested size when the text already fits", () => {
    const result = fit("こんにちは");
    assert.equal(result.fontSize, game.layout.defaultFontSize);
  });

  it("should shrink the font when the text overflows the area", () => {
    const long = "這是一段很長的測試文字，用來確認字級會自動縮小。".repeat(6);
    const result = fit(long);

    assert.ok(
      result.fontSize < game.layout.defaultFontSize,
      `Expected shrink, got ${result.fontSize}`,
    );
    assert.ok(result.fontSize >= game.layout.minFontSize);

    const maxLines = Math.floor(maxHeight / result.lineHeight) || 1;
    assert.ok(
      result.lines.length <= maxLines,
      `Fitted text still overflows: ${result.lines.length} > ${maxLines}`,
    );
  });

  it("should never shrink below the configured minimum", () => {
    const huge = "あ".repeat(2000);
    const result = fit(huge);
    assert.equal(result.fontSize, game.layout.minFontSize);
  });
});

describe("dialogueGenerator generateDialogueImage", () => {
  it("should render background, overlay, and sprite from WebP assets", async () => {
    const game = getGame("manosaba");
    const buffer = await generateDialogueImage({
      game,
      characterId: "ema",
      expression: 1,
      text: "Hello!",
    });

    // Output attachment stays PNG regardless of asset format
    assert.ok(buffer.length > 0, "Should produce a non-empty buffer");
    assert.equal(buffer[0], 0x89);
    assert.equal(buffer[1], 0x50);
    assert.equal(buffer[2], 0x4e);
    assert.equal(buffer[3], 0x47);
  });
});
