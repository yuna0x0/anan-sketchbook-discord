/**
 * Image Adjustments
 * Basic image transformations (color, geometry, focus) applied to generated
 * images after the filter, driven by a compact key=value syntax entered in
 * the Effects modal ("brightness=1.2 hue=90 rotate=15").
 *
 * All operations are implemented with sharp and are deterministic. Values are
 * clamped to safe ranges; unknown keys and unparsable values are reported
 * back so the handler can show a syntax hint instead of guessing.
 */

import sharp from "sharp";
import {
  NumericLimit,
  splitKeyValueTokens,
  parseNumericKeyValues,
  serializeNumericKeyValues,
} from "./keyValueParser.js";

/** Solid color overlay blended over the image content */
export interface TintColor {
  r: number;
  g: number;
  b: number;
  /** Overlay strength, 0 to 1 */
  alpha: number;
}

export interface ImageAdjustments {
  /** Brightness multiplier (1 = unchanged) */
  brightness?: number;
  /** Contrast multiplier (1 = unchanged) */
  contrast?: number;
  /** Saturation multiplier (1 = unchanged, 0 = grayscale) */
  saturation?: number;
  /** Hue rotation in degrees */
  hue?: number;
  /** Alpha multiplier (1 = opaque, 0 = fully transparent) */
  alpha?: number;
  /** Uniform scale factor (1 = original size) */
  scale?: number;
  /** Horizontal-only scale factor; overrides scale on the x axis */
  scale_x?: number;
  /** Vertical-only scale factor; overrides scale on the y axis */
  scale_y?: number;
  /** Rotation in degrees (clockwise; canvas grows for non-right angles) */
  rotate?: number;
  /** Gaussian blur sigma */
  blur?: number;
  /** Sharpen sigma */
  sharpen?: number;
  /** Color overlay ("tint=ff000066" hex RRGGBB or RRGGBBAA) */
  tint?: TintColor;
}

/** The numeric adjustment keys (tint is parsed separately as a hex color) */
export type NumericAdjustmentKey = Exclude<keyof ImageAdjustments, "tint">;

export const ADJUSTMENT_LIMITS: Record<NumericAdjustmentKey, NumericLimit> = {
  brightness: { min: 0.1, max: 3 },
  contrast: { min: 0.1, max: 3 },
  saturation: { min: 0, max: 5 },
  hue: { min: -360, max: 360 },
  alpha: { min: 0, max: 1 },
  scale: { min: 0.1, max: 2 },
  scale_x: { min: 0.1, max: 2 },
  scale_y: { min: 0.1, max: 2 },
  rotate: { min: -360, max: 360 },
  blur: { min: 0.3, max: 50 },
  sharpen: { min: 0.5, max: 10 },
};

export const ADJUSTMENT_KEYS = Object.keys(
  ADJUSTMENT_LIMITS,
) as NumericAdjustmentKey[];

// Default overlay strength when a tint is given without an alpha byte
const TINT_DEFAULT_ALPHA = 0.5;

/** Parse "ff0000", "#ff0000", or "ff000066" into a tint color */
function parseTintValue(value: string): TintColor | null {
  const match = /^#?([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(value);
  if (!match) {
    return null;
  }
  const rgb = match[1];
  return {
    r: parseInt(rgb.slice(0, 2), 16),
    g: parseInt(rgb.slice(2, 4), 16),
    b: parseInt(rgb.slice(4, 6), 16),
    alpha: match[2] ? parseInt(match[2], 16) / 255 : TINT_DEFAULT_ALPHA,
  };
}

function serializeTintValue(tint: TintColor): string {
  const byte = (value: number) =>
    Math.round(Math.max(0, Math.min(255, value)))
      .toString(16)
      .padStart(2, "0");
  return `${byte(tint.r)}${byte(tint.g)}${byte(tint.b)}${byte(tint.alpha * 255)}`;
}

export interface ParsedAdjustments {
  adjustments?: ImageAdjustments;
  /** Tokens that were not valid key=value pairs */
  invalidTokens: string[];
}

/**
 * Parse a "key=value key=value" string into adjustments.
 * Numeric values are clamped to their allowed ranges; tint takes a hex color;
 * empty input means none.
 */
export function parseAdjustments(input: string): ParsedAdjustments {
  const tokens = splitKeyValueTokens(input);
  if (tokens.length === 0) {
    return { invalidTokens: [] };
  }

  const numericTokens: string[] = [];
  const invalidTokens: string[] = [];
  let tint: TintColor | undefined;

  for (const token of tokens) {
    const [key, rawValue] = token.split("=");
    if (key?.toLowerCase() === "tint") {
      const parsed = rawValue ? parseTintValue(rawValue) : null;
      if (parsed) {
        tint = parsed;
      } else {
        invalidTokens.push(token);
      }
      continue;
    }
    numericTokens.push(token);
  }

  const numeric = parseNumericKeyValues(numericTokens, ADJUSTMENT_LIMITS);
  invalidTokens.push(...numeric.invalidTokens);

  const adjustments: ImageAdjustments = { ...numeric.values };
  if (tint) {
    adjustments.tint = tint;
  }

  return {
    adjustments: Object.keys(adjustments).length > 0 ? adjustments : undefined,
    invalidTokens,
  };
}

/**
 * Serialize adjustments back to the key=value syntax for modal pre-fill
 */
export function serializeAdjustments(
  adjustments: ImageAdjustments | undefined,
): string {
  if (!adjustments) {
    return "";
  }
  const parts = [serializeNumericKeyValues(adjustments, ADJUSTMENT_KEYS)];
  if (adjustments.tint) {
    parts.push(`tint=${serializeTintValue(adjustments.tint)}`);
  }
  return parts.filter((part) => part.length > 0).join(" ");
}

/**
 * Apply adjustments to a PNG buffer, returning a PNG buffer.
 * Color and focus operations run first, then rotation, then scaling
 * (staged as separate sharp pipelines so the order is explicit).
 */
export async function applyImageAdjustments(
  png: Buffer,
  adjustments: ImageAdjustments,
): Promise<Buffer> {
  const {
    brightness,
    contrast,
    saturation,
    hue,
    alpha,
    scale,
    scale_x,
    scale_y,
    rotate,
    blur,
    sharpen,
    tint,
  } = adjustments;

  let buffer = png;

  // Stage 1: color and focus
  const wantsModulate =
    brightness !== undefined || saturation !== undefined || hue !== undefined;
  const wantsLinear = contrast !== undefined || alpha !== undefined;
  if (wantsModulate || wantsLinear || blur !== undefined || sharpen !== undefined) {
    let stage = sharp(buffer).ensureAlpha();
    if (wantsModulate) {
      // Sharp rejects keys that are present but undefined, and expects an
      // integer hue rotation
      const modulateOptions: {
        brightness?: number;
        saturation?: number;
        hue?: number;
      } = {};
      if (brightness !== undefined) modulateOptions.brightness = brightness;
      if (saturation !== undefined) modulateOptions.saturation = saturation;
      if (hue !== undefined) modulateOptions.hue = Math.round(hue);
      stage = stage.modulate(modulateOptions);
    }
    if (wantsLinear) {
      // Per-channel linear transform: contrast on RGB around the midpoint,
      // alpha as a plain multiplier on the alpha channel
      const c = contrast ?? 1;
      const a = alpha ?? 1;
      stage = stage.linear([c, c, c, a], [128 * (1 - c), 128 * (1 - c), 128 * (1 - c), 0]);
    }
    if (blur !== undefined) {
      stage = stage.blur(blur);
    }
    if (sharpen !== undefined) {
      stage = stage.sharpen({ sigma: sharpen });
    }
    buffer = await stage.png().toBuffer();
  }

  // Stage 2: color overlay, blended "atop" so it only covers image content
  // and transparent areas stay transparent
  if (tint && tint.alpha > 0) {
    const metadata = await sharp(buffer).metadata();
    const overlay = await sharp({
      create: {
        width: metadata.width ?? 1,
        height: metadata.height ?? 1,
        channels: 4,
        background: { r: tint.r, g: tint.g, b: tint.b, alpha: tint.alpha },
      },
    })
      .png()
      .toBuffer();
    buffer = await sharp(buffer)
      .composite([{ input: overlay, blend: "atop" }])
      .png()
      .toBuffer();
  }

  // Stage 3: rotation (transparent background fills the grown canvas)
  if (rotate !== undefined && rotate % 360 !== 0) {
    buffer = await sharp(buffer)
      .rotate(rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
  }

  // Stage 4: scaling; per-axis factors allow squash-and-stretch effects
  const scaleX = scale_x ?? scale ?? 1;
  const scaleY = scale_y ?? scale ?? 1;
  if (scaleX !== 1 || scaleY !== 1) {
    const metadata = await sharp(buffer).metadata();
    const width = Math.max(1, Math.round((metadata.width ?? 1) * scaleX));
    const height = Math.max(1, Math.round((metadata.height ?? 1) * scaleY));
    buffer = await sharp(buffer)
      // fit "fill" permits changing the aspect ratio
      .resize(width, height, { fit: "fill" })
      .png()
      .toBuffer();
  }

  return buffer;
}
