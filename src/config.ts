import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";
import { existsSync } from "fs";
import { Locale } from "discord.js";

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

// =============================================================================
// Sketchbook Configuration
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
// Font System
// =============================================================================

// Available fonts for sketchbook and dialogue systems
export const FONTS = {
  miSans: {
    name: "MiSans Bold",
    file: "MiSans-Bold.ttf",
  },
  notoSansTCBlack: {
    name: "Noto Sans TC Black",
    file: "NotoSansTC-Black.otf",
  },
  notoSansKRBlack: {
    name: "Noto Sans KR Black",
    file: "NotoSansKR-Black.otf",
  },
  notoSansThaiBlack: {
    name: "Noto Sans Thai Black",
    file: "NotoSansThai-Black.otf",
  },
  tsukuMinPr6N: {
    name: "TsukuMin Pr6N",
    file: "TsukushiMincho.otf",
  },
  notoSerifTCSemiBold: {
    name: "Noto Serif TC SemiBold",
    file: "NotoSerifTC-SemiBold.otf",
  },
  notoSerifKRSemiBold: {
    name: "Noto Serif KR SemiBold",
    file: "NotoSerifKR-SemiBold.otf",
  },
  notoSerifThaiSemiBold: {
    name: "Noto Serif Thai SemiBold",
    file: "NotoSerifThai-SemiBold.otf",
  },
} as const;

export type FontId = keyof typeof FONTS;

// Get the full path to a font file in the shared fonts directory
export function getFontPath(fontId: FontId): string {
  const font = FONTS[fontId];
  return join(ASSETS_DIR, "fonts", font.file);
}

// =============================================================================
// Sketchbook Font Configuration
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
  // Bracket text color (RGB) - for text inside [] or brackets
  bracketTextColor: { r: 128, g: 0, b: 128 } as const,
  // Overlay image file name
  overlayImage: "base_overlay.png",
  // Padding for image paste
  imagePadding: 12,
} as const;

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

// =============================================================================
// Dialogue Configuration
// =============================================================================

// RGB color type
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

// Name text configuration for rendering character names
export interface NameTextConfig {
  text: string;
  position: { x: number; y: number };
  fontColor: RGBColor;
  fontSize: number;
}

// Supported locales for name configuration (using Discord Locale)
export type NameConfigLocale = Locale;

// Localized name configurations (partial record of Discord Locale to name config)
export type LocalizedNameConfig = Partial<
  Record<NameConfigLocale, NameTextConfig[]>
>;

// Character information
export interface CharacterInfo {
  id: string;
  expressions: string[];
  themeColor: RGBColor;
  nameConfig: LocalizedNameConfig;
}

// Get expression number from expression name for a character
export function getExpressionNumber(
  character: CharacterInfo,
  expressionName: string,
): number | undefined {
  const index = character.expressions.indexOf(expressionName);
  return index >= 0 ? index + 1 : undefined;
}

// Get all expression names for a character
export function getExpressionNames(character: CharacterInfo): string[] {
  return character.expressions;
}

// Fallback locale when requested locale is not available for a character
export const FALLBACK_NAME_LOCALE: NameConfigLocale = Locale.Japanese;

// Get name config for a specific locale, falling back to FALLBACK_NAME_LOCALE
export function getNameConfig(
  character: CharacterInfo,
  locale: NameConfigLocale,
): NameTextConfig[] {
  return (
    character.nameConfig[locale] ??
    character.nameConfig[FALLBACK_NAME_LOCALE] ??
    []
  );
}

// All available characters
export const CHARACTERS: Record<string, CharacterInfo> = {
  ema: {
    id: "ema",
    expressions: [
      "ema_expression_1",
      "ema_expression_2",
      "ema_expression_3",
      "ema_expression_4",
      "ema_expression_5",
      "ema_expression_6",
      "ema_expression_7",
      "ema_expression_8",
    ],
    themeColor: { r: 253, g: 145, b: 175 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "樱",
          position: { x: 759, y: 73 },
          fontColor: { r: 253, g: 145, b: 175 },
          fontSize: 186,
        },
        {
          text: "羽",
          position: { x: 949, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "艾",
          position: { x: 1039, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "玛",
          position: { x: 1183, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "櫻",
          position: { x: 759, y: 73 },
          fontColor: { r: 253, g: 145, b: 175 },
          fontSize: 186,
        },
        {
          text: "羽",
          position: { x: 949, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "艾",
          position: { x: 1039, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "瑪",
          position: { x: 1183, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "桜",
          position: { x: 759, y: 73 },
          fontColor: { r: 253, g: 145, b: 175 },
          fontSize: 186,
        },
        {
          text: "羽",
          position: { x: 949, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "エ",
          position: { x: 1039, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "マ",
          position: { x: 1195, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  hiro: {
    id: "hiro",
    expressions: [
      "hiro_expression_1",
      "hiro_expression_2",
      "hiro_expression_3",
      "hiro_expression_4",
      "hiro_expression_5",
      "hiro_expression_6",
    ],
    themeColor: { r: 239, g: 79, b: 84 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "二",
          position: { x: 759, y: 63 },
          fontColor: { r: 239, g: 79, b: 84 },
          fontSize: 196,
        },
        {
          text: "阶堂",
          position: { x: 955, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "希",
          position: { x: 1143, y: 110 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "罗",
          position: { x: 1283, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "二",
          position: { x: 759, y: 63 },
          fontColor: { r: 239, g: 79, b: 84 },
          fontSize: 196,
        },
        {
          text: "階堂",
          position: { x: 955, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "希",
          position: { x: 1143, y: 110 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "羅",
          position: { x: 1283, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "二",
          position: { x: 759, y: 63 },
          fontColor: { r: 239, g: 79, b: 84 },
          fontSize: 196,
        },
        {
          text: "階堂",
          position: { x: 955, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "ヒ",
          position: { x: 1123, y: 110 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "ロ",
          position: { x: 1253, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  sherry: {
    id: "sherry",
    expressions: [
      "sherry_expression_1",
      "sherry_expression_2",
      "sherry_expression_3",
      "sherry_expression_4",
      "sherry_expression_5",
      "sherry_expression_6",
      "sherry_expression_7",
    ],
    themeColor: { r: 137, g: 177, b: 251 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "橘",
          position: { x: 759, y: 73 },
          fontColor: { r: 137, g: 177, b: 251 },
          fontSize: 186,
        },
        {
          text: "雪",
          position: { x: 943, y: 110 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "莉",
          position: { x: 1093, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "橘",
          position: { x: 759, y: 73 },
          fontColor: { r: 137, g: 177, b: 251 },
          fontSize: 186,
        },
        {
          text: "雪",
          position: { x: 943, y: 110 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "莉",
          position: { x: 1093, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "橘",
          position: { x: 759, y: 73 },
          fontColor: { r: 137, g: 177, b: 251 },
          fontSize: 186,
        },
        {
          text: "シェ",
          position: { x: 943, y: 110 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "リー",
          position: { x: 1223, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  hanna: {
    id: "hanna",
    expressions: [
      "hanna_expression_1",
      "hanna_expression_2",
      "hanna_expression_3",
      "hanna_expression_4",
      "hanna_expression_5",
    ],
    themeColor: { r: 169, g: 199, b: 30 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "远",
          position: { x: 759, y: 73 },
          fontColor: { r: 169, g: 199, b: 30 },
          fontSize: 186,
        },
        {
          text: "野",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "汉",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "娜",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "遠",
          position: { x: 759, y: 73 },
          fontColor: { r: 169, g: 199, b: 30 },
          fontSize: 186,
        },
        {
          text: "野",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "漢",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "娜",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "遠",
          position: { x: 759, y: 73 },
          fontColor: { r: 169, g: 199, b: 30 },
          fontSize: 186,
        },
        {
          text: "野",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "ハン",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "ナ",
          position: { x: 1320, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  anan: {
    id: "anan",
    expressions: [
      "anan_expression_1",
      "anan_expression_2",
      "anan_expression_3",
      "anan_expression_4",
      "anan_expression_5",
      "anan_expression_6",
      "anan_expression_7",
      "anan_expression_8",
      "anan_expression_9",
    ],
    themeColor: { r: 159, g: 145, b: 251 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "夏",
          position: { x: 759, y: 73 },
          fontColor: { r: 159, g: 145, b: 251 },
          fontSize: 186,
        },
        {
          text: "目",
          position: { x: 949, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "安",
          position: { x: 1039, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "安",
          position: { x: 1183, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "夏",
          position: { x: 759, y: 73 },
          fontColor: { r: 159, g: 145, b: 251 },
          fontSize: 186,
        },
        {
          text: "目",
          position: { x: 949, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "安",
          position: { x: 1039, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "安",
          position: { x: 1183, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "夏",
          position: { x: 759, y: 73 },
          fontColor: { r: 159, g: 145, b: 251 },
          fontSize: 186,
        },
        {
          text: "目",
          position: { x: 949, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "アン",
          position: { x: 1039, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "アン",
          position: { x: 1317, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  yuki: {
    id: "yuki",
    expressions: [
      "yuki_expression_1",
      "yuki_expression_2",
      "yuki_expression_3",
      "yuki_expression_4",
      "yuki_expression_5",
      "yuki_expression_6",
      "yuki_expression_7",
      "yuki_expression_8",
      "yuki_expression_9",
      "yuki_expression_10",
      "yuki_expression_11",
      "yuki_expression_12",
      "yuki_expression_13",
      "yuki_expression_14",
      "yuki_expression_15",
      "yuki_expression_16",
      "yuki_expression_17",
      "yuki_expression_18",
    ],
    themeColor: { r: 195, g: 209, b: 231 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "月",
          position: { x: 759, y: 63 },
          fontColor: { r: 195, g: 209, b: 231 },
          fontSize: 196,
        },
        {
          text: "代",
          position: { x: 948, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "雪",
          position: { x: 1053, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "月",
          position: { x: 759, y: 63 },
          fontColor: { r: 195, g: 209, b: 231 },
          fontSize: 196,
        },
        {
          text: "代",
          position: { x: 948, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "雪",
          position: { x: 1053, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "月",
          position: { x: 759, y: 63 },
          fontColor: { r: 195, g: 209, b: 231 },
          fontSize: 196,
        },
        {
          text: "代",
          position: { x: 948, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "ユキ",
          position: { x: 1053, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
      ],
    },
  },
  meruru: {
    id: "meruru",
    expressions: [
      "meruru_expression_1",
      "meruru_expression_2",
      "meruru_expression_3",
      "meruru_expression_4",
      "meruru_expression_5",
      "meruru_expression_6",
    ],
    themeColor: { r: 227, g: 185, b: 175 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "冰",
          position: { x: 759, y: 73 },
          fontColor: { r: 227, g: 185, b: 175 },
          fontSize: 186,
        },
        {
          text: "上",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "梅",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "露露",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "冰",
          position: { x: 759, y: 73 },
          fontColor: { r: 227, g: 185, b: 175 },
          fontSize: 186,
        },
        {
          text: "上",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "梅",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "露露",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "氷",
          position: { x: 759, y: 73 },
          fontColor: { r: 227, g: 185, b: 175 },
          fontSize: 186,
        },
        {
          text: "上",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "メル",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "ル",
          position: { x: 1330, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  noa: {
    id: "noa",
    expressions: [
      "noa_expression_1",
      "noa_expression_2",
      "noa_expression_3",
      "noa_expression_4",
      "noa_expression_5",
      "noa_expression_6",
    ],
    themeColor: { r: 104, g: 223, b: 231 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "城",
          position: { x: 759, y: 73 },
          fontColor: { r: 104, g: 223, b: 231 },
          fontSize: 186,
        },
        {
          text: "崎",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "诺",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "亚",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "城",
          position: { x: 759, y: 73 },
          fontColor: { r: 104, g: 223, b: 231 },
          fontSize: 186,
        },
        {
          text: "崎",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "諾",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "亞",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "城",
          position: { x: 759, y: 73 },
          fontColor: { r: 104, g: 223, b: 231 },
          fontSize: 186,
        },
        {
          text: "ケ崎",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "ノ",
          position: { x: 1130, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "ア",
          position: { x: 1280, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  reia: {
    id: "reia",
    expressions: [
      "reia_expression_1",
      "reia_expression_2",
      "reia_expression_3",
      "reia_expression_4",
      "reia_expression_5",
      "reia_expression_6",
      "reia_expression_7",
    ],
    themeColor: { r: 253, g: 177, b: 88 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "莲",
          position: { x: 759, y: 73 },
          fontColor: { r: 253, g: 177, b: 88 },
          fontSize: 186,
        },
        {
          text: "见",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "蕾",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "雅",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "蓮",
          position: { x: 759, y: 73 },
          fontColor: { r: 253, g: 177, b: 88 },
          fontSize: 186,
        },
        {
          text: "見",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "蕾",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "雅",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "蓮",
          position: { x: 759, y: 73 },
          fontColor: { r: 253, g: 177, b: 88 },
          fontSize: 186,
        },
        {
          text: "見",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "レイ",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "ア",
          position: { x: 1320, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  miria: {
    id: "miria",
    expressions: [
      "miria_expression_1",
      "miria_expression_2",
      "miria_expression_3",
      "miria_expression_4",
    ],
    themeColor: { r: 235, g: 207, b: 139 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "佐",
          position: { x: 759, y: 73 },
          fontColor: { r: 235, g: 207, b: 139 },
          fontSize: 186,
        },
        {
          text: "伯",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "米",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "莉亚",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "佐",
          position: { x: 759, y: 73 },
          fontColor: { r: 235, g: 207, b: 139 },
          fontSize: 186,
        },
        {
          text: "伯",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "米",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "莉亞",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "佐",
          position: { x: 759, y: 73 },
          fontColor: { r: 235, g: 207, b: 139 },
          fontSize: 186,
        },
        {
          text: "伯",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "ミリ",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "ア",
          position: { x: 1320, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  nanoka: {
    id: "nanoka",
    expressions: [
      "nanoka_expression_1",
      "nanoka_expression_2",
      "nanoka_expression_3",
      "nanoka_expression_4",
      "nanoka_expression_5",
    ],
    themeColor: { r: 131, g: 143, b: 147 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "黑",
          position: { x: 759, y: 63 },
          fontColor: { r: 131, g: 143, b: 147 },
          fontSize: 196,
        },
        {
          text: "部",
          position: { x: 955, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "奈",
          position: { x: 1053, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "叶香",
          position: { x: 1197, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "黑",
          position: { x: 759, y: 63 },
          fontColor: { r: 131, g: 143, b: 147 },
          fontSize: 196,
        },
        {
          text: "部",
          position: { x: 955, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "奈",
          position: { x: 1053, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "葉香",
          position: { x: 1197, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "黒",
          position: { x: 759, y: 63 },
          fontColor: { r: 131, g: 143, b: 147 },
          fontSize: 196,
        },
        {
          text: "部",
          position: { x: 955, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "ナノ",
          position: { x: 1053, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "カ",
          position: { x: 1331, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  margo: {
    id: "margo",
    expressions: [
      "margo_expression_1",
      "margo_expression_2",
      "margo_expression_3",
      "margo_expression_4",
      "margo_expression_5",
    ],
    themeColor: { r: 185, g: 124, b: 235 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "宝",
          position: { x: 759, y: 73 },
          fontColor: { r: 185, g: 124, b: 235 },
          fontSize: 186,
        },
        {
          text: "生",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "玛",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "格",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "寶",
          position: { x: 759, y: 73 },
          fontColor: { r: 185, g: 124, b: 235 },
          fontSize: 186,
        },
        {
          text: "生",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "瑪",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "格",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "宝",
          position: { x: 759, y: 73 },
          fontColor: { r: 185, g: 124, b: 235 },
          fontSize: 186,
        },
        {
          text: "生",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "マー",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "ゴ",
          position: { x: 1340, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  alisa: {
    id: "alisa",
    expressions: [
      "alisa_expression_1",
      "alisa_expression_2",
      "alisa_expression_3",
      "alisa_expression_4",
      "alisa_expression_5",
      "alisa_expression_6",
    ],
    themeColor: { r: 235, g: 75, b: 60 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "紫",
          position: { x: 759, y: 73 },
          fontColor: { r: 235, g: 75, b: 60 },
          fontSize: 186,
        },
        {
          text: "藤",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "亚",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "里沙",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "紫",
          position: { x: 759, y: 73 },
          fontColor: { r: 235, g: 75, b: 60 },
          fontSize: 186,
        },
        {
          text: "藤",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "亞",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "里沙",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "紫",
          position: { x: 759, y: 73 },
          fontColor: { r: 235, g: 75, b: 60 },
          fontSize: 186,
        },
        {
          text: "藤",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "アリ",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "サ",
          position: { x: 1320, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  coco: {
    id: "coco",
    expressions: [
      "coco_expression_1",
      "coco_expression_2",
      "coco_expression_3",
      "coco_expression_4",
      "coco_expression_5",
    ],
    themeColor: { r: 251, g: 114, b: 78 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "泽",
          position: { x: 759, y: 73 },
          fontColor: { r: 251, g: 114, b: 78 },
          fontSize: 186,
        },
        {
          text: "渡",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "可",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "可",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "澤",
          position: { x: 759, y: 73 },
          fontColor: { r: 251, g: 114, b: 78 },
          fontSize: 186,
        },
        {
          text: "渡",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "可",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "可",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "沢",
          position: { x: 759, y: 73 },
          fontColor: { r: 251, g: 114, b: 78 },
          fontSize: 186,
        },
        {
          text: "渡",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "コ",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "コ",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
};

// Character IDs as a type
export type CharacterId = keyof typeof CHARACTERS;

// Get character by ID
export function getCharacter(id: string): CharacterInfo | undefined {
  return CHARACTERS[id];
}

// Get all character IDs
export function getCharacterIds(): CharacterId[] {
  return Object.keys(CHARACTERS) as CharacterId[];
}

// =============================================================================
// Dialogue Font Configuration
// =============================================================================

// Default font for dialogue text
export const DIALOGUE_TEXT_DEFAULT_FONT: FontId = "tsukuMinPr6N";

// Fallback fonts for dialogue text
export const DIALOGUE_TEXT_FALLBACK_FONTS: FontId[] = [
  "tsukuMinPr6N",
  "notoSerifTCSemiBold",
  "notoSerifKRSemiBold",
  "notoSerifThaiSemiBold",
];

// Character name font mapping by Discord locale
export const CHARACTER_NAME_LOCALE_FONTS: Partial<Record<Locale, FontId>> = {
  [Locale.Japanese]: "tsukuMinPr6N",
  [Locale.ChineseCN]: "notoSerifTCSemiBold",
  [Locale.ChineseTW]: "notoSerifTCSemiBold",
};

// Get character name font for a specific locale
export function getCharacterNameFontForLocale(locale: Locale): FontId {
  return CHARACTER_NAME_LOCALE_FONTS[locale] ?? "tsukuMinPr6N";
}

// Background stretch modes
export const STRETCH_MODES = {
  stretch: "Stretch to fill",
  stretch_x: "Stretch horizontally",
  stretch_y: "Stretch vertically",
  zoom_x: "Zoom horizontally (keep ratio)",
  zoom_y: "Zoom vertically (keep ratio)",
  original: "Original size (centered)",
} as const;

export type StretchMode = keyof typeof STRETCH_MODES;

// Available backgrounds (simplified list - first variant of each)
export const BACKGROUNDS: Record<string, string> = {
  bg_001_001: "Background_001_001.png",
  bg_001_002: "Background_001_002.png",
  bg_002_001: "Background_002_001.png",
  bg_003_001: "Background_003_001.png",
  bg_003_002: "Background_003_002.png",
  bg_004_001: "Background_004_001.png",
  bg_005_001: "Background_005_001.png",
  bg_005_002: "Background_005_002.png",
  bg_006_001: "Background_006_001.png",
  bg_007_001: "Background_007_001.png",
  bg_007_002: "Background_007_002.png",
  bg_009_001: "Background_009_001.png",
  bg_009_002: "Background_009_002.png",
  bg_010_001: "Background_010_001.png",
  bg_011_001: "Background_011_001.png",
  bg_012_001: "Background_012_001.png",
  bg_013_001: "Background_013_001.png",
  bg_014_001: "Background_014_001.png",
  bg_016_001: "Background_016_001.png",
  bg_017_001: "Background_017_001.png",
  bg_017_002: "Background_017_002.png",
  bg_018_001: "Background_018_001.png",
  bg_019_001: "Background_019_001.png",
  bg_019_002: "Background_019_002.png",
  bg_020_001: "Background_020_001.png",
  bg_021_001: "Background_021_001.png",
  bg_022_001: "Background_022_001.png",
  bg_022_002: "Background_022_002.png",
  bg_022_003: "Background_022_003.png",
  bg_022_004: "Background_022_004.png",
  bg_023_001: "Background_023_001.png",
  bg_023_002: "Background_023_002.png",
  bg_023_003: "Background_023_003.png",
  bg_023_004: "Background_023_004.png",
  bg_023_005: "Background_023_005.png",
  bg_023_006: "Background_023_006.png",
  bg_023_007: "Background_023_007.png",
  bg_023_008: "Background_023_008.png",
  bg_024_001: "Background_024_001.png",
  bg_024_002: "Background_024_002.png",
  bg_025_001: "Background_025_001.png",
  bg_025_002: "Background_025_002.png",
  bg_026_001: "Background_026_001.png",
  bg_027_001: "Background_027_001.png",
  bg_028_001: "Background_028_001.png",
  bg_028_002: "Background_028_002.png",
  bg_029_001: "Background_029_001.png",
  bg_029_002: "Background_029_002.png",
  bg_030_001: "Background_030_001.png",
  bg_030_002: "Background_030_002.png",
  bg_031_001: "Background_031_001.png",
  bg_031_002: "Background_031_002.png",
  bg_031_003: "Background_031_003.png",
  bg_031_004: "Background_031_004.png",
  bg_031_005: "Background_031_005.png",
  bg_032_001: "Background_032_001.png",
  bg_033_001: "Background_033_001.png",
  bg_034_001: "Background_034_001.png",
};

export type BackgroundId = keyof typeof BACKGROUNDS;

// Get all background IDs
export function getBackgroundIds(): string[] {
  return Object.keys(BACKGROUNDS);
}

// Dialogue canvas configuration
export const DIALOGUE_CONFIG = {
  // Canvas dimensions (matching the game's dialogue box)
  canvasWidth: 2560,
  canvasHeight: 834,
  // Character sprite position
  characterPosition: { x: 0, y: 134 },
  // Text area boundaries
  textPosition: { x: 728, y: 355 },
  textAreaEnd: { x: 2339, y: 800 },
  // Default text settings
  defaultFontSize: 72,
  lineHeightMultiplier: 1.2,
  // Shadow settings
  shadowOffset: { x: 2, y: 2 },
  shadowColor: { r: 0, g: 0, b: 0 },
  // Default text color
  defaultTextColor: { r: 255, g: 255, b: 255 },
} as const;

// Get the full path to a dialogue asset file
export function getDialogueAssetPath(
  type: "characters" | "backgrounds" | "ui",
  ...parts: string[]
): string {
  return join(ASSETS_DIR, "dialogue", type, ...parts);
}

// Get character image path
export function getCharacterImagePath(
  characterId: string,
  expression: number,
): string {
  return getDialogueAssetPath(
    "characters",
    characterId,
    `${characterId}_${expression}.png`,
  );
}

// Get background image path
export function getBackgroundImagePath(backgroundId: string): string {
  const filename = BACKGROUNDS[backgroundId];
  if (!filename) {
    throw new Error(`Unknown background ID: ${backgroundId}`);
  }
  return getDialogueAssetPath("backgrounds", filename);
}

// Get dialogue font path (uses the unified font system)
export function getDialogueFontPath(fontId: FontId): string {
  return getFontPath(fontId);
}

// Get UI overlay path
export function getDialogueOverlayPath(): string {
  return getDialogueAssetPath("ui", "overlay.png");
}
