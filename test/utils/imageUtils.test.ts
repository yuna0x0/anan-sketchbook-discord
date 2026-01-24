/**
 * Image Utils Tests
 * Tests for image format detection, validation, and color utilities
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  rgbToCss,
  detectImageType,
  needsConversion,
  isImageSupported,
} from "../../src/utils/imageUtils.js";

describe("imageUtils", () => {
  describe("rgbToCss", () => {
    it("should convert black color", () => {
      const css = rgbToCss({ r: 0, g: 0, b: 0 });
      assert.equal(css, "rgb(0, 0, 0)");
    });

    it("should convert white color", () => {
      const css = rgbToCss({ r: 255, g: 255, b: 255 });
      assert.equal(css, "rgb(255, 255, 255)");
    });

    it("should convert red color", () => {
      const css = rgbToCss({ r: 255, g: 0, b: 0 });
      assert.equal(css, "rgb(255, 0, 0)");
    });

    it("should convert arbitrary color", () => {
      const css = rgbToCss({ r: 128, g: 64, b: 192 });
      assert.equal(css, "rgb(128, 64, 192)");
    });
  });

  describe("detectImageType", () => {
    it("should detect PNG format", () => {
      // PNG magic bytes: 89 50 4E 47
      const pngBuffer = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      ]);
      assert.equal(detectImageType(pngBuffer), "png");
    });

    it("should detect JPEG format", () => {
      // JPEG magic bytes: FF D8 FF
      const jpegBuffer = Buffer.from([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
      ]);
      assert.equal(detectImageType(jpegBuffer), "jpeg");
    });

    it("should detect GIF format", () => {
      // GIF magic bytes: 47 49 46 38 (GIF8)
      const gifBuffer = Buffer.from([
        0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00,
      ]);
      assert.equal(detectImageType(gifBuffer), "gif");
    });

    it("should detect BMP format", () => {
      // BMP magic bytes: 42 4D (BM)
      const bmpBuffer = Buffer.from([
        0x42, 0x4d, 0x36, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x36, 0x00,
      ]);
      assert.equal(detectImageType(bmpBuffer), "bmp");
    });

    it("should detect WebP format", () => {
      // WebP magic bytes: RIFF....WEBP
      const webpBuffer = Buffer.from([
        0x52, 0x49, 0x46, 0x46, // RIFF
        0x00, 0x00, 0x00, 0x00, // file size
        0x57, 0x45, 0x42, 0x50, // WEBP
      ]);
      assert.equal(detectImageType(webpBuffer), "webp");
    });

    it("should detect TIFF format (little endian)", () => {
      // TIFF magic bytes (little endian): 49 49 2A 00
      const tiffBuffer = Buffer.from([
        0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      ]);
      assert.equal(detectImageType(tiffBuffer), "tiff");
    });

    it("should detect TIFF format (big endian)", () => {
      // TIFF magic bytes (big endian): 4D 4D 00 2A
      const tiffBuffer = Buffer.from([
        0x4d, 0x4d, 0x00, 0x2a, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00,
      ]);
      assert.equal(detectImageType(tiffBuffer), "tiff");
    });

    it("should detect AVIF format", () => {
      // AVIF has ftyp box with avif brand
      const avifBuffer = Buffer.from([
        0x00, 0x00, 0x00, 0x1c, // box size
        0x66, 0x74, 0x79, 0x70, // 'ftyp'
        0x61, 0x76, 0x69, 0x66, // 'avif' brand
      ]);
      assert.equal(detectImageType(avifBuffer), "avif");
    });

    it("should return null for unknown format", () => {
      const unknownBuffer = Buffer.from([
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
      ]);
      assert.equal(detectImageType(unknownBuffer), null);
    });

    it("should return null for buffer too small", () => {
      const smallBuffer = Buffer.from([0x89, 0x50]);
      assert.equal(detectImageType(smallBuffer), null);
    });

    it("should return null for empty buffer", () => {
      const emptyBuffer = Buffer.from([]);
      assert.equal(detectImageType(emptyBuffer), null);
    });
  });

  describe("needsConversion", () => {
    it("should return true for webp", () => {
      assert.equal(needsConversion("webp"), true);
    });

    it("should return true for tiff", () => {
      assert.equal(needsConversion("tiff"), true);
    });

    it("should return true for avif", () => {
      assert.equal(needsConversion("avif"), true);
    });

    it("should return false for png", () => {
      assert.equal(needsConversion("png"), false);
    });

    it("should return false for jpeg", () => {
      assert.equal(needsConversion("jpeg"), false);
    });

    it("should return false for gif", () => {
      assert.equal(needsConversion("gif"), false);
    });

    it("should return false for bmp", () => {
      assert.equal(needsConversion("bmp"), false);
    });
  });

  describe("isImageSupported", () => {
    it("should return true for PNG", () => {
      const pngBuffer = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      ]);
      assert.equal(isImageSupported(pngBuffer), true);
    });

    it("should return true for JPEG", () => {
      const jpegBuffer = Buffer.from([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
      ]);
      assert.equal(isImageSupported(jpegBuffer), true);
    });

    it("should return true for WebP", () => {
      const webpBuffer = Buffer.from([
        0x52, 0x49, 0x46, 0x46,
        0x00, 0x00, 0x00, 0x00,
        0x57, 0x45, 0x42, 0x50,
      ]);
      assert.equal(isImageSupported(webpBuffer), true);
    });

    it("should return false for unknown format", () => {
      const unknownBuffer = Buffer.from([
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
      ]);
      assert.equal(isImageSupported(unknownBuffer), false);
    });

    it("should return false for empty buffer", () => {
      assert.equal(isImageSupported(Buffer.from([])), false);
    });

    it("should return false for text content", () => {
      const textBuffer = Buffer.from("Hello World!");
      assert.equal(isImageSupported(textBuffer), false);
    });
  });
});
