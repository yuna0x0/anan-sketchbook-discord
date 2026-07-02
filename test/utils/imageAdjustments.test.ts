/**
 * Image Adjustments Tests
 * Tests for the key=value parser, serializer, and sharp-based transforms
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";

import {
  parseAdjustments,
  serializeAdjustments,
  applyImageAdjustments,
} from "../../src/utils/imageAdjustments.js";

async function createSolidPng(
  r: number,
  g: number,
  b: number,
  size = 32,
): Promise<Buffer> {
  return sharp({
    create: { width: size, height: size, channels: 4, background: { r, g, b, alpha: 1 } },
  })
    .png()
    .toBuffer();
}

async function decodeRaw(png: Buffer) {
  return sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
}

describe("parseAdjustments", () => {
  it("should parse valid key=value pairs", () => {
    const { adjustments, invalidTokens } = parseAdjustments(
      "brightness=1.2 hue=90 rotate=15",
    );
    assert.deepEqual(invalidTokens, []);
    assert.deepEqual(adjustments, { brightness: 1.2, hue: 90, rotate: 15 });
  });

  it("should accept comma separators and mixed case keys", () => {
    const { adjustments, invalidTokens } = parseAdjustments(
      "Blur=2, SCALE=0.5",
    );
    assert.deepEqual(invalidTokens, []);
    assert.deepEqual(adjustments, { blur: 2, scale: 0.5 });
  });

  it("should return no adjustments for empty input", () => {
    const { adjustments, invalidTokens } = parseAdjustments("   ");
    assert.equal(adjustments, undefined);
    assert.deepEqual(invalidTokens, []);
  });

  it("should report unknown keys as invalid", () => {
    const { invalidTokens } = parseAdjustments("brightness=1.2 zoom=2");
    assert.deepEqual(invalidTokens, ["zoom=2"]);
  });

  it("should report unparsable values as invalid", () => {
    const { invalidTokens } = parseAdjustments("blur=lots brightness");
    assert.deepEqual(invalidTokens, ["blur=lots", "brightness"]);
  });

  it("should clamp values to their limits", () => {
    const { adjustments } = parseAdjustments("brightness=99 alpha=-5");
    assert.deepEqual(adjustments, { brightness: 3, alpha: 0 });
  });

  it("should parse a 6-digit tint with the default strength", () => {
    const { adjustments, invalidTokens } = parseAdjustments("tint=ff0000");
    assert.deepEqual(invalidTokens, []);
    assert.deepEqual(adjustments?.tint, { r: 255, g: 0, b: 0, alpha: 0.5 });
  });

  it("should parse an 8-digit tint with explicit alpha", () => {
    const { adjustments } = parseAdjustments("tint=#00ff00ff");
    assert.deepEqual(adjustments?.tint, { r: 0, g: 255, b: 0, alpha: 1 });
  });

  it("should report invalid tint values", () => {
    const { invalidTokens } = parseAdjustments("tint=red tint=12345");
    assert.deepEqual(invalidTokens, ["tint=red", "tint=12345"]);
  });
});

describe("serializeAdjustments", () => {
  it("should round-trip through parseAdjustments", () => {
    const input = "brightness=1.2 saturation=2 rotate=45 tint=ff000080";
    const { adjustments } = parseAdjustments(input);
    const serialized = serializeAdjustments(adjustments);
    const reparsed = parseAdjustments(serialized);
    assert.deepEqual(reparsed.adjustments, adjustments);
  });

  it("should return an empty string for no adjustments", () => {
    assert.equal(serializeAdjustments(undefined), "");
  });
});

describe("applyImageAdjustments", () => {
  it("should brighten the image", async () => {
    const input = await createSolidPng(100, 100, 100);
    const output = await applyImageAdjustments(input, { brightness: 1.5 });
    const { data } = await decodeRaw(output);
    assert.ok(data[0] > 120, `expected brighter pixel, got ${data[0]}`);
  });

  it("should desaturate to grayscale", async () => {
    const input = await createSolidPng(200, 50, 50);
    const output = await applyImageAdjustments(input, { saturation: 0 });
    const { data } = await decodeRaw(output);
    assert.ok(
      Math.abs(data[0] - data[1]) <= 2 && Math.abs(data[1] - data[2]) <= 2,
      "channels should be nearly equal after full desaturation",
    );
  });

  it("should multiply the alpha channel", async () => {
    const input = await createSolidPng(100, 100, 100);
    const output = await applyImageAdjustments(input, { alpha: 0.5 });
    const { data } = await decodeRaw(output);
    assert.ok(
      Math.abs(data[3] - 128) <= 2,
      `alpha should be halved, got ${data[3]}`,
    );
  });

  it("should scale dimensions", async () => {
    const input = await createSolidPng(100, 100, 100, 40);
    const output = await applyImageAdjustments(input, { scale: 0.5 });
    const { info } = await decodeRaw(output);
    assert.equal(info.width, 20);
    assert.equal(info.height, 20);
  });

  it("should stretch horizontally with scale_x only", async () => {
    const input = await createSolidPng(100, 100, 100, 40);
    const output = await applyImageAdjustments(input, { scale_x: 2 });
    const { info } = await decodeRaw(output);
    assert.equal(info.width, 80);
    assert.equal(info.height, 40);
  });

  it("should combine uniform scale with a per-axis override", async () => {
    const input = await createSolidPng(100, 100, 100, 40);
    const output = await applyImageAdjustments(input, {
      scale: 0.5,
      scale_y: 1.5,
    });
    const { info } = await decodeRaw(output);
    assert.equal(info.width, 20);
    assert.equal(info.height, 60);
  });

  it("should grow the canvas for non-right-angle rotation", async () => {
    const input = await createSolidPng(100, 100, 100, 40);
    const output = await applyImageAdjustments(input, { rotate: 45 });
    const { info } = await decodeRaw(output);
    assert.ok(info.width > 40, "rotated canvas should be wider");
  });

  it("should keep dimensions for a 90 degree rotation of a square", async () => {
    const input = await createSolidPng(100, 100, 100, 40);
    const output = await applyImageAdjustments(input, { rotate: 90 });
    const { info } = await decodeRaw(output);
    assert.equal(info.width, 40);
    assert.equal(info.height, 40);
  });

  it("should tint the image toward the overlay color", async () => {
    const input = await createSolidPng(0, 0, 255);
    const output = await applyImageAdjustments(input, {
      tint: { r: 255, g: 0, b: 0, alpha: 1 },
    });
    const { data } = await decodeRaw(output);
    assert.ok(data[0] > 200, `red channel should dominate, got ${data[0]}`);
    assert.ok(data[2] < 60, `blue channel should be replaced, got ${data[2]}`);
    assert.equal(data[3], 255, "alpha should be preserved");
  });

  it("should not tint transparent areas", async () => {
    const transparent = await sharp({
      create: {
        width: 8,
        height: 8,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .png()
      .toBuffer();
    const output = await applyImageAdjustments(transparent, {
      tint: { r: 255, g: 0, b: 0, alpha: 1 },
    });
    const { data } = await decodeRaw(output);
    assert.equal(data[3], 0, "transparent pixels should stay transparent");
  });

  it("should be deterministic", async () => {
    const input = await createSolidPng(80, 120, 160);
    const adjustments = {
      brightness: 1.3,
      contrast: 1.5,
      hue: 45,
      blur: 2,
      rotate: 30,
      scale: 0.75,
    };
    const first = await applyImageAdjustments(input, adjustments);
    const second = await applyImageAdjustments(input, adjustments);
    assert.deepEqual(first, second);
  });
});
