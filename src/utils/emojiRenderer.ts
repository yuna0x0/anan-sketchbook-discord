/**
 * Emoji Renderer Utility
 * Provides emoji detection and rendering using Twemoji.
 * Handles parsing text for emojis and rendering them as images.
 */

import twemojiModule, { Twemoji } from "@twemoji/api";
import { loadImage, Image } from "canvas";

// Cast to proper type for runtime usage
const twemoji = twemojiModule as unknown as Twemoji;

/**
 * Cache for loaded emoji images to avoid repeated fetches
 */
const emojiImageCache = new Map<string, Image>();

/**
 * Segment type for parsed text
 */
export interface TextSegment {
  type: "text" | "emoji";
  content: string;
  codePoint?: string;
}

/**
 * Get the icon code for an emoji using twemoji's parse callback
 * This is the correct way to get the code point that matches twemoji's CDN files
 */
export function getEmojiIconCode(emoji: string): string | null {
  let iconCode: string | null = null;

  twemoji.parse(emoji, {
    callback: (icon: string) => {
      iconCode = icon;
      return false; // Return false to prevent DOM modification
    },
  });

  return iconCode;
}

/**
 * Get the Twemoji CDN URL for an emoji
 * Uses twemoji's built-in URL generation logic via parse callback
 */
export function getTwemojiUrl(
  emoji: string,
  format: "svg" | "png" = "svg",
): string | null {
  const iconCode = getEmojiIconCode(emoji);
  if (!iconCode) return null;

  if (format === "svg") {
    return `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/${iconCode}.svg`;
  } else {
    return `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/${iconCode}.png`;
  }
}

/**
 * Load a Twemoji image, with caching
 * Tries SVG first, falls back to PNG if SVG fails
 */
export async function loadTwemojiImage(emoji: string): Promise<Image | null> {
  const iconCode = getEmojiIconCode(emoji);
  if (!iconCode) {
    return null;
  }

  // Check cache first
  if (emojiImageCache.has(iconCode)) {
    return emojiImageCache.get(iconCode)!;
  }

  const urlsToTry = [
    `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/${iconCode}.svg`,
    `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/${iconCode}.png`,
  ];

  for (const url of urlsToTry) {
    try {
      const image = await loadImage(url);
      emojiImageCache.set(iconCode, image);
      return image;
    } catch {
      // Try next URL
    }
  }

  // If all fail, return null
  console.warn(`Failed to load twemoji for: ${emoji} (${iconCode})`);
  return null;
}

/**
 * Check if a string contains any emoji characters that twemoji can parse
 */
export function containsEmoji(text: string): boolean {
  return twemoji.test(text);
}

/**
 * Parse text into segments of regular text and emoji
 * Uses twemoji's replace function to properly identify emojis
 */
export function parseTextWithEmoji(text: string): TextSegment[] {
  const segments: TextSegment[] = [];

  // If no emojis, return the text as-is
  if (!twemoji.test(text)) {
    if (text.length > 0) {
      segments.push({ type: "text", content: text });
    }
    return segments;
  }

  // Use twemoji.replace to find emoji positions
  let lastIndex = 0;
  const emojiMatches: Array<{
    emoji: string;
    index: number;
    iconCode: string;
  }> = [];

  // Create a temporary string to track positions
  let tempText = text;
  let offset = 0;

  twemoji.replace(text, (emoji: string) => {
    const index = tempText.indexOf(emoji);
    if (index !== -1) {
      const iconCode = getEmojiIconCode(emoji);
      if (iconCode) {
        emojiMatches.push({
          emoji,
          index: index + offset,
          iconCode,
        });
      }
      // Replace the found emoji with a placeholder to handle duplicates
      tempText =
        tempText.substring(0, index) +
        "\0".repeat(emoji.length) +
        tempText.substring(index + emoji.length);
    }
    return emoji;
  });

  // Sort matches by index
  emojiMatches.sort((a, b) => a.index - b.index);

  // Build segments
  for (const match of emojiMatches) {
    // Add text before this emoji if any
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        content: text.slice(lastIndex, match.index),
      });
    }

    // Add the emoji
    segments.push({
      type: "emoji",
      content: match.emoji,
      codePoint: match.iconCode,
    });

    lastIndex = match.index + match.emoji.length;
  }

  // Add remaining text after last emoji
  if (lastIndex < text.length) {
    segments.push({
      type: "text",
      content: text.slice(lastIndex),
    });
  }

  return segments;
}

/**
 * Preload all emoji images found in text
 * Call this before rendering to ensure all images are cached
 */
export async function preloadEmojis(text: string): Promise<void> {
  const segments = parseTextWithEmoji(text);
  const emojiSegments = segments.filter((s) => s.type === "emoji");

  await Promise.all(emojiSegments.map((s) => loadTwemojiImage(s.content)));
}

/**
 * Clear the emoji image cache
 * Useful for memory management in long-running processes
 */
export function clearEmojiCache(): void {
  emojiImageCache.clear();
}

/**
 * Get the size of the emoji cache
 */
export function getEmojiCacheSize(): number {
  return emojiImageCache.size;
}
