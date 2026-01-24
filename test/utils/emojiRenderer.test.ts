/**
 * Emoji Renderer Tests
 * Tests for emoji detection, parsing, and URL generation utilities
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  getEmojiIconCode,
  getTwemojiUrl,
  getDiscordEmojiUrl,
  containsEmoji,
  containsDiscordEmoji,
  parseTextWithEmoji,
  isEmojiOnlyText,
  countEmojis,
  clearEmojiCache,
  getEmojiCacheSize,
  TextSegment,
} from "../../src/utils/emojiRenderer.js";

describe("emojiRenderer", () => {
  describe("getEmojiIconCode", () => {
    it("should return icon code for simple emoji", () => {
      const code = getEmojiIconCode("😀");
      assert.ok(code, "Should return a code");
      assert.equal(typeof code, "string");
    });

    it("should return icon code for flag emoji", () => {
      const code = getEmojiIconCode("🇯🇵");
      assert.ok(code, "Should return a code for flag emoji");
    });

    it("should return icon code for skin tone emoji", () => {
      const code = getEmojiIconCode("👋🏽");
      assert.ok(code, "Should return a code for skin tone emoji");
    });

    it("should return null for non-emoji text", () => {
      const code = getEmojiIconCode("hello");
      assert.equal(code, null);
    });

    it("should return null for empty string", () => {
      const code = getEmojiIconCode("");
      assert.equal(code, null);
    });
  });

  describe("getTwemojiUrl", () => {
    it("should return SVG URL by default", () => {
      const url = getTwemojiUrl("😀");
      assert.ok(url, "Should return a URL");
      assert.ok(url!.includes(".svg"), "Should be SVG format");
      assert.ok(url!.includes("cdn.jsdelivr.net"), "Should use jsDelivr CDN");
    });

    it("should return PNG URL when specified", () => {
      const url = getTwemojiUrl("😀", "png");
      assert.ok(url, "Should return a URL");
      assert.ok(url!.includes(".png"), "Should be PNG format");
      assert.ok(url!.includes("72x72"), "Should be 72x72 size");
    });

    it("should return null for non-emoji", () => {
      const url = getTwemojiUrl("hello");
      assert.equal(url, null);
    });
  });

  describe("getDiscordEmojiUrl", () => {
    it("should return static emoji URL", () => {
      const url = getDiscordEmojiUrl("123456789", false);
      assert.equal(url, "https://cdn.discordapp.com/emojis/123456789.webp");
    });

    it("should return animated emoji URL with gif", () => {
      const url = getDiscordEmojiUrl("123456789", true);
      assert.equal(url, "https://cdn.discordapp.com/emojis/123456789.gif");
    });

    it("should respect custom format", () => {
      const url = getDiscordEmojiUrl("123456789", false, "png");
      assert.equal(url, "https://cdn.discordapp.com/emojis/123456789.png");
    });
  });

  describe("containsEmoji", () => {
    it("should detect emoji in text", () => {
      assert.equal(containsEmoji("Hello 😀 World"), true);
    });

    it("should detect multiple emojis", () => {
      assert.equal(containsEmoji("😀😂🎉"), true);
    });

    it("should return false for plain text", () => {
      assert.equal(containsEmoji("Hello World"), false);
    });

    it("should return false for empty string", () => {
      assert.equal(containsEmoji(""), false);
    });

    it("should detect emoji at start", () => {
      assert.equal(containsEmoji("🎉 Party!"), true);
    });

    it("should detect emoji at end", () => {
      assert.equal(containsEmoji("Party! 🎉"), true);
    });
  });

  describe("containsDiscordEmoji", () => {
    it("should detect static Discord emoji", () => {
      assert.equal(containsDiscordEmoji("Hello <:emoji:123456789>"), true);
    });

    it("should detect animated Discord emoji", () => {
      assert.equal(containsDiscordEmoji("Hello <a:emoji:123456789>"), true);
    });

    it("should return false for regular emoji", () => {
      assert.equal(containsDiscordEmoji("Hello 😀"), false);
    });

    it("should return false for plain text", () => {
      assert.equal(containsDiscordEmoji("Hello World"), false);
    });

    it("should detect multiple Discord emojis", () => {
      assert.equal(
        containsDiscordEmoji("<:a:123> and <:b:456>"),
        true
      );
    });
  });

  describe("parseTextWithEmoji", () => {
    it("should parse plain text as single segment", () => {
      const segments = parseTextWithEmoji("Hello World");
      assert.equal(segments.length, 1);
      assert.equal(segments[0].type, "text");
      assert.equal(segments[0].content, "Hello World");
    });

    it("should parse text with emoji", () => {
      const segments = parseTextWithEmoji("Hello 😀 World");
      assert.ok(segments.length >= 3, "Should have at least 3 segments");

      // Find the emoji segment
      const emojiSegment = segments.find((s) => s.type === "emoji");
      assert.ok(emojiSegment, "Should have an emoji segment");
      assert.equal(emojiSegment!.content, "😀");
    });

    it("should parse Discord emoji", () => {
      const segments = parseTextWithEmoji("Hello <:test:123456789> World");
      assert.ok(segments.length >= 3, "Should have at least 3 segments");

      const discordSegment = segments.find((s) => s.type === "discord_emoji");
      assert.ok(discordSegment, "Should have a discord_emoji segment");
      assert.equal(discordSegment!.discordEmojiId, "123456789");
    });

    it("should parse animated Discord emoji", () => {
      const segments = parseTextWithEmoji("Test <a:animated:987654321>");

      const discordSegment = segments.find((s) => s.type === "discord_emoji");
      assert.ok(discordSegment, "Should have a discord_emoji segment");
      assert.equal(discordSegment!.discordEmojiId, "987654321");
      assert.equal(discordSegment!.discordEmojiAnimated, true);
    });

    it("should parse mixed emojis", () => {
      const segments = parseTextWithEmoji("😀 <:test:123> 🎉");

      const emojiCount = segments.filter(
        (s) => s.type === "emoji" || s.type === "discord_emoji"
      ).length;
      assert.ok(emojiCount >= 3, "Should have at least 3 emoji segments");
    });

    it("should handle empty string", () => {
      const segments = parseTextWithEmoji("");
      assert.equal(segments.length, 0);
    });

    it("should handle emoji-only text", () => {
      const segments = parseTextWithEmoji("😀");
      assert.equal(segments.length, 1);
      assert.equal(segments[0].type, "emoji");
    });
  });

  describe("isEmojiOnlyText", () => {
    it("should return true for single emoji", () => {
      assert.equal(isEmojiOnlyText("😀"), true);
    });

    it("should return true for multiple emojis (up to 4)", () => {
      assert.equal(isEmojiOnlyText("😀😂"), true);
      assert.equal(isEmojiOnlyText("😀😂🎉"), true);
      assert.equal(isEmojiOnlyText("😀😂🎉👋"), true);
    });

    it("should return false for more than 4 emojis", () => {
      assert.equal(isEmojiOnlyText("😀😂🎉👋🔥"), false);
    });

    it("should return false for text with emojis", () => {
      assert.equal(isEmojiOnlyText("Hello 😀"), false);
    });

    it("should return false for plain text", () => {
      assert.equal(isEmojiOnlyText("Hello World"), false);
    });

    it("should return true for emojis with whitespace", () => {
      assert.equal(isEmojiOnlyText("😀 😂"), true);
    });

    it("should return true for Discord emoji only", () => {
      assert.equal(isEmojiOnlyText("<:test:123456789>"), true);
    });

    it("should return true for mixed emoji types", () => {
      assert.equal(isEmojiOnlyText("😀 <:test:123>"), true);
    });
  });

  describe("countEmojis", () => {
    it("should count zero for plain text", () => {
      assert.equal(countEmojis("Hello World"), 0);
    });

    it("should count single emoji", () => {
      assert.equal(countEmojis("😀"), 1);
    });

    it("should count multiple emojis", () => {
      assert.equal(countEmojis("😀😂🎉"), 3);
    });

    it("should count Discord emojis", () => {
      assert.equal(countEmojis("<:test:123>"), 1);
    });

    it("should count mixed emojis", () => {
      assert.equal(countEmojis("😀 <:test:123> 🎉"), 3);
    });

    it("should count emojis in text", () => {
      assert.equal(countEmojis("Hello 😀 World 🎉"), 2);
    });
  });

  describe("emoji cache", () => {
    it("should start with empty cache or preserve existing", () => {
      const initialSize = getEmojiCacheSize();
      assert.ok(initialSize >= 0, "Cache size should be non-negative");
    });

    it("should clear cache", () => {
      clearEmojiCache();
      assert.equal(getEmojiCacheSize(), 0);
    });
  });
});
