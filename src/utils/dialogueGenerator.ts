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
import { FONTS, FontId } from "../config/fonts.js";
import { RGBColor } from "../config/types.js";
import type {
  CharacterInfo,
  GameDefinition,
  NameConfigLocale,
} from "../config/games/types.js";
import {
  getCharacter,
  getNameConfig,
  getCharacterNameFontForLocale,
} from "../config/games/helpers.js";
import {
  getCharacterImagePath,
  getBackgroundImagePath,
  getDialogueFontPath,
  getDialogueOverlayPath,
} from "../config/games/paths.js";
import { StretchMode } from "../config/dialogue/index.js";
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
import { parseColorSegments } from "./textWrapper.js";

// Track registered fonts
const registeredFonts = new Set<string>();

/**
 * Get font family string with fallback for dialogue text
 */
function getTextFontFamilyWithFallback(
  game: GameDefinition,
  fontId: FontId,
): string {
  const families = [fontId];

  for (const fallbackId of game.fonts.textFallbackFonts) {
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
  game: GameDefinition;
  characterId: string;
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
  game: GameDefinition,
  character: CharacterInfo,
  locale: NameConfigLocale,
): void {
  const { shadowOffset, shadowColor } = game.layout;
  const nameConfig = getNameConfig(game, character, locale);

  for (const config of nameConfig) {
    const nameFontId = getCharacterNameFontForLocale(game, locale);
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
export function wrapText(
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

        if (testWidth > maxWidth) {
          if (currentLine) {
            lines.push(currentLine);
          }
          // Check if the word itself exceeds maxWidth and needs character-based wrapping
          if (measureTextWidth(ctx, word, fontSize) > maxWidth) {
            let charLine = "";
            const wordSegments = parseTextWithEmoji(word);
            for (const seg of wordSegments) {
              if (seg.type === "text") {
                for (const char of seg.content) {
                  const charTest = charLine + char;
                  if (
                    measureTextWidth(ctx, charTest, fontSize) > maxWidth &&
                    charLine
                  ) {
                    lines.push(charLine);
                    charLine = char;
                  } else {
                    charLine = charTest;
                  }
                }
              } else {
                const charTest = charLine + seg.content;
                if (
                  measureTextWidth(ctx, charTest, fontSize) > maxWidth &&
                  charLine
                ) {
                  lines.push(charLine);
                  charLine = seg.content;
                } else {
                  charLine = charTest;
                }
              }
            }
            currentLine = charLine;
          } else {
            currentLine = word;
          }
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }
    } else {
      // Character-based wrapping (for CJK text)
      // Parse emoji segments first so Discord/Unicode emojis stay intact
      const emojiSegments = parseTextWithEmoji(paragraph);
      let currentLine = "";

      for (const segment of emojiSegments) {
        if (segment.type === "text") {
          // Wrap text characters individually
          for (const char of segment.content) {
            const testLine = currentLine + char;
            const testWidth = measureTextWidth(ctx, testLine, fontSize);

            if (testWidth > maxWidth && currentLine) {
              lines.push(currentLine);
              currentLine = char;
            } else {
              currentLine = testLine;
            }
          }
        } else {
          // Keep emoji as a single unit
          const testLine = currentLine + segment.content;
          const testWidth = measureTextWidth(ctx, testLine, fontSize);

          if (testWidth > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = segment.content;
          } else {
            currentLine = testLine;
          }
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
 * Shrink the font until the wrapped text fits the text area.
 * Only shrinks: the requested size is never exceeded, so text that already
 * fits keeps the game's authored look. Returns the largest fitting size
 * (or minFontSize when nothing fits, leaving the caller to truncate).
 */
export function fitTextToArea(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxHeight: number,
  fontFamily: string,
  requestedFontSize: number,
  minFontSize: number,
  lineHeightMultiplier: number,
): { fontSize: number; lines: string[]; lineHeight: number } {
  const measure = (size: number) => {
    ctx.font = `${size}px ${fontFamily}`;
    const lines = wrapText(ctx, text, maxWidth, size);
    const lineHeight = Math.floor(size * lineHeightMultiplier);
    const maxLines = Math.floor(maxHeight / lineHeight) || 1;
    return { lines, lineHeight, fits: lines.length <= maxLines };
  };

  const requested = measure(requestedFontSize);
  if (requested.fits || requestedFontSize <= minFontSize) {
    return {
      fontSize: requestedFontSize,
      lines: requested.lines,
      lineHeight: requested.lineHeight,
    };
  }

  // Binary search for the largest size that still fits
  let lo = Math.max(1, Math.floor(minFontSize));
  let hi = Math.floor(requestedFontSize) - 1;
  let best: { fontSize: number; lines: string[]; lineHeight: number } | null =
    null;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const result = measure(mid);
    if (result.fits) {
      best = {
        fontSize: mid,
        lines: result.lines,
        lineHeight: result.lineHeight,
      };
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  if (best) {
    return best;
  }

  // Nothing fits even at the minimum size; caller truncates the overflow
  const smallest = measure(minFontSize);
  return {
    fontSize: minFontSize,
    lines: smallest.lines,
    lineHeight: smallest.lineHeight,
  };
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
  shadowOffset: { x: number; y: number },
  shadowColor: RGBColor,
): Promise<void> {
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
          const result = parseColorSegments(
            segment.content,
            globalInBracket,
            highlightColor,
            defaultColor,
          );
          globalInBracket = result.inBracket;

          for (const colorSegment of result.segments) {
            ctx.fillStyle = rgbToCss(colorSegment.color);
            ctx.fillText(colorSegment.text, x, y);
            x += ctx.measureText(colorSegment.text).width;
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
    game,
    characterId,
    expression,
    text,
    backgroundId = game.defaultBackgroundId,
    customBackground,
    stretchMode = "zoom_x",
    fontId = game.fonts.textDefaultFont,
    fontSize = game.layout.defaultFontSize,
    highlightBrackets = true,
    nameLocale = game.fallbackNameLocale,
  } = options;

  // Ensure fonts are registered
  ensureAllFontsRegistered();

  // Validate character
  const character = getCharacter(game, characterId);
  if (!character) {
    throw new Error(`Unknown character for game ${game.id}: ${characterId}`);
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
  const { canvasWidth, canvasHeight } = game.layout;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Load and draw background
  let background: Image;
  if (customBackground) {
    background = await loadImageFromBuffer(customBackground);
  } else {
    const bgPath = getBackgroundImagePath(game, backgroundId);
    background = await loadImageFromPath(bgPath);
  }
  drawBackground(ctx, background, canvasWidth, canvasHeight, stretchMode);

  // Load and draw UI overlay
  const overlayPath = getDialogueOverlayPath(game);
  if (existsSync(overlayPath)) {
    const overlay = await loadImageFromPath(overlayPath);
    ctx.drawImage(overlay, 0, 0, canvasWidth, canvasHeight);
  }

  // Load and draw character
  const characterPath = getCharacterImagePath(game.id, characterId, expression);
  const characterImage = await loadImageFromPath(characterPath);
  ctx.drawImage(
    characterImage,
    game.layout.characterPosition.x,
    game.layout.characterPosition.y,
  );

  // Draw character name
  drawCharacterName(ctx, game, character, nameLocale);

  // Calculate text area
  const { textPosition, textAreaEnd, lineHeightMultiplier, defaultTextColor } =
    game.layout;
  const maxWidth = textAreaEnd.x - textPosition.x;
  const maxHeight = textAreaEnd.y - textPosition.y;

  // Set up font for text with fallback support
  const fontFamily = getTextFontFamilyWithFallback(game, fontId);
  ctx.textBaseline = "alphabetic";

  // Wrap text, shrinking the font when it overflows the text area
  const fitted = fitTextToArea(
    ctx,
    text,
    maxWidth,
    maxHeight,
    fontFamily,
    fontSize,
    game.layout.minFontSize,
    lineHeightMultiplier,
  );
  const drawFontSize = fitted.fontSize;
  const lineHeight = fitted.lineHeight;
  let lines = fitted.lines;
  ctx.font = `${drawFontSize}px ${fontFamily}`;

  // Limit to max lines (only reachable when even the minimum size overflows)
  const maxLines = Math.floor(maxHeight / lineHeight) || 1;
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
  }

  // Draw text with emojis and highlighting
  const startX = textPosition.x;
  const startY = textPosition.y + drawFontSize;

  await drawTextWithEmojis(
    ctx,
    lines,
    startX,
    startY,
    drawFontSize,
    lineHeight,
    defaultTextColor,
    character.themeColor,
    highlightBrackets,
    game.layout.shadowOffset,
    game.layout.shadowColor,
  );

  // Export as PNG
  return canvas.toBuffer("image/png");
}
