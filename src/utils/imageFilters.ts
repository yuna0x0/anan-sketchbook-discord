/**
 * Image Filters
 * CPU post-processing filters applied to generated images.
 *
 * The filter designs are inspired by the image filters of Paper Shaders
 * (https://github.com/paper-design/shaders, Apache-2.0). The implementations
 * here are original CPU ports built on classic, well-documented algorithms
 * (ordered Bayer dithering, halftone screening, palette mapping, and
 * procedural paper grain) rather than translations of the GLSL sources.
 *
 * All filters are deterministic (seeded noise, no Math.random) so outputs are
 * reproducible and testable.
 */

import sharp from "sharp";
import { createCanvas } from "canvas";
import { loadImageFromBuffer } from "./imageUtils.js";
import {
  NumericLimit,
  splitKeyValueTokens,
  parseNumericKeyValues,
  serializeNumericKeyValues,
} from "./keyValueParser.js";

/**
 * Available image filters
 */
export const ImageFilter = {
  NONE: "none",
  PAPER_TEXTURE: "paper_texture",
  HALFTONE_DOTS: "halftone_dots",
  IMAGE_DITHERING: "image_dithering",
  HEATMAP: "heatmap",
} as const;

export type ImageFilterId = (typeof ImageFilter)[keyof typeof ImageFilter];

const FILTER_IDS = new Set<string>(Object.values(ImageFilter));

export function isImageFilterId(value: string): value is ImageFilterId {
  return FILTER_IDS.has(value);
}

// =============================================================================
// Filter settings (per-filter tuning via key=value syntax)
// =============================================================================

export interface FilterSettings {
  /** Halftone: dot grid cell size in pixels */
  dot_size?: number;
  /** Halftone: screen angle in degrees */
  dot_angle?: number;
  /** Dithering: chunky pixel size */
  px_size?: number;
  /** Dithering: quantization levels per channel */
  color_steps?: number;
  /** Paper texture: intensity multiplier */
  grain?: number;
}

export const FILTER_SETTING_LIMITS: Record<
  keyof FilterSettings,
  NumericLimit
> = {
  dot_size: { min: 4, max: 24 },
  dot_angle: { min: 0, max: 90 },
  px_size: { min: 1, max: 8 },
  color_steps: { min: 2, max: 8 },
  grain: { min: 0.1, max: 3 },
};

export const FILTER_SETTING_KEYS = Object.keys(
  FILTER_SETTING_LIMITS,
) as (keyof FilterSettings)[];

export interface ParsedFilterSettings {
  settings?: FilterSettings;
  invalidTokens: string[];
}

/**
 * Parse a "key=value" string into filter settings.
 * Keys not used by the currently selected filter are kept (they apply when
 * the user switches to the matching filter).
 */
export function parseFilterSettings(input: string): ParsedFilterSettings {
  const { values, invalidTokens } = parseNumericKeyValues(
    splitKeyValueTokens(input),
    FILTER_SETTING_LIMITS,
  );
  return {
    settings: Object.keys(values).length > 0 ? values : undefined,
    invalidTokens,
  };
}

/**
 * Serialize filter settings back to the key=value syntax for modal pre-fill
 */
export function serializeFilterSettings(
  settings: FilterSettings | undefined,
): string {
  return serializeNumericKeyValues(settings, FILTER_SETTING_KEYS);
}

interface RawImage {
  data: Buffer;
  width: number;
  height: number;
}

async function toRaw(png: Buffer): Promise<RawImage> {
  const { data, info } = await sharp(png)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

async function fromRaw(raw: RawImage): Promise<Buffer> {
  return sharp(raw.data, {
    raw: { width: raw.width, height: raw.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

function luminance(r: number, g: number, b: number): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

// =============================================================================
// Seeded noise helpers (deterministic across runs)
// =============================================================================

/** Integer lattice hash -> [0, 1) */
function latticeHash(x: number, y: number, seed: number): number {
  let h = (x * 374761393 + y * 668265263 + seed * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * Value noise: bilinear interpolation of lattice hashes at the given cell
 * scale. Returns [0, 1).
 */
function valueNoise(
  x: number,
  y: number,
  scaleX: number,
  scaleY: number,
  seed: number,
): number {
  const fx = x / scaleX;
  const fy = y / scaleY;
  const ix = Math.floor(fx);
  const iy = Math.floor(fy);
  const tx = smoothstep(fx - ix);
  const ty = smoothstep(fy - iy);

  const v00 = latticeHash(ix, iy, seed);
  const v10 = latticeHash(ix + 1, iy, seed);
  const v01 = latticeHash(ix, iy + 1, seed);
  const v11 = latticeHash(ix + 1, iy + 1, seed);

  const top = v00 + (v10 - v00) * tx;
  const bottom = v01 + (v11 - v01) * tx;
  return top + (bottom - top) * ty;
}

// =============================================================================
// Dithering (ordered Bayer, per-channel quantization, chunky pixels)
// =============================================================================

// 8x8 Bayer threshold matrix, values 0..63
// prettier-ignore
const BAYER_8X8 = [
  0, 32, 8, 40, 2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44, 4, 36, 14, 46, 6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47, 7, 39, 13, 45, 5, 37,
  63, 31, 55, 23, 61, 29, 53, 21,
];

const DITHER_PIXEL_SIZE = 2;
const DITHER_COLOR_STEPS = 2;

async function applyImageDithering(
  png: Buffer,
  settings: FilterSettings,
): Promise<Buffer> {
  const raw = await toRaw(png);
  const { data, width, height } = raw;
  const out = Buffer.from(data);
  const steps = Math.round(settings.color_steps ?? DITHER_COLOR_STEPS);
  const px = Math.round(settings.px_size ?? DITHER_PIXEL_SIZE);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Chunky pixels: sample the top-left pixel of each block
      const sx = Math.floor(x / px) * px;
      const sy = Math.floor(y / px) * px;
      const src = (sy * width + sx) * 4;
      const dst = (y * width + x) * 4;
      const threshold =
        (BAYER_8X8[((sy / px) % 8 | 0) * 8 + ((sx / px) % 8 | 0)] + 0.5) / 64 -
        0.5;

      for (let c = 0; c < 3; c++) {
        const v = data[src + c] / 255;
        const dithered = v + threshold / (steps - 1);
        const level = Math.max(
          0,
          Math.min(steps - 1, Math.round(dithered * (steps - 1))),
        );
        out[dst + c] = Math.round((level / (steps - 1)) * 255);
      }
      out[dst + 3] = data[dst + 3];
    }
  }

  return fromRaw({ data: out, width, height });
}

// =============================================================================
// Halftone dots (classic monochrome screening at 45°)
// =============================================================================

const HALFTONE_CELL = 4;
const HALFTONE_ANGLE_DEGREES = 45;

async function applyHalftoneDots(
  png: Buffer,
  settings: FilterSettings,
): Promise<Buffer> {
  const image = await loadImageFromBuffer(png);
  const { width, height } = image;

  // Sample source luminance
  const sampleCanvas = createCanvas(width, height);
  const sampleCtx = sampleCanvas.getContext("2d");
  sampleCtx.drawImage(image, 0, 0);
  const src = sampleCtx.getImageData(0, 0, width, height).data;

  // Draw dots on a white background
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#111111";

  const angle =
    ((settings.dot_angle ?? HALFTONE_ANGLE_DEGREES) * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const cell = Math.round(settings.dot_size ?? HALFTONE_CELL);
  const range = Math.ceil((width + height) / cell);

  for (let u = -range; u <= range; u++) {
    for (let v = -range; v <= range; v++) {
      const cx = (u * cos - v * sin) * cell;
      const cy = (u * sin + v * cos) * cell;
      if (cx < -cell || cy < -cell || cx >= width + cell || cy >= height + cell) {
        continue;
      }

      // Average luminance over a small sample grid inside the cell
      let total = 0;
      let count = 0;
      for (let dy = -cell / 2; dy < cell / 2; dy += 2) {
        for (let dx = -cell / 2; dx < cell / 2; dx += 2) {
          const sx = Math.round(cx + dx);
          const sy = Math.round(cy + dy);
          if (sx < 0 || sy < 0 || sx >= width || sy >= height) {
            continue;
          }
          const i = (sy * width + sx) * 4;
          total += luminance(src[i], src[i + 1], src[i + 2]);
          count++;
        }
      }
      if (count === 0) {
        continue;
      }

      const darkness = 1 - total / count;
      // Slight overshoot so near-black areas merge into solid ink
      const radius = (darkness * cell * 1.15) / 2;
      if (radius <= 0.3) {
        continue;
      }
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return canvas.toBuffer("image/png");
}

// =============================================================================
// Heatmap (luminance -> inferno-like palette)
// =============================================================================

// prettier-ignore
const HEATMAP_STOPS: [number, number, number][] = [
  [0, 0, 4],
  [40, 11, 84],
  [101, 21, 110],
  [159, 42, 99],
  [212, 72, 66],
  [245, 125, 21],
  [250, 193, 39],
  [252, 255, 164],
];

function heatmapColor(t: number): [number, number, number] {
  const clamped = Math.max(0, Math.min(1, t));
  const scaled = clamped * (HEATMAP_STOPS.length - 1);
  const i = Math.min(Math.floor(scaled), HEATMAP_STOPS.length - 2);
  const f = scaled - i;
  const a = HEATMAP_STOPS[i];
  const b = HEATMAP_STOPS[i + 1];
  return [
    Math.round(a[0] + (b[0] - a[0]) * f),
    Math.round(a[1] + (b[1] - a[1]) * f),
    Math.round(a[2] + (b[2] - a[2]) * f),
  ];
}

async function applyHeatmap(png: Buffer): Promise<Buffer> {
  const raw = await toRaw(png);
  const { data, width, height } = raw;
  const out = Buffer.from(data);

  for (let i = 0; i < data.length; i += 4) {
    const lum = luminance(data[i], data[i + 1], data[i + 2]);
    const [r, g, b] = heatmapColor(lum);
    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    out[i + 3] = data[i + 3];
  }

  return fromRaw({ data: out, width, height });
}

// =============================================================================
// Paper texture (grain + blotches + fibers + vignette)
// =============================================================================

const PAPER_SEED = 20260702;

async function applyPaperTexture(
  png: Buffer,
  settings: FilterSettings,
): Promise<Buffer> {
  const raw = await toRaw(png);
  const { data, width, height } = raw;
  const out = Buffer.from(data);

  const intensity = settings.grain ?? 1;
  const cx = width / 2;
  const cy = height / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;

      // Fine per-pixel grain
      const grain = (latticeHash(x, y, PAPER_SEED) - 0.5) * 0.07;
      // Low-frequency tone blotches
      const blotch = (valueNoise(x, y, 48, 48, PAPER_SEED + 1) - 0.5) * 0.08;
      // Horizontal fiber streaks (anisotropic noise)
      const fiber = (valueNoise(x, y, 96, 3, PAPER_SEED + 2) - 0.5) * 0.05;
      // Soft vignette toward the edges
      const dx = x - cx;
      const dy = y - cy;
      const vignette =
        -0.08 * Math.pow(Math.sqrt(dx * dx + dy * dy) / maxDist, 2.5);

      const factor = 1 + (grain + blotch + fiber + vignette) * intensity;
      for (let c = 0; c < 3; c++) {
        out[i + c] = Math.max(0, Math.min(255, Math.round(data[i + c] * factor)));
      }
      out[i + 3] = data[i + 3];
    }
  }

  return fromRaw({ data: out, width, height });
}

// =============================================================================
// Registry
// =============================================================================

/**
 * Apply the given filter to a PNG buffer, returning a PNG buffer of the same
 * dimensions. "none" returns the input unchanged. Settings not used by the
 * selected filter are ignored (heatmap has no settings).
 */
export async function applyImageFilter(
  png: Buffer,
  filter: ImageFilterId,
  settings: FilterSettings = {},
): Promise<Buffer> {
  switch (filter) {
    case ImageFilter.NONE:
      return png;
    case ImageFilter.PAPER_TEXTURE:
      return applyPaperTexture(png, settings);
    case ImageFilter.HALFTONE_DOTS:
      return applyHalftoneDots(png, settings);
    case ImageFilter.IMAGE_DITHERING:
      return applyImageDithering(png, settings);
    case ImageFilter.HEATMAP:
      return applyHeatmap(png);
  }
}
