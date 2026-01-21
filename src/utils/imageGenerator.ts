/**
 * Image Generator Utility
 * Generates sketchbook images with text and/or images drawn on them.
 * Ported from the Python implementation with adaptations for Node.js canvas.
 */

import { createCanvas, registerFont, CanvasRenderingContext2D } from "canvas";
import { existsSync } from "fs";
import {
  SKETCHBOOK_CONFIG,
  getAssetPath,
  getEmotionImagePath,
  EmotionTypeValue,
  EmotionType,
} from "../config.js";
import {
  wrapText,
  measureTextBlock,
  parseColorSegments,
  measureTextWidth,
  WrapAlgorithm,
} from "./textWrapper.js";
import {
  parseTextWithEmoji,
  loadEmojiImage,
  preloadEmojis,
  isEmojiOnlyText,
  countEmojis,
} from "./emojiRenderer.js";
import {
  rgbToCss,
  loadImageFromPath,
  loadImageFromBuffer,
} from "./imageUtils.js";
import { RGBColor } from "../config.js";

/**
 * Horizontal alignment options
 */
export type HAlign = "left" | "center" | "right";

/**
 * Vertical alignment options
 */
export type VAlign = "top" | "middle" | "bottom";

// Flag to track if font has been registered
let fontRegistered = false;

/**
 * Options for generating sketchbook image with text
 */
export interface TextImageOptions {
  emotion?: EmotionTypeValue;
  text: string;
  textColor?: RGBColor;
  bracketColor?: RGBColor;
  maxFontHeight?: number;
  align?: HAlign;
  valign?: VAlign;
  lineSpacing?: number;
  wrapAlgorithm?: WrapAlgorithm;
  useOverlay?: boolean;
}

/**
 * Options for generating sketchbook image with an image pasted
 */
export interface PasteImageOptions {
  emotion?: EmotionTypeValue;
  contentImage: Buffer;
  align?: HAlign;
  valign?: VAlign;
  padding?: number;
  allowUpscale?: boolean;
  useOverlay?: boolean;
}

/**
 * Options for generating sketchbook image with both text and image
 */
export interface CombinedImageOptions {
  emotion?: EmotionTypeValue;
  text: string;
  contentImage: Buffer;
  textColor?: RGBColor;
  bracketColor?: RGBColor;
  maxFontHeight?: number;
  align?: HAlign;
  valign?: VAlign;
  lineSpacing?: number;
  wrapAlgorithm?: WrapAlgorithm;
  padding?: number;
  allowUpscale?: boolean;
  useOverlay?: boolean;
}

/**
 * Register the custom font for text rendering
 */
function ensureFontRegistered(): void {
  if (fontRegistered) {
    return;
  }

  const fontPath = getAssetPath(SKETCHBOOK_CONFIG.fontFile);
  if (existsSync(fontPath)) {
    registerFont(fontPath, { family: "SketchbookFont" });
    fontRegistered = true;
  }
}

/**
 * Find the optimal font size that fits text within the given dimensions
 */
/**
 * Find optimal font size for emoji-only content
 * Renders emojis at a much larger size since there's no text to wrap
 */
function findOptimalEmojiOnlyFontSize(
  text: string,
  maxWidth: number,
  maxHeight: number,
): {
  fontSize: number;
  lines: string[];
  lineHeight: number;
  blockHeight: number;
} {
  const emojiCount = countEmojis(text);

  if (emojiCount === 1) {
    const size = Math.min(maxWidth, maxHeight) * 0.8;
    return {
      fontSize: size,
      lines: [text.trim()],
      lineHeight: size,
      blockHeight: size,
    };
  }

  const spacing = 8;
  const totalSpacing = (emojiCount - 1) * spacing;
  const availableWidth = maxWidth - totalSpacing;
  const sizeByWidth = availableWidth / emojiCount;
  const sizeByHeight = maxHeight * 0.8;
  const size = Math.min(sizeByWidth, sizeByHeight);

  return {
    fontSize: size,
    lines: [text.trim()],
    lineHeight: size,
    blockHeight: size,
  };
}

function findOptimalFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxHeight: number,
  maxFontSize: number,
  lineSpacing: number,
  wrapAlgorithm: WrapAlgorithm,
): {
  fontSize: number;
  lines: string[];
  lineHeight: number;
  blockHeight: number;
} {
  if (isEmojiOnlyText(text)) {
    return findOptimalEmojiOnlyFontSize(text, maxWidth, maxHeight);
  }

  let lo = 1;
  let hi = Math.min(maxHeight, maxFontSize);
  let bestSize = 0;
  let bestLines: string[] = [];
  let bestLineHeight = 0;
  let bestBlockHeight = 0;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    ctx.font = `${mid}px SketchbookFont`;

    const lines = wrapText(ctx, text, maxWidth, wrapAlgorithm, mid);
    const { width, height, lineHeight } = measureTextBlock(
      ctx,
      lines,
      mid,
      lineSpacing,
      true, // Enable emoji-aware measurement for Discord emojis
    );

    if (width <= maxWidth && height <= maxHeight) {
      bestSize = mid;
      bestLines = lines;
      bestLineHeight = lineHeight;
      bestBlockHeight = height;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  // Fallback to minimum size if nothing fits
  if (bestSize === 0) {
    ctx.font = `1px SketchbookFont`;
    bestLines = wrapText(ctx, text, maxWidth, wrapAlgorithm, 1);
    bestSize = 1;
    bestLineHeight = 1;
    bestBlockHeight = 1;
  }

  return {
    fontSize: bestSize,
    lines: bestLines,
    lineHeight: bestLineHeight,
    blockHeight: bestBlockHeight,
  };
}

/**
 * Draw text on a canvas with color segments
 */
function drawTextWithColors(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  startX: number,
  startY: number,
  regionWidth: number,
  lineHeight: number,
  align: HAlign,
  textColor: RGBColor,
  bracketColor: RGBColor,
): void {
  let y = startY;
  let inBracket = false;

  for (const line of lines) {
    const lineWidth = measureTextWidth(ctx, line);

    // Calculate X position based on alignment
    let x: number;
    if (align === "left") {
      x = startX;
    } else if (align === "center") {
      x = startX + (regionWidth - lineWidth) / 2;
    } else {
      x = startX + regionWidth - lineWidth;
    }

    // Parse and draw colored segments
    const { segments, inBracket: newInBracket } = parseColorSegments(
      line,
      inBracket,
      bracketColor,
      textColor,
    );
    inBracket = newInBracket;

    for (const segment of segments) {
      if (segment.text) {
        ctx.fillStyle = rgbToCss(segment.color);
        ctx.fillText(segment.text, x, y);
        x += measureTextWidth(ctx, segment.text);
      }
    }

    y += lineHeight;
  }
}

/**
 * Calculate the width of text including emoji placeholders
 * Emojis are rendered at the same size as the font height
 * In emoji-only mode, adds spacing between emojis
 */
function measureTextWithEmoji(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSize: number,
): number {
  const segments = parseTextWithEmoji(text);
  const emojiOnly = isEmojiOnlyText(text);
  const emojiSpacing = emojiOnly ? 8 : 0;
  let width = 0;
  let emojiIndex = 0;

  for (const segment of segments) {
    if (segment.type === "emoji" || segment.type === "discord_emoji") {
      if (emojiOnly && emojiIndex > 0) {
        width += emojiSpacing;
      }
      width += fontSize;
      emojiIndex++;
    } else {
      width += measureTextWidth(ctx, segment.content);
    }
  }

  return width;
}

/**
 * Draw text on a canvas with color segments and emoji support
 * Supports both Twemoji and Discord custom emojis rendered as images at the appropriate size
 * In emoji-only mode, renders emojis larger with spacing between them
 */
async function drawTextWithEmojis(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  startX: number,
  startY: number,
  regionWidth: number,
  lineHeight: number,
  fontSize: number,
  align: HAlign,
  textColor: RGBColor,
  bracketColor: RGBColor,
): Promise<void> {
  let y = startY;
  let inBracket = false;

  // Preload all emojis first
  for (const line of lines) {
    await preloadEmojis(line);
  }

  // Check if this is emoji-only content for special rendering
  const emojiOnly = lines.length === 1 && isEmojiOnlyText(lines[0]);
  const emojiSpacing = emojiOnly ? 8 : 0;

  for (const line of lines) {
    // Calculate line width including emojis
    const lineWidth = measureTextWithEmoji(ctx, line, fontSize);

    // Calculate X position based on alignment
    let x: number;
    if (align === "left") {
      x = startX;
    } else if (align === "center") {
      x = startX + (regionWidth - lineWidth) / 2;
    } else {
      x = startX + regionWidth - lineWidth;
    }

    // Parse and draw colored segments with emoji support
    const { segments, inBracket: newInBracket } = parseColorSegments(
      line,
      inBracket,
      bracketColor,
      textColor,
    );
    inBracket = newInBracket;

    let emojiIndex = 0;

    for (const segment of segments) {
      if (segment.text) {
        // Parse this segment for emojis
        const emojiSegments = parseTextWithEmoji(segment.text);

        for (const emojiSegment of emojiSegments) {
          if (
            emojiSegment.type === "emoji" ||
            emojiSegment.type === "discord_emoji"
          ) {
            // Add spacing between emojis in emoji-only mode
            if (emojiOnly && emojiIndex > 0) {
              x += emojiSpacing;
            }

            // Draw emoji as image (works for both Twemoji and Discord emojis)
            const emojiImage = await loadEmojiImage(emojiSegment);
            if (emojiImage) {
              const emojiSize = fontSize;
              // In emoji-only mode, no Y offset needed (already centered)
              // For mixed content, add offset to align with text baseline
              const emojiYOffset = emojiOnly ? 0 : fontSize * 0.25;
              ctx.drawImage(
                emojiImage,
                x,
                y + emojiYOffset,
                emojiSize,
                emojiSize,
              );
            }
            x += fontSize;
            emojiIndex++;
          } else {
            // Draw regular text
            ctx.fillStyle = rgbToCss(segment.color);
            ctx.fillText(emojiSegment.content, x, y);
            x += measureTextWidth(ctx, emojiSegment.content);
          }
        }
      }
    }

    y += lineHeight;
  }
}

/**
 * Calculate scaled dimensions while maintaining aspect ratio
 */
function calculateScaledDimensions(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number,
  allowUpscale: boolean,
): { width: number; height: number } {
  const scaleW = maxWidth / srcWidth;
  const scaleH = maxHeight / srcHeight;
  let scale = Math.min(scaleW, scaleH);

  if (!allowUpscale) {
    scale = Math.min(1.0, scale);
  }

  return {
    width: Math.max(1, Math.round(srcWidth * scale)),
    height: Math.max(1, Math.round(srcHeight * scale)),
  };
}

/**
 * Check if an image is vertical (portrait orientation)
 */
function isVerticalImage(
  width: number,
  height: number,
  ratio: number = 1,
): boolean {
  return height * ratio > width;
}

/**
 * Generate a sketchbook image with text
 */
export async function generateTextImage(
  options: TextImageOptions,
): Promise<Buffer> {
  ensureFontRegistered();

  const {
    emotion = EmotionType.NORMAL,
    text,
    textColor = SKETCHBOOK_CONFIG.defaultTextColor,
    bracketColor = SKETCHBOOK_CONFIG.bracketTextColor,
    maxFontHeight = SKETCHBOOK_CONFIG.maxFontHeight,
    align = "center",
    valign = "middle",
    lineSpacing = SKETCHBOOK_CONFIG.lineSpacing,
    wrapAlgorithm = "greedy",
    useOverlay = true,
  } = options;

  // Load base image
  const baseImagePath = getEmotionImagePath(emotion);
  const baseImage = await loadImageFromPath(baseImagePath);

  // Create canvas with base image dimensions
  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");

  // Draw base image
  ctx.drawImage(baseImage, 0, 0);

  // Get text region coordinates
  const { textBoxTopLeft, textBoxBottomRight } = SKETCHBOOK_CONFIG;
  const regionX = textBoxTopLeft.x;
  const regionY = textBoxTopLeft.y;
  const regionWidth = textBoxBottomRight.x - textBoxTopLeft.x;
  const regionHeight = textBoxBottomRight.y - textBoxTopLeft.y;

  // Find optimal font size and wrap text
  const { fontSize, lines, lineHeight, blockHeight } = findOptimalFontSize(
    ctx,
    text,
    regionWidth,
    regionHeight,
    maxFontHeight,
    lineSpacing,
    wrapAlgorithm,
  );

  // Set final font
  ctx.font = `${fontSize}px SketchbookFont`;
  ctx.textBaseline = "top";

  // Calculate vertical starting position
  let yStart: number;
  if (valign === "top") {
    yStart = regionY;
  } else if (valign === "middle") {
    yStart = regionY + (regionHeight - blockHeight) / 2;
  } else {
    yStart = regionY + regionHeight - blockHeight;
  }

  // Draw text with emoji support
  await drawTextWithEmojis(
    ctx,
    lines,
    regionX,
    yStart,
    regionWidth,
    lineHeight,
    fontSize,
    align,
    textColor,
    bracketColor,
  );

  // Apply overlay if enabled
  if (useOverlay) {
    const overlayPath = getAssetPath(SKETCHBOOK_CONFIG.overlayImage);
    if (existsSync(overlayPath)) {
      const overlayImage = await loadImageFromPath(overlayPath);
      ctx.drawImage(overlayImage, 0, 0);
    }
  }

  // Return as PNG buffer
  return canvas.toBuffer("image/png");
}

/**
 * Generate a sketchbook image with a pasted image
 */
export async function generatePastedImage(
  options: PasteImageOptions,
): Promise<Buffer> {
  const {
    emotion = EmotionType.NORMAL,
    contentImage,
    align = "center",
    valign = "middle",
    padding = SKETCHBOOK_CONFIG.imagePadding,
    allowUpscale = true,
    useOverlay = true,
  } = options;

  // Load base image
  const baseImagePath = getEmotionImagePath(emotion);
  const baseImage = await loadImageFromPath(baseImagePath);

  // Load content image
  const content = await loadImageFromBuffer(contentImage);

  // Create canvas with base image dimensions
  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");

  // Draw base image
  ctx.drawImage(baseImage, 0, 0);

  // Get paste region coordinates
  const { textBoxTopLeft, textBoxBottomRight } = SKETCHBOOK_CONFIG;
  const regionX = textBoxTopLeft.x + padding;
  const regionY = textBoxTopLeft.y + padding;
  const regionWidth = Math.max(
    1,
    textBoxBottomRight.x - textBoxTopLeft.x - 2 * padding,
  );
  const regionHeight = Math.max(
    1,
    textBoxBottomRight.y - textBoxTopLeft.y - 2 * padding,
  );

  // Calculate scaled dimensions
  const { width: newWidth, height: newHeight } = calculateScaledDimensions(
    content.width,
    content.height,
    regionWidth,
    regionHeight,
    allowUpscale,
  );

  // Calculate paste position based on alignment
  let px: number;
  if (align === "left") {
    px = regionX;
  } else if (align === "center") {
    px = regionX + (regionWidth - newWidth) / 2;
  } else {
    px = regionX + regionWidth - newWidth;
  }

  let py: number;
  if (valign === "top") {
    py = regionY;
  } else if (valign === "middle") {
    py = regionY + (regionHeight - newHeight) / 2;
  } else {
    py = regionY + regionHeight - newHeight;
  }

  // Draw scaled content image
  ctx.drawImage(content, px, py, newWidth, newHeight);

  // Apply overlay if enabled
  if (useOverlay) {
    const overlayPath = getAssetPath(SKETCHBOOK_CONFIG.overlayImage);
    if (existsSync(overlayPath)) {
      const overlayImage = await loadImageFromPath(overlayPath);
      ctx.drawImage(overlayImage, 0, 0);
    }
  }

  // Return as PNG buffer
  return canvas.toBuffer("image/png");
}

/**
 * Generate a sketchbook image with both text and an image
 * Layout is determined by image orientation (vertical = side by side, horizontal = stacked)
 */
export async function generateCombinedImage(
  options: CombinedImageOptions,
): Promise<Buffer> {
  ensureFontRegistered();

  const {
    emotion = EmotionType.NORMAL,
    text,
    contentImage,
    textColor = SKETCHBOOK_CONFIG.defaultTextColor,
    bracketColor = SKETCHBOOK_CONFIG.bracketTextColor,
    maxFontHeight = SKETCHBOOK_CONFIG.maxFontHeight,
    align = "center",
    valign = "middle",
    lineSpacing = SKETCHBOOK_CONFIG.lineSpacing,
    wrapAlgorithm = "greedy",
    padding = SKETCHBOOK_CONFIG.imagePadding,
    allowUpscale = true,
    useOverlay = true,
  } = options;

  // Load base image
  const baseImagePath = getEmotionImagePath(emotion);
  const baseImage = await loadImageFromPath(baseImagePath);

  // Load content image
  const content = await loadImageFromBuffer(contentImage);

  // Create canvas with base image dimensions
  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");

  // Draw base image
  ctx.drawImage(baseImage, 0, 0);

  // Get region coordinates
  const { textBoxTopLeft, textBoxBottomRight } = SKETCHBOOK_CONFIG;
  const x1 = textBoxTopLeft.x;
  const y1 = textBoxTopLeft.y;
  const x2 = textBoxBottomRight.x;
  const y2 = textBoxBottomRight.y;
  const regionWidth = x2 - x1;
  const regionHeight = y2 - y1;

  // Determine layout based on image orientation
  const ratio = regionWidth / regionHeight;
  const isVertical = isVerticalImage(content.width, content.height, ratio);

  if (isVertical) {
    // Side by side layout: image on left, text on right
    const spacing = 10;
    const leftWidth = Math.floor(regionWidth / 2 - spacing / 2);
    const rightWidth = regionWidth - leftWidth - spacing;

    // Draw image on left side
    const leftRegionRight = x1 + leftWidth;
    const imgRegionWidth = Math.max(1, leftWidth - 2 * padding);
    const imgRegionHeight = Math.max(1, regionHeight - 2 * padding);

    const { width: newWidth, height: newHeight } = calculateScaledDimensions(
      content.width,
      content.height,
      imgRegionWidth,
      imgRegionHeight,
      allowUpscale,
    );

    // Center image in left region
    const imgX = x1 + padding + (imgRegionWidth - newWidth) / 2;
    const imgY = y1 + padding + (imgRegionHeight - newHeight) / 2;
    ctx.drawImage(content, imgX, imgY, newWidth, newHeight);

    // Draw text on right side
    const rightRegionLeft = leftRegionRight + spacing;
    const textRegionWidth = rightWidth;

    const { fontSize, lines, lineHeight, blockHeight } = findOptimalFontSize(
      ctx,
      text,
      textRegionWidth,
      regionHeight,
      maxFontHeight,
      lineSpacing,
      wrapAlgorithm,
    );

    ctx.font = `${fontSize}px SketchbookFont`;
    ctx.textBaseline = "top";

    let yStart: number;
    if (valign === "top") {
      yStart = y1;
    } else if (valign === "middle") {
      yStart = y1 + (regionHeight - blockHeight) / 2;
    } else {
      yStart = y1 + regionHeight - blockHeight;
    }

    await drawTextWithEmojis(
      ctx,
      lines,
      rightRegionLeft,
      yStart,
      textRegionWidth,
      lineHeight,
      fontSize,
      align,
      textColor,
      bracketColor,
    );
  } else {
    // Stacked layout: image on top, text on bottom
    const estimatedTextHeight = Math.min(Math.floor(regionHeight / 2), 100);
    const imageRegionHeight = regionHeight - estimatedTextHeight;

    // Draw image on top
    const imgRegionWidth = Math.max(1, regionWidth - 2 * padding);
    const imgRegionHeight = Math.max(1, imageRegionHeight - 2 * padding);

    const { width: newWidth, height: newHeight } = calculateScaledDimensions(
      content.width,
      content.height,
      imgRegionWidth,
      imgRegionHeight,
      allowUpscale,
    );

    // Center image in top region
    const imgX = x1 + padding + (imgRegionWidth - newWidth) / 2;
    const imgY = y1 + padding + (imgRegionHeight - newHeight) / 2;
    ctx.drawImage(content, imgX, imgY, newWidth, newHeight);

    // Draw text on bottom
    const textRegionTop = y1 + imageRegionHeight;
    const textRegionHeight = estimatedTextHeight;

    const { fontSize, lines, lineHeight, blockHeight } = findOptimalFontSize(
      ctx,
      text,
      regionWidth,
      textRegionHeight,
      maxFontHeight,
      lineSpacing,
      wrapAlgorithm,
    );

    ctx.font = `${fontSize}px SketchbookFont`;
    ctx.textBaseline = "top";

    let yStart: number;
    if (valign === "top") {
      yStart = textRegionTop;
    } else if (valign === "middle") {
      yStart = textRegionTop + (textRegionHeight - blockHeight) / 2;
    } else {
      yStart = textRegionTop + textRegionHeight - blockHeight;
    }

    await drawTextWithEmojis(
      ctx,
      lines,
      x1,
      yStart,
      regionWidth,
      lineHeight,
      fontSize,
      align,
      textColor,
      bracketColor,
    );
  }

  // Apply overlay if enabled
  if (useOverlay) {
    const overlayPath = getAssetPath(SKETCHBOOK_CONFIG.overlayImage);
    if (existsSync(overlayPath)) {
      const overlayImage = await loadImageFromPath(overlayPath);
      ctx.drawImage(overlayImage, 0, 0);
    }
  }

  // Return as PNG buffer
  return canvas.toBuffer("image/png");
}

/**
 * Generate a sketchbook image based on the provided content
 * Automatically determines which generation method to use
 */
export async function generateSketchbookImage(options: {
  emotion?: EmotionTypeValue;
  text?: string;
  contentImage?: Buffer;
  textColor?: RGBColor;
  bracketColor?: RGBColor;
  maxFontHeight?: number;
  align?: HAlign;
  valign?: VAlign;
  lineSpacing?: number;
  wrapAlgorithm?: WrapAlgorithm;
  padding?: number;
  allowUpscale?: boolean;
  useOverlay?: boolean;
}): Promise<Buffer> {
  const { text, contentImage, ...restOptions } = options;

  // Determine which generation method to use
  if (text && contentImage) {
    return generateCombinedImage({
      text,
      contentImage,
      ...restOptions,
    });
  } else if (contentImage) {
    return generatePastedImage({
      contentImage,
      ...restOptions,
    });
  } else if (text) {
    return generateTextImage({
      text,
      ...restOptions,
    });
  } else {
    throw new Error("Either text or contentImage must be provided");
  }
}
