/**
 * Sketchbook Generator Tests
 * Smoke tests for font size capping in image generation
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { generateTextImage } from "../../src/utils/sketchbookGenerator.js";

// PNG magic bytes
function isPng(buffer: Buffer): boolean {
  return buffer.length > 8 && buffer[0] === 0x89 && buffer[1] === 0x50;
}

describe("generateTextImage font size cap", () => {
  it("should produce a valid PNG with default settings", async () => {
    const buffer = await generateTextImage({ text: "Hello" });
    assert.ok(isPng(buffer), "output should be a PNG");
  });

  it("should render differently when maxFontHeight is capped", async () => {
    const defaultBuffer = await generateTextImage({ text: "Hello" });
    const cappedBuffer = await generateTextImage({
      text: "Hello",
      maxFontHeight: 8,
    });

    assert.ok(isPng(cappedBuffer), "capped output should be a PNG");
    assert.notDeepEqual(
      cappedBuffer,
      defaultBuffer,
      "a small font cap should change the rendered image",
    );
  });

  it("should allow sizes above the default cap for short text", async () => {
    const defaultBuffer = await generateTextImage({ text: "Hi" });
    const largeBuffer = await generateTextImage({
      text: "Hi",
      maxFontHeight: 160,
    });

    assert.ok(isPng(largeBuffer), "large output should be a PNG");
    assert.notDeepEqual(
      largeBuffer,
      defaultBuffer,
      "raising the cap should let short text render larger",
    );
  });
});
