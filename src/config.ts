import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";
import { existsSync } from "fs";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Find the assets directory by checking multiple possible locations
function findAssetsDir(): string {
  // Possible locations for the assets directory
  const possiblePaths = [
    // When running from dist/ (production build)
    join(__dirname, "..", "..", "assets"),
    // When running from src/ (development with tsx)
    join(__dirname, "..", "assets"),
    // Relative to current working directory
    join(process.cwd(), "assets"),
  ];

  for (const path of possiblePaths) {
    const resolvedPath = resolve(path);
    if (existsSync(resolvedPath)) {
      return resolvedPath;
    }
  }

  // Default fallback (will likely fail, but provides a clear error)
  console.error("Could not find assets directory. Searched paths:");
  for (const path of possiblePaths) {
    console.error(`  - ${resolve(path)}`);
  }
  return resolve(possiblePaths[0]);
}

// Assets directory path
export const ASSETS_DIR = findAssetsDir();

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

// Display names for emotions (used in slash command choices)
export const EMOTION_DISPLAY_NAMES: Record<EmotionTypeValue, string> = {
  [EmotionType.NORMAL]: "Normal",
  [EmotionType.HAPPY]: "Happy",
  [EmotionType.ANGRY]: "Angry",
  [EmotionType.SPEECHLESS]: "Speechless",
  [EmotionType.BLUSH]: "Blush",
  [EmotionType.YANDERE]: "Yandere",
  [EmotionType.CLOSED_EYES]: "Closed Eyes",
  [EmotionType.SAD]: "Sad",
  [EmotionType.SCARED]: "Scared",
  [EmotionType.EXCITED]: "Excited",
  [EmotionType.SURPRISED]: "Surprised",
  [EmotionType.CRYING]: "Crying",
};

// Display names for expression options (used in slash command choices)
export const EXPRESSION_DISPLAY_NAMES: Record<ExpressionOptionValue, string> = {
  ...EMOTION_DISPLAY_NAMES,
  [ExpressionOption.RANDOM]: "(Random)",
};

// Get a random emotion
export function getRandomEmotion(): EmotionTypeValue {
  const emotions = Object.values(EmotionType);
  const randomIndex = Math.floor(Math.random() * emotions.length);
  return emotions[randomIndex];
}

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
  defaultTextColor: { r: 0, g: 0, b: 0 } as const,
  // Bracket text color (RGB) - for text inside [] or 【】 brackets
  bracketTextColor: { r: 128, g: 0, b: 128 } as const,
  // Overlay image file name
  overlayImage: "base_overlay.png",
  // Font file name
  fontFile: "font.ttf",
  // Padding for image paste
  imagePadding: 12,
} as const;

// Get the full path to an asset file
export function getAssetPath(filename: string): string {
  return join(ASSETS_DIR, filename);
}

// Get the full path to an emotion base image
export function getEmotionImagePath(emotion: EmotionTypeValue): string {
  return getAssetPath(EMOTION_IMAGE_MAP[emotion]);
}
