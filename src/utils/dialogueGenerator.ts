/**
 * Dialogue Image Generator Utility
 * Generates dialogue images with character sprites, backgrounds, and styled text.
 * Supports custom backgrounds, multiple stretch modes, and bracket text highlighting.
 */

import {
  createCanvas,
  registerFont,
  CanvasRenderingContext2D,
  Image,
} from "canvas";
import { existsSync } from "fs";
import {
  DIALOGUE_CONFIG,
  FONTS,
  FontId,
  DIALOGUE_TEXT_DEFAULT_FONT,
  DIALOGUE_TEXT_FALLBACK_FONTS,
  CharacterId,
  StretchMode,
  NameConfigLocale,
  getCharacterImagePath,
  getBackgroundImagePath,
  getDialogueFontPath,
  getDialogueOverlayPath,
  getCharacter,
  getNameConfig,
  getCharacterNameFontForLocale,
  FALLBACK_NAME_LOCALE,
} from "../config.js";
import {
  parseTextWithEmoji,
  loadEmojiImage,
  preloadEmojis,
} from "./emojiRenderer.js";
import {
  rgbToCss,
  loadImageFromPath,
  loadImageFromBuffer,
} from "./imageUtils.js";
import { RGBColor } from "../config.js";

// Track registered fonts
const registeredFonts = new Set<string>();

/**
 * Get font family string with fallback for dialogue text
 */
function getTextFontFamilyWithFallback(fontId: FontId): string {
  const families = [fontId];

  for (const fallbackId of DIALOGUE_TEXT_FALLBACK_FONTS) {
    if (fallbackId !== fontId && !families.includes(fallbackId)) {
      families.push(fallbackId);
    }
  }

  return families.join(", ");
}

/**
 * Get font family string for character name
 */
function getNameFontFamily(fontId: FontId): string {
  return fontId;
}

/**
 * Ensure a font is registered
 */
function ensureFontRegistered(fontId: FontId): void {
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
 * Ensure all fonts are registered
 */
function ensureAllFontsRegistered(): void {
  for (const fontId of Object.keys(FONTS) as FontId[]) {
    ensureFontRegistered(fontId);
  }
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
  fontId?: FontId;
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
    const nameFontId = getCharacterNameFontForLocale(locale);
    const nameFontFamily = getNameFontFamily(nameFontId);
    ctx.font = `${config.fontSize}px ${nameFontFamily}`;

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

    if (char === "[" || char === "【") {
      // Opening bracket
      if (currentText) {
        segments.push({ text: currentText, isHighlighted: inBracket });
        currentText = "";
      }
      inBracket = true;
      currentText += char;
    } else if (char === "]" || char === "】") {
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
              colorSegment.text.startsWith("【")
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
              colorSegment.text.endsWith("】")
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
    fontId = DIALOGUE_TEXT_DEFAULT_FONT,
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

  // Set up font for text with fallback support
  const fontFamily = getTextFontFamilyWithFallback(fontId);
  ctx.font = `${fontSize}px ${fontFamily}`;
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
