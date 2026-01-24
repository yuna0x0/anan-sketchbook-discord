/**
 * Sketchbook Messages Localizations
 * Contains sketchbook-specific response messages
 */

import { Locale } from "discord.js";
import { LocaleRecord, getLocalized } from "../types.js";

// =============================================================================
// Sketchbook Messages
// =============================================================================

export const SKETCHBOOK_MESSAGES = {
  noInput: {
    [Locale.EnglishUS]:
      "Please provide either text or an image (or both) to generate the sketchbook image.",
    [Locale.EnglishGB]:
      "Please provide either text or an image (or both) to generate the sketchbook image.",
    [Locale.ChineseTW]: "請提供文字或圖片（或兩者皆可）來生成素描本圖片。",
    [Locale.ChineseCN]: "请提供文字或图片（或两者皆可）来生成素描本图片。",
    [Locale.Japanese]:
      "スケッチブック画像を生成するには、テキストまたは画像（または両方）を提供してください。",
  } as LocaleRecord,
} as const;

export function getSketchbookMessage(
  key: keyof typeof SKETCHBOOK_MESSAGES,
  locale: string,
): string {
  const messages = SKETCHBOOK_MESSAGES[key];
  return getLocalized(messages, locale, "") ?? "";
}

// =============================================================================
// Attachment Description
// =============================================================================

export const SKETCHBOOK_ATTACHMENT_DESCRIPTION = {
  withText: {
    [Locale.EnglishUS]: "Sketchbook with text: ",
    [Locale.EnglishGB]: "Sketchbook with text: ",
    [Locale.ChineseTW]: "素描本上的文字：",
    [Locale.ChineseCN]: "素描本上的文字：",
    [Locale.Japanese]: "スケッチブックのテキスト：",
  } as LocaleRecord,
  withImage: {
    [Locale.EnglishUS]: "Sketchbook with image",
    [Locale.EnglishGB]: "Sketchbook with image",
    [Locale.ChineseTW]: "素描本上的圖片",
    [Locale.ChineseCN]: "素描本上的图片",
    [Locale.Japanese]: "スケッチブックの画像",
  } as LocaleRecord,
} as const;

export function getSketchbookAttachmentDescription(
  text: string | null,
  locale: string,
): string {
  if (text) {
    const prefix = getLocalized(
      SKETCHBOOK_ATTACHMENT_DESCRIPTION.withText,
      locale,
      SKETCHBOOK_ATTACHMENT_DESCRIPTION.withText[Locale.EnglishUS]!,
    )!;
    return `${prefix}${text.substring(0, 100)}`;
  }
  return getLocalized(
    SKETCHBOOK_ATTACHMENT_DESCRIPTION.withImage,
    locale,
    SKETCHBOOK_ATTACHMENT_DESCRIPTION.withImage[Locale.EnglishUS]!,
  )!;
}
