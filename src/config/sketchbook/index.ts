/**
 * Sketchbook Configuration
 * Configuration specific to the sketchbook command including emotions,
 * expressions, layout settings, and asset paths
 */

import { join } from "path";
import { ASSETS_DIR } from "../assets.js";
import { FontId, getFontPath } from "../fonts.js";
import { RGBColor } from "../types.js";

// =============================================================================
// Emotion Types
// =============================================================================

// Emotion types available for the sketchbook
export const EmotionType = {
  NORMAL: "normal",
  HAPPY: "happy",
  ANGRY: "angry",
  SPEECHLESS: "speechless",
  BLUSH: "blush",
  YANDERE: "yandere",
  CLOSED_EYES: "closed_eyes",
  SAD: "sad",
  SCARED: "scared",
  EXCITED: "excited",
  SURPRISED: "surprised",
  CRYING: "crying",
} as const;

export type EmotionTypeValue = (typeof EmotionType)[keyof typeof EmotionType];

// Expression option for command input (includes "random")
export const ExpressionOption = {
  ...EmotionType,
  RANDOM: "random",
} as const;

export type ExpressionOptionValue =
  (typeof ExpressionOption)[keyof typeof ExpressionOption];

// Mapping from emotion type to image file name
export const EMOTION_IMAGE_MAP: Record<EmotionTypeValue, string> = {
  [EmotionType.NORMAL]: "base.png",
  [EmotionType.HAPPY]: "happy.png",
  [EmotionType.ANGRY]: "angry.png",
  [EmotionType.SPEECHLESS]: "speechless.png",
  [EmotionType.BLUSH]: "blush.png",
  [EmotionType.YANDERE]: "yandere.png",
  [EmotionType.CLOSED_EYES]: "closed_eyes.png",
  [EmotionType.SAD]: "sad.png",
  [EmotionType.SCARED]: "scared.png",
  [EmotionType.EXCITED]: "excited.png",
  [EmotionType.SURPRISED]: "surprised.png",
  [EmotionType.CRYING]: "crying.png",
};

// Get a random emotion
export function getRandomEmotion(): EmotionTypeValue {
  const emotions = Object.values(EmotionType);
  const randomIndex = Math.floor(Math.random() * emotions.length);
  return emotions[randomIndex];
}

// =============================================================================
// Font Configuration
// =============================================================================

// Default font for sketchbook text
export const SKETCHBOOK_DEFAULT_FONT: FontId = "miSans";

// Fallback fonts for sketchbook (used for characters not supported by the primary font)
export const SKETCHBOOK_FALLBACK_FONTS: FontId[] = [
  "miSans",
  "notoSansTCBlack",
  "notoSansKRBlack",
  "notoSansThaiBlack",
];

// =============================================================================
// Layout Configuration
// =============================================================================

// Sketchbook text area configuration
// These coordinates define the drawable area on the sketchbook image
export const SKETCHBOOK_CONFIG = {
  // Top-left corner of the text/image area (x, y)
  textBoxTopLeft: { x: 119, y: 450 } as const,
  // Bottom-right corner of the text/image area (x, y)
  textBoxBottomRight: { x: 398, y: 625 } as const,
  // Maximum font height in pixels
  maxFontHeight: 64,
  // Line spacing multiplier
  lineSpacing: 0.15,
  // Default text color (RGB)
  defaultTextColor: { r: 0, g: 0, b: 0 } as RGBColor,
  // Bracket text color (RGB) - for text inside [] or brackets
  bracketTextColor: { r: 128, g: 0, b: 128 } as RGBColor,
  // Overlay image file name
  overlayImage: "base_overlay.png",
  // Padding for image paste
  imagePadding: 12,
} as const;

// =============================================================================
// Asset Path Utilities
// =============================================================================

// Get the full path to a sketchbook asset file
export function getSketchbookAssetPath(filename: string): string {
  return join(ASSETS_DIR, "sketchbook", filename);
}

// Get the full path to an emotion base image
export function getEmotionImagePath(emotion: EmotionTypeValue): string {
  return getSketchbookAssetPath(EMOTION_IMAGE_MAP[emotion]);
}

// Get the full path to the sketchbook default font
export function getSketchbookFontPath(): string {
  return getFontPath(SKETCHBOOK_DEFAULT_FONT);
}

// Get all fallback font paths for sketchbook
export function getSketchbookFallbackFontPaths(): string[] {
  return SKETCHBOOK_FALLBACK_FONTS.map((fontId) => getFontPath(fontId));
}
