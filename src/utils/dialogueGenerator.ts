/**
 * Dialogue Image Generator Utility
 * Generates dialogue images with character sprites, backgrounds, and styled text.
 * Supports custom backgrounds, multiple stretch modes, and bracket text highlighting.
 */

import {
  createCanvas,
  loadImage,
  registerFont,
  CanvasRenderingContext2D,
  Image,
} from "canvas";
import sharp from "sharp";
import { existsSync } from "fs";
import {
  DIALOGUE_CONFIG,
  DIALOGUE_FONTS,
  CHARACTERS,
  CharacterId,
  DialogueFontId,
  StretchMode,
  RGBColor,
  NameConfigLocale,
  getCharacterImagePath,
  getBackgroundImagePath,
  getDialogueFontPath,
  getDialogueOverlayPath,
  getCharacter,
  getNameConfig,
  FALLBACK_NAME_LOCALE,
} from "../config.js";
import {
  parseTextWithEmoji,
  loadEmojiImage,
  preloadEmojis,
} from "./emojiRenderer.js";

// Track registered fonts
const registeredFonts = new Set<string>();

/**
 * Ensure a dialogue font is registered
 */
function ensureDialogueFontRegistered(fontId: DialogueFontId): void {
  if (registeredFonts.has(fontId)) {
    return;
  }

  const fontPath = getDialogueFontPath(fontId);
  if (existsSync(fontPath)) {
    registerFont(fontPath, { family: fontId });
    registeredFonts.add(fontId);
  } else {
    console.warn(`Font file not found: ${fontPath}`);
  }
}

/**
 * Ensure all dialogue fonts are registered
 */
function ensureAllFontsRegistered(): void {
  for (const fontId of Object.keys(DIALOGUE_FONTS) as DialogueFontId[]) {
    ensureDialogueFontRegistered(fontId);
  }
}

/**
 * Convert RGB color to CSS string
 */
function rgbToCss(color: RGBColor): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

/**
 * Supported canvas-native image types
 */
type CanvasNativeType = "png" | "jpeg" | "gif" | "bmp";

/**
 * Image types that need conversion to PNG
 */
type ConvertibleType = "webp" | "tiff" | "avif";

/**
 * All supported image types
 */
type SupportedImageType = CanvasNativeType | ConvertibleType;

/**
 * Detect image type from buffer magic bytes
 */
function detectImageType(buffer: Buffer): SupportedImageType | null {
  if (buffer.length < 12) return null;

  // PNG: 89 50 4E 47
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

  // GIF: 47 49 46 38
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return "gif";
  }

  // BMP: 42 4D
  if (buffer[0] === 0x42 && buffer[1] === 0x4d) {
    return "bmp";
  }

  // WebP: 52 49 46 46 ... 57 45 42 50
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

  // TIFF: 49 49 2A 00 or 4D 4D 00 2A
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

  // AVIF: ... 66 74 79 70 61 76 69 66
  if (buffer.length >= 12) {
    const ftypStart = buffer.indexOf(Buffer.from([0x66, 0x74, 0x79, 0x70]));
    if (ftypStart !== -1 && ftypStart <= 8) {
      const brand = buffer
        .slice(ftypStart + 4, ftypStart + 8)
        .toString("ascii");
      if (brand === "avif" || brand === "avis") {
        return "avif";
      }
    }
  }

  return null;
}

/**
 * Check if image type needs conversion
 */
function needsConversion(type: SupportedImageType): type is ConvertibleType {
  return type === "webp" || type === "tiff" || type === "avif";
}

/**
 * Convert image buffer to PNG using sharp
 */
async function convertToPng(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer).png().toBuffer();
}

/**
 * Check if an image buffer is supported
 */
export function isImageSupported(buffer: Buffer): boolean {
  return detectImageType(buffer) !== null;
}

/**
 * Get error message for unsupported image
 */
export function getUnsupportedImageError(): string {
  return "Unsupported image format. Please use PNG, JPEG, GIF, BMP, WebP, TIFF, or AVIF.";
}

/**
 * Load image from file path
 */
async function loadImageFromPath(path: string): Promise<Image> {
  return loadImage(path);
}

/**
 * Load image from buffer, converting if necessary
 */
async function loadImageFromBuffer(buffer: Buffer): Promise<Image> {
  const imageType = detectImageType(buffer);
  if (!imageType) {
    throw new Error("Unsupported image format");
  }

  if (needsConversion(imageType)) {
    const convertedBuffer = await convertToPng(buffer);
    return loadImage(convertedBuffer);
  }

  return loadImage(buffer);
}

/**
 * Options for generating dialogue image
 */
export interface DialogueImageOptions {
  characterId: CharacterId;
  expression: number;
  text: string;
  backgroundId?: string;
  customBackground?: Buffer;
  stretchMode?: StretchMode;
  fontId?: DialogueFontId;
  fontSize?: number;
  highlightBrackets?: boolean;
  nameLocale?: NameConfigLocale;
}

/**
 * Draw background with specified stretch mode
 */
function drawBackground(
  ctx: CanvasRenderingContext2D,
  background: Image,
  canvasWidth: number,
  canvasHeight: number,
  stretchMode: StretchMode,
): void {
  let destX = 0;
  let destY = 0;
  let destWidth = canvasWidth;
  let destHeight = canvasHeight;

  switch (stretchMode) {
    case "stretch":
      // Stretch to fill entire canvas
      destWidth = canvasWidth;
      destHeight = canvasHeight;
      break;

    case "stretch_x":
      // Stretch width to fill, keep original height, center vertically
      destWidth = canvasWidth;
      destHeight = background.naturalHeight;
      destY = Math.round((canvasHeight - destHeight) / 2);
      break;

    case "stretch_y":
      // Keep original width, stretch height to fill, center horizontally
      destWidth = background.naturalWidth;
      destHeight = canvasHeight;
      destX = Math.round((canvasWidth - destWidth) / 2);
      break;

    case "zoom_x": {
      // Scale to fit width while maintaining aspect ratio, center vertically
      const scale = canvasWidth / background.naturalWidth;
      destWidth = canvasWidth;
      destHeight = Math.round(background.naturalHeight * scale);
      destY = Math.round((canvasHeight - destHeight) / 2);
      break;
    }

    case "zoom_y": {
      // Scale to fit height while maintaining aspect ratio, center horizontally
      const scale = canvasHeight / background.naturalHeight;
      destWidth = Math.round(background.naturalWidth * scale);
      destHeight = canvasHeight;
      destX = Math.round((canvasWidth - destWidth) / 2);
      break;
    }

    case "original":
      // Original size, centered
      destWidth = background.naturalWidth;
      destHeight = background.naturalHeight;
      destX = Math.round((canvasWidth - destWidth) / 2);
      destY = Math.round((canvasHeight - destHeight) / 2);
      break;
  }

  ctx.drawImage(background, destX, destY, destWidth, destHeight);
}

/**
 * Draw character name with styled text configuration
 */
function drawCharacterName(
  ctx: CanvasRenderingContext2D,
  characterId: CharacterId,
  locale: NameConfigLocale = FALLBACK_NAME_LOCALE,
): void {
  const character = getCharacter(characterId);
  if (!character) return;

  const { shadowOffset, shadowColor } = DIALOGUE_CONFIG;
  const nameConfig = getNameConfig(character, locale);

  for (const config of nameConfig) {
    ctx.font = `${config.fontSize}px ${character.font}`;

    // Draw shadow
    ctx.fillStyle = rgbToCss(shadowColor);
    ctx.fillText(
      config.text,
      config.position.x + shadowOffset.x,
      config.fontSize + config.position.y + shadowOffset.y,
    );

    // Draw text
    ctx.fillStyle = rgbToCss(config.fontColor);
    ctx.fillText(
      config.text,
      config.position.x,
      config.fontSize + config.position.y,
    );
  }
}

/**
 * Parse text segments for bracket highlighting
 * Returns segments with their colors based on bracket state
 */
interface TextSegmentWithColor {
  text: string;
  isHighlighted: boolean;
}

function parseTextForHighlighting(text: string): TextSegmentWithColor[] {
  const segments: TextSegmentWithColor[] = [];
  let currentText = "";
  let inBracket = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === "[" || char === "\u3010") {
      // Opening bracket
      if (currentText) {
        segments.push({ text: currentText, isHighlighted: inBracket });
        currentText = "";
      }
      inBracket = true;
      currentText += char;
    } else if (char === "]" || char === "\u3011") {
      // Closing bracket
      currentText += char;
      segments.push({ text: currentText, isHighlighted: true });
      currentText = "";
      inBracket = false;
    } else {
      currentText += char;
    }
  }

  if (currentText) {
    segments.push({ text: currentText, isHighlighted: inBracket });
  }

  return segments;
}

/**
 * Measure text width accounting for emojis
 */
function measureTextWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSize: number,
): number {
  const segments = parseTextWithEmoji(text);
  let width = 0;

  for (const segment of segments) {
    if (segment.type === "text") {
      width += ctx.measureText(segment.content).width;
    } else {
      // Emoji takes approximately fontSize width
      width += fontSize;
    }
  }

  return width;
}

/**
 * Wrap text into lines that fit within maxWidth
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  fontSize: number,
): string[] {
  const lines: string[] = [];
  const paragraphs = text.split("\n");

  for (const paragraph of paragraphs) {
    if (paragraph.length === 0) {
      lines.push("");
      continue;
    }

    // Check if paragraph contains spaces (word-based wrapping)
    if (paragraph.includes(" ")) {
      const words = paragraph.split(" ");
      let currentLine = "";

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = measureTextWidth(ctx, testLine, fontSize);

        if (testWidth > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }
    } else {
      // Character-based wrapping (for CJK text)
      let currentLine = "";

      for (const char of paragraph) {
        const testLine = currentLine + char;
        const testWidth = measureTextWidth(ctx, testLine, fontSize);

        if (testWidth > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = char;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }
    }
  }

  return lines;
}

/**
 * Draw text with emoji support and bracket highlighting
 */
async function drawTextWithEmojis(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  startX: number,
  startY: number,
  fontSize: number,
  lineHeight: number,
  defaultColor: RGBColor,
  highlightColor: RGBColor,
  highlightBrackets: boolean,
): Promise<void> {
  const { shadowOffset, shadowColor } = DIALOGUE_CONFIG;
  let globalInBracket = false;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const y = startY + lineIndex * lineHeight;
    let x = startX;

    // First pass: draw shadows for all text
    const segments = parseTextWithEmoji(line);
    let shadowX = startX;

    for (const segment of segments) {
      if (segment.type === "text") {
        ctx.fillStyle = rgbToCss(shadowColor);
        ctx.fillText(
          segment.content,
          shadowX + shadowOffset.x,
          y + shadowOffset.y,
        );
        shadowX += ctx.measureText(segment.content).width;
      } else {
        // Skip emoji for shadow (emojis have their own styling)
        shadowX += fontSize;
      }
    }

    // Second pass: draw main text with colors
    for (const segment of segments) {
      if (segment.type === "text") {
        if (highlightBrackets) {
          // Parse for bracket highlighting within this text segment
          const colorSegments = parseTextForHighlighting(segment.content);

          for (const colorSegment of colorSegments) {
            // Update bracket state
            if (
              colorSegment.text.startsWith("[") ||
              colorSegment.text.startsWith("\u3010")
            ) {
              globalInBracket = true;
            }

            const color =
              colorSegment.isHighlighted || globalInBracket
                ? highlightColor
                : defaultColor;
            ctx.fillStyle = rgbToCss(color);
            ctx.fillText(colorSegment.text, x, y);
            x += ctx.measureText(colorSegment.text).width;

            if (
              colorSegment.text.endsWith("]") ||
              colorSegment.text.endsWith("\u3011")
            ) {
              globalInBracket = false;
            }
          }
        } else {
          ctx.fillStyle = rgbToCss(defaultColor);
          ctx.fillText(segment.content, x, y);
          x += ctx.measureText(segment.content).width;
        }
      } else {
        // Draw emoji
        try {
          const emojiImage = await loadEmojiImage(segment);
          if (emojiImage) {
            const emojiSize = fontSize;
            const emojiY = y - fontSize * 0.85;
            ctx.drawImage(emojiImage, x, emojiY, emojiSize, emojiSize);
          }
        } catch (error) {
          // If emoji fails to load, draw placeholder
          ctx.fillStyle = rgbToCss(defaultColor);
          ctx.fillText(segment.content, x, y);
        }
        x += fontSize;
      }
    }
  }
}

/**
 * Generate a dialogue image
 */
export async function generateDialogueImage(
  options: DialogueImageOptions,
): Promise<Buffer> {
  const {
    characterId,
    expression,
    text,
    backgroundId = "bg_001_001",
    customBackground,
    stretchMode = "zoom_x",
    fontId = "stzhongs",
    fontSize = DIALOGUE_CONFIG.defaultFontSize,
    highlightBrackets = true,
    nameLocale = FALLBACK_NAME_LOCALE,
  } = options;

  // Ensure fonts are registered
  ensureAllFontsRegistered();

  // Validate character
  const character = getCharacter(characterId);
  if (!character) {
    throw new Error(`Unknown character: ${characterId}`);
  }

  // Validate expression
  if (expression < 1 || expression > character.expressions.length) {
    throw new Error(
      `Invalid expression ${expression} for character ${characterId}. Valid range: 1-${character.expressions.length}`,
    );
  }

  // Preload emojis
  await preloadEmojis(text);

  // Create canvas
  const { canvasWidth, canvasHeight } = DIALOGUE_CONFIG;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Load and draw background
  let background: Image;
  if (customBackground) {
    background = await loadImageFromBuffer(customBackground);
  } else {
    const bgPath = getBackgroundImagePath(backgroundId);
    background = await loadImageFromPath(bgPath);
  }
  drawBackground(ctx, background, canvasWidth, canvasHeight, stretchMode);

  // Load and draw UI overlay
  const overlayPath = getDialogueOverlayPath();
  if (existsSync(overlayPath)) {
    const overlay = await loadImageFromPath(overlayPath);
    ctx.drawImage(overlay, 0, 0, canvasWidth, canvasHeight);
  }

  // Load and draw character
  const characterPath = getCharacterImagePath(characterId, expression);
  const characterImage = await loadImageFromPath(characterPath);
  ctx.drawImage(
    characterImage,
    DIALOGUE_CONFIG.characterPosition.x,
    DIALOGUE_CONFIG.characterPosition.y,
  );

  // Draw character name
  drawCharacterName(ctx, characterId, nameLocale);

  // Calculate text area
  const { textPosition, textAreaEnd, lineHeightMultiplier, defaultTextColor } =
    DIALOGUE_CONFIG;
  const maxWidth = textAreaEnd.x - textPosition.x;
  const maxHeight = textAreaEnd.y - textPosition.y;
  const lineHeight = Math.floor(fontSize * lineHeightMultiplier);
  const maxLines = Math.floor(maxHeight / lineHeight) || 1;

  // Set up font for text
  ctx.font = `${fontSize}px ${fontId}`;
  ctx.textBaseline = "alphabetic";

  // Wrap text
  let lines = wrapText(ctx, text, maxWidth, fontSize);

  // Limit to max lines
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
  }

  // Draw text with emojis and highlighting
  const startX = textPosition.x;
  const startY = textPosition.y + fontSize;

  await drawTextWithEmojis(
    ctx,
    lines,
    startX,
    startY,
    fontSize,
    lineHeight,
    defaultTextColor,
    character.themeColor,
    highlightBrackets,
  );

  // Export as PNG
  return canvas.toBuffer("image/png");
}
