/**
 * Shared Image Utilities
 * Provides unified image format detection, validation, and loading functions
 * used by both imageGenerator and dialogueGenerator.
 */

import { loadImage, Image } from "canvas";
import sharp from "sharp";
import { Locale } from "discord.js";
import { RGBColor } from "../config.js";
import { getImageFormatErrorMessage } from "../locales.js";

// =============================================================================
// Image Format Types
// =============================================================================

/**
 * Image types natively supported by node-canvas
 */
export type CanvasNativeType = "png" | "jpeg" | "gif" | "bmp";

/**
 * Image types that need conversion to PNG for canvas compatibility
 */
export type ConvertibleType = "webp" | "tiff" | "avif";

/**
 * All supported image types
 */
export type SupportedImageType = CanvasNativeType | ConvertibleType;

// =============================================================================
// RGB Color Utilities
// =============================================================================

/**
 * Convert RGB color to CSS color string
 */
export function rgbToCss(color: RGBColor): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

// =============================================================================
// Image Format Detection
// =============================================================================

/**
 * Detect image type from buffer magic bytes
 * Returns the image type if supported, or null if unsupported/unknown
 */
export function detectImageType(buffer: Buffer): SupportedImageType | null {
  if (buffer.length < 12) {
    return null;
  }

  // PNG: 89 50 4E 47 (‰PNG)
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "png";
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpeg";
  }

  // GIF: 47 49 46 38 (GIF8)
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return "gif";
  }

  // BMP: 42 4D (BM)
  if (buffer[0] === 0x42 && buffer[1] === 0x4d) {
    return "bmp";
  }

  // WebP: 52 49 46 46 ... 57 45 42 50 (RIFF....WEBP)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "webp";
  }

  // TIFF: 49 49 2A 00 (little endian) or 4D 4D 00 2A (big endian)
  if (
    (buffer[0] === 0x49 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x2a &&
      buffer[3] === 0x00) ||
    (buffer[0] === 0x4d &&
      buffer[1] === 0x4d &&
      buffer[2] === 0x00 &&
      buffer[3] === 0x2a)
  ) {
    return "tiff";
  }

  // AVIF: ftyp box with avif/avis brand
  if (buffer.length >= 12) {
    const ftypStart = buffer.indexOf(Buffer.from([0x66, 0x74, 0x79, 0x70]));
    if (ftypStart !== -1 && ftypStart <= 8) {
      const brand = buffer
        .subarray(ftypStart + 4, ftypStart + 8)
        .toString("ascii");
      if (brand === "avif" || brand === "avis") {
        return "avif";
      }
    }
  }

  return null;
}

/**
 * Check if an image type needs conversion for canvas compatibility
 */
export function needsConversion(
  imageType: SupportedImageType,
): imageType is ConvertibleType {
  return imageType === "webp" || imageType === "tiff" || imageType === "avif";
}

/**
 * Convert an image buffer to PNG format using sharp
 */
export async function convertToPng(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer).png().toBuffer();
}

// =============================================================================
// Image Validation
// =============================================================================

/**
 * Check if an image buffer is a supported format
 */
export function isImageSupported(buffer: Buffer): boolean {
  return detectImageType(buffer) !== null;
}

// =============================================================================
// Image Loading
// =============================================================================

/**
 * Load an image from file path
 */
export async function loadImageFromPath(imagePath: string): Promise<Image> {
  return loadImage(imagePath);
}

/**
 * Load an image from buffer with format validation and conversion if needed
 * @param buffer - The image buffer to load
 * @param locale - Optional locale for error messages
 */
export async function loadImageFromBuffer(
  buffer: Buffer,
  locale?: Locale,
): Promise<Image> {
  const imageType = detectImageType(buffer);
  if (!imageType) {
    throw new Error(getImageFormatErrorMessage(locale));
  }

  // Convert non-native formats (WebP, TIFF, AVIF) to PNG for canvas compatibility
  if (needsConversion(imageType)) {
    const convertedBuffer = await convertToPng(buffer);
    return loadImage(convertedBuffer);
  }

  return loadImage(buffer);
}
