/**
 * Image Filters Tests
 * Determinism and output-invariant tests for the CPU filter ports
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";

import {
  ImageFilter,
  ImageFilterId,
  applyImageFilter,
  isImageFilterId,
  parseFilterSettings,
  serializeFilterSettings,
} from "../../src/utils/imageFilters.js";

/** Create a deterministic RGBA gradient PNG */
async function createGradientPng(size = 64): Promise<Buffer> {
  const data = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      data[i] = Math.round((x / (size - 1)) * 255);
      data[i + 1] = Math.round((y / (size - 1)) * 255);
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }
  return sharp(data, { raw: { width: size, height: size, channels: 4 } })
    .png()
    .toBuffer();
}

/** Create a solid-color PNG */
async function createSolidPng(
  r: number,
  g: number,
  b: number,
  size = 16,
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

const REAL_FILTERS: ImageFilterId[] = [
  ImageFilter.PAPER_TEXTURE,
  ImageFilter.HALFTONE_DOTS,
  ImageFilter.IMAGE_DITHERING,
  ImageFilter.HEATMAP,
];

describe("imageFilters", () => {
  describe("isImageFilterId", () => {
    it("should accept all defined filters", () => {
      for (const id of Object.values(ImageFilter)) {
        assert.ok(isImageFilterId(id), `${id} should be valid`);
      }
    });

    it("should reject unknown values", () => {
      assert.equal(isImageFilterId("blur"), false);
      assert.equal(isImageFilterId(""), false);
    });
  });

  describe("applyImageFilter", () => {
    it("should return the input unchanged for none", async () => {
      const input = await createGradientPng();
      const output = await applyImageFilter(input, ImageFilter.NONE);
      assert.equal(output, input);
    });

    for (const filter of REAL_FILTERS) {
      it(`${filter}: should preserve dimensions and produce a valid PNG`, async () => {
        const input = await createGradientPng();
        const output = await applyImageFilter(input, filter);

        const { info } = await decodeRaw(output);
        assert.equal(info.width, 64);
        assert.equal(info.height, 64);
      });

      it(`${filter}: should be deterministic`, async () => {
        const input = await createGradientPng();
        const first = await applyImageFilter(input, filter);
        const second = await applyImageFilter(input, filter);
        assert.deepEqual(first, second);
      });

      it(`${filter}: should change the image`, async () => {
        const input = await createGradientPng();
        const output = await applyImageFilter(input, filter);
        assert.notDeepEqual(output, input);
      });
    }

    it("image_dithering: should quantize channels to extreme values", async () => {
      const input = await createGradientPng();
      const output = await applyImageFilter(input, ImageFilter.IMAGE_DITHERING);
      const { data } = await decodeRaw(output);

      for (let i = 0; i < data.length; i += 4) {
        for (let c = 0; c < 3; c++) {
          const v = data[i + c];
          assert.ok(
            v === 0 || v === 255,
            `channel value ${v} should be quantized to 0 or 255`,
          );
        }
      }
    });

    it("heatmap: should map black to the coldest and white to the hottest color", async () => {
      const black = await applyImageFilter(
        await createSolidPng(0, 0, 0),
        ImageFilter.HEATMAP,
      );
      const white = await applyImageFilter(
        await createSolidPng(255, 255, 255),
        ImageFilter.HEATMAP,
      );

      const blackRaw = (await decodeRaw(black)).data;
      const whiteRaw = (await decodeRaw(white)).data;

      // Coldest stop: (0, 0, 4); hottest stop: (252, 255, 164)
      assert.deepEqual([blackRaw[0], blackRaw[1], blackRaw[2]], [0, 0, 4]);
      assert.deepEqual([whiteRaw[0], whiteRaw[1], whiteRaw[2]], [252, 255, 164]);
    });

    it("halftone_dots: should print more ink for darker input", async () => {
      const darkInput = await createSolidPng(20, 20, 20, 64);
      const lightInput = await createSolidPng(235, 235, 235, 64);

      const darkOutput = (await decodeRaw(
        await applyImageFilter(darkInput, ImageFilter.HALFTONE_DOTS),
      )).data;
      const lightOutput = (await decodeRaw(
        await applyImageFilter(lightInput, ImageFilter.HALFTONE_DOTS),
      )).data;

      const meanLum = (data: Buffer) => {
        let total = 0;
        for (let i = 0; i < data.length; i += 4) {
          total += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        }
        return total / (data.length / 4);
      };

      assert.ok(
        meanLum(darkOutput) < meanLum(lightOutput),
        "dark input should produce a darker halftone",
      );
    });

    it("paper_texture: should preserve alpha", async () => {
      const input = await createGradientPng();
      const output = await applyImageFilter(input, ImageFilter.PAPER_TEXTURE);
      const { data } = await decodeRaw(output);

      for (let i = 3; i < data.length; i += 4) {
        assert.equal(data[i], 255);
      }
    });
  });

  describe("filter settings", () => {
    it("should parse and clamp settings", () => {
      const { settings, invalidTokens } = parseFilterSettings(
        "dot_size=100 px_size=4",
      );
      assert.deepEqual(invalidTokens, []);
      assert.deepEqual(settings, { dot_size: 24, px_size: 4 });
    });

    it("should report unknown setting keys", () => {
      const { invalidTokens } = parseFilterSettings("dot_size=12 dots=3");
      assert.deepEqual(invalidTokens, ["dots=3"]);
    });

    it("should round-trip through serialization", () => {
      const { settings } = parseFilterSettings("dot_angle=30 grain=1.5");
      const reparsed = parseFilterSettings(serializeFilterSettings(settings));
      assert.deepEqual(reparsed.settings, settings);
    });

    it("halftone: dot_size should change the output", async () => {
      const input = await createGradientPng();
      const small = await applyImageFilter(input, ImageFilter.HALFTONE_DOTS, {
        dot_size: 4,
      });
      const large = await applyImageFilter(input, ImageFilter.HALFTONE_DOTS, {
        dot_size: 20,
      });
      assert.notDeepEqual(small, large);
    });

    it("dithering: color_steps should produce intermediate levels", async () => {
      const input = await createGradientPng();
      const output = await applyImageFilter(
        input,
        ImageFilter.IMAGE_DITHERING,
        { color_steps: 4 },
      );
      const { data } = await decodeRaw(output);

      const levels = new Set<number>();
      for (let i = 0; i < data.length; i += 4) {
        levels.add(data[i]);
      }
      // 4 steps quantize to 0, 85, 170, 255
      assert.ok(levels.size > 2, "should use more than two levels");
      for (const level of levels) {
        assert.ok(
          [0, 85, 170, 255].includes(level),
          `level ${level} should be a multiple of 255/3`,
        );
      }
    });

    it("paper_texture: grain should change the intensity", async () => {
      const input = await createGradientPng();
      const subtle = await applyImageFilter(input, ImageFilter.PAPER_TEXTURE, {
        grain: 0.1,
      });
      const strong = await applyImageFilter(input, ImageFilter.PAPER_TEXTURE, {
        grain: 3,
      });
      assert.notDeepEqual(subtle, strong);
    });
  });
});
