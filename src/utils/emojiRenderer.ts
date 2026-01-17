/**
 * Emoji Renderer Utility
 * Provides emoji detection and rendering using Twemoji and Discord CDN.
 * Handles parsing text for emojis and rendering them as images.
 * Supports both standard Unicode emojis (via Twemoji) and Discord custom emojis.
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
 * Discord custom emoji regex pattern
 * Matches both static <:name:id> and animated <a:name:id> formats
 */
const DISCORD_EMOJI_REGEX = /<(a?):(\w+):(\d+)>/g;

/**
 * Segment type for parsed text
 */
export interface TextSegment {
  type: "text" | "emoji" | "discord_emoji";
  content: string;
  codePoint?: string;
  discordEmojiId?: string;
  discordEmojiAnimated?: boolean;
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
 * Get the Discord CDN URL for a custom emoji
 * @param id - The emoji ID (snowflake)
 * @param animated - Whether the emoji is animated
 * @param format - The image format (defaults to webp for static, gif for animated)
 */
export function getDiscordEmojiUrl(
  id: string,
  animated: boolean = false,
  format?: "png" | "webp" | "gif",
): string {
  // Default format: gif for animated, webp for static
  const ext = format ?? (animated ? "gif" : "webp");
  return `https://cdn.discordapp.com/emojis/${id}.${ext}`;
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

  const cacheKey = `twemoji:${iconCode}`;

  // Check cache first
  if (emojiImageCache.has(cacheKey)) {
    return emojiImageCache.get(cacheKey)!;
  }

  const urlsToTry = [
    `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/${iconCode}.svg`,
    `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/${iconCode}.png`,
  ];

  for (const url of urlsToTry) {
    try {
      const image = await loadImage(url);
      emojiImageCache.set(cacheKey, image);
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
 * Load a Discord custom emoji image, with caching
 * Tries webp/gif first, falls back to png if that fails
 */
export async function loadDiscordEmojiImage(
  id: string,
  animated: boolean = false,
): Promise<Image | null> {
  const cacheKey = `discord:${id}`;

  // Check cache first
  if (emojiImageCache.has(cacheKey)) {
    return emojiImageCache.get(cacheKey)!;
  }

  const urlsToTry = animated
    ? [
        getDiscordEmojiUrl(id, true, "gif"),
        getDiscordEmojiUrl(id, false, "png"),
      ]
    : [
        getDiscordEmojiUrl(id, false, "webp"),
        getDiscordEmojiUrl(id, false, "png"),
      ];

  for (const url of urlsToTry) {
    try {
      const image = await loadImage(url);
      emojiImageCache.set(cacheKey, image);
      return image;
    } catch {
      // Try next URL
    }
  }

  // If all fail, return null
  console.warn(`Failed to load Discord emoji: ${id}`);
  return null;
}

/**
 * Check if a string contains any emoji characters that twemoji can parse
 */
export function containsEmoji(text: string): boolean {
  return twemoji.test(text);
}

/**
 * Check if a string contains any Discord custom emojis
 */
export function containsDiscordEmoji(text: string): boolean {
  // Reset regex state
  DISCORD_EMOJI_REGEX.lastIndex = 0;
  return DISCORD_EMOJI_REGEX.test(text);
}

/**
 * Parse Discord custom emojis from text
 * Returns an array of matches with their positions
 */
function parseDiscordEmojis(text: string): Array<{
  fullMatch: string;
  animated: boolean;
  name: string;
  id: string;
  index: number;
}> {
  const matches: Array<{
    fullMatch: string;
    animated: boolean;
    name: string;
    id: string;
    index: number;
  }> = [];

  // Reset regex state before using
  DISCORD_EMOJI_REGEX.lastIndex = 0;

  let match;
  while ((match = DISCORD_EMOJI_REGEX.exec(text)) !== null) {
    matches.push({
      fullMatch: match[0],
      animated: match[1] === "a",
      name: match[2],
      id: match[3],
      index: match.index,
    });
  }

  return matches;
}

/**
 * Parse text into segments of regular text, twemoji, and Discord emoji
 * Discord emojis are parsed first, then twemoji is applied to remaining text
 */
export function parseTextWithEmoji(text: string): TextSegment[] {
  const segments: TextSegment[] = [];

  // First, find all Discord emojis
  const discordMatches = parseDiscordEmojis(text);

  // If no Discord emojis, check for twemoji only
  if (discordMatches.length === 0) {
    return parseTwemojiOnly(text);
  }

  // Process text with Discord emojis
  let lastIndex = 0;

  for (const match of discordMatches) {
    // Process text before this Discord emoji (may contain twemoji)
    if (match.index > lastIndex) {
      const beforeText = text.slice(lastIndex, match.index);
      const beforeSegments = parseTwemojiOnly(beforeText);
      segments.push(...beforeSegments);
    }

    // Add the Discord emoji segment
    segments.push({
      type: "discord_emoji",
      content: match.fullMatch,
      discordEmojiId: match.id,
      discordEmojiAnimated: match.animated,
    });

    lastIndex = match.index + match.fullMatch.length;
  }

  // Process remaining text after last Discord emoji
  if (lastIndex < text.length) {
    const afterText = text.slice(lastIndex);
    const afterSegments = parseTwemojiOnly(afterText);
    segments.push(...afterSegments);
  }

  return segments;
}

/**
 * Parse text for twemoji only (no Discord emoji handling)
 * This is used internally after Discord emojis have been extracted
 */
function parseTwemojiOnly(text: string): TextSegment[] {
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
 * Load emoji image based on segment type
 * Works for both Twemoji and Discord custom emojis
 */
export async function loadEmojiImage(
  segment: TextSegment,
): Promise<Image | null> {
  if (segment.type === "emoji") {
    return loadTwemojiImage(segment.content);
  } else if (segment.type === "discord_emoji") {
    if (segment.discordEmojiId) {
      return loadDiscordEmojiImage(
        segment.discordEmojiId,
        segment.discordEmojiAnimated ?? false,
      );
    }
  }
  return null;
}

/**
 * Preload all emoji images found in text
 * Call this before rendering to ensure all images are cached
 */
export async function preloadEmojis(text: string): Promise<void> {
  const segments = parseTextWithEmoji(text);
  const emojiSegments = segments.filter(
    (s) => s.type === "emoji" || s.type === "discord_emoji",
  );

  await Promise.all(emojiSegments.map((s) => loadEmojiImage(s)));
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

/**
 * Count the number of emojis in text
 * Returns the total count of both Twemoji and Discord custom emojis
 */
export function countEmojis(text: string): number {
  const segments = parseTextWithEmoji(text);
  return segments.filter(
    (s) => s.type === "emoji" || s.type === "discord_emoji",
  ).length;
}

/**
 * Check if text is primarily emojis (emoji-only mode)
 * Returns true if text contains 1-4 emojis and very little/no other text
 * Used to determine if emojis should be rendered at a larger size
 */
export function isEmojiOnlyText(text: string): boolean {
  const segments = parseTextWithEmoji(text);

  let emojiCount = 0;
  let textLength = 0;

  for (const segment of segments) {
    if (segment.type === "emoji" || segment.type === "discord_emoji") {
      emojiCount++;
    } else {
      const trimmed = segment.content.replace(/\s/g, "");
      textLength += trimmed.length;
    }
  }

  if (emojiCount === 0) {
    return false;
  }

  if (emojiCount > 4) {
    return false;
  }

  if (textLength > 0) {
    return false;
  }

  return true;
}
