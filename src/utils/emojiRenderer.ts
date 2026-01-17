/**
 * Emoji Renderer Utility
 * Provides emoji detection and rendering using Twemoji and Discord custom emojis.
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
 * Regular expression to match Discord custom emojis
 * Format: <:name:id> for static emojis, <a:name:id> for animated emojis
 */
const DISCORD_EMOJI_REGEX = /<(a)?:([a-zA-Z0-9_]+):(\d+)>/g;

/**
 * Segment type for parsed text
 */
export interface TextSegment {
  type: "text" | "emoji" | "discord_emoji";
  content: string;
  codePoint?: string;
  discordEmojiId?: string;
  isAnimated?: boolean;
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
 * Check if a string contains any Discord custom emojis
 */
export function containsDiscordEmoji(text: string): boolean {
  const regex = new RegExp(DISCORD_EMOJI_REGEX.source);
  return regex.test(text);
}

/**
 * Get the Discord CDN URL for a custom emoji
 * @param emojiId The Discord emoji ID
 * @param animated Whether the emoji is animated
 * @returns The Discord CDN URL for the emoji
 */
export function getDiscordEmojiUrl(emojiId: string, animated: boolean = false): string {
  const extension = animated ? "gif" : "png";
  return `https://cdn.discordapp.com/emojis/${emojiId}.${extension}?size=96&quality=lossless`;
}

/**
 * Load a Discord emoji image, with caching
 */
export async function loadDiscordEmojiImage(emojiId: string, animated: boolean = false): Promise<Image | null> {
  const cacheKey = `discord_${emojiId}`;
  
  // Check cache first
  if (emojiImageCache.has(cacheKey)) {
    return emojiImageCache.get(cacheKey)!;
  }

  const url = getDiscordEmojiUrl(emojiId, animated);
  
  try {
    const image = await loadImage(url);
    emojiImageCache.set(cacheKey, image);
    return image;
  } catch {
    console.warn(`Failed to load Discord emoji: ${emojiId}`);
    return null;
  }
}

/**
 * Parse text into segments of regular text and emoji
 * Handles both Discord custom emojis and standard Unicode emojis (via twemoji)
 */
export function parseTextWithEmoji(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  
  // If no emojis at all, return the text as-is
  const hasDiscordEmoji = containsDiscordEmoji(text);
  const hasTwemoji = twemoji.test(text);
  
  if (!hasDiscordEmoji && !hasTwemoji) {
    if (text.length > 0) {
      segments.push({ type: "text", content: text });
    }
    return segments;
  }

  // Collect all emoji matches (both Discord and Twemoji)
  interface EmojiMatch {
    type: "emoji" | "discord_emoji";
    content: string;
    index: number;
    length: number;
    codePoint?: string;
    discordEmojiId?: string;
    isAnimated?: boolean;
  }
  
  const allMatches: EmojiMatch[] = [];
  
  // Find Discord emojis first
  const discordRegex = new RegExp(DISCORD_EMOJI_REGEX.source, "g");
  let discordMatch;
  while ((discordMatch = discordRegex.exec(text)) !== null) {
    allMatches.push({
      type: "discord_emoji",
      content: discordMatch[0],
      index: discordMatch.index,
      length: discordMatch[0].length,
      discordEmojiId: discordMatch[3],
      isAnimated: discordMatch[1] === "a",
    });
  }
  
  // Find Twemoji (Unicode emojis)
  if (hasTwemoji) {
    let tempText = text;
    let offset = 0;
    
    twemoji.replace(text, (emoji: string) => {
      const index = tempText.indexOf(emoji);
      if (index !== -1) {
        const iconCode = getEmojiIconCode(emoji);
        if (iconCode) {
          const absoluteIndex = index + offset;
          // Check if this position overlaps with any Discord emoji
          const overlapsWithDiscord = allMatches.some(
            (m) => m.type === "discord_emoji" &&
              absoluteIndex >= m.index &&
              absoluteIndex < m.index + m.length
          );
          
          if (!overlapsWithDiscord) {
            allMatches.push({
              type: "emoji",
              content: emoji,
              index: absoluteIndex,
              length: emoji.length,
              codePoint: iconCode,
            });
          }
        }
        // Replace the found emoji with a placeholder to handle duplicates
        tempText =
          tempText.substring(0, index) +
          "\0".repeat(emoji.length) +
          tempText.substring(index + emoji.length);
      }
      return emoji;
    });
  }
  
  // Sort matches by index
  allMatches.sort((a, b) => a.index - b.index);
  
  // Build segments
  let lastIndex = 0;
  for (const match of allMatches) {
    // Add text before this emoji if any
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        content: text.slice(lastIndex, match.index),
      });
    }

    // Add the emoji
    if (match.type === "discord_emoji") {
      segments.push({
        type: "discord_emoji",
        content: match.content,
        discordEmojiId: match.discordEmojiId,
        isAnimated: match.isAnimated,
      });
    } else {
      segments.push({
        type: "emoji",
        content: match.content,
        codePoint: match.codePoint,
      });
    }

    lastIndex = match.index + match.length;
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
 * Handles both Twemoji and Discord custom emojis
 */
export async function preloadEmojis(text: string): Promise<void> {
  const segments = parseTextWithEmoji(text);
  
  const loadPromises: Promise<Image | null>[] = [];
  
  for (const segment of segments) {
    if (segment.type === "emoji") {
      loadPromises.push(loadTwemojiImage(segment.content));
    } else if (segment.type === "discord_emoji" && segment.discordEmojiId) {
      loadPromises.push(loadDiscordEmojiImage(segment.discordEmojiId, segment.isAnimated));
    }
  }
  
  await Promise.all(loadPromises);
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
