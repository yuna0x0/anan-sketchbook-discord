/**
 * Common Response Messages
 * Shared messages used across multiple commands
 */

import { Locale } from "discord.js";
import { LocaleRecord, getLocalized } from "./types.js";

// =============================================================================
// Common Response Messages
// =============================================================================

export const RESPONSE_MESSAGES = {
  // Success messages
  dmSent: {
    [Locale.EnglishUS]: "The image has been sent to your DMs!",
    [Locale.EnglishGB]: "The image has been sent to your DMs!",
    [Locale.ChineseTW]: "圖片已發送到你的私訊！",
    [Locale.ChineseCN]: "图片已发送到你的私信！",
    [Locale.Japanese]: "画像をDMに送信しました！",
  } as LocaleRecord,
  // Error messages
  dmFailed: {
    [Locale.EnglishUS]:
      "Failed to send DM. Please make sure your DMs are open, or try without the DM option.",
    [Locale.EnglishGB]:
      "Failed to send DM. Please make sure your DMs are open, or try without the DM option.",
    [Locale.ChineseTW]:
      "無法發送私訊。請確保你的私訊已開啟，或嘗試不使用私訊選項。",
    [Locale.ChineseCN]:
      "无法发送私信。请确保你的私信已开启，或尝试不使用私信选项。",
    [Locale.Japanese]:
      "DMの送信に失敗しました。DMが開放されているか確認するか、DMオプションなしでお試しください。",
  } as LocaleRecord,
  imageNotSupported: {
    [Locale.EnglishUS]:
      "The attached file must be an image (PNG, JPEG, GIF, BMP, WebP, TIFF, or AVIF).",
    [Locale.EnglishGB]:
      "The attached file must be an image (PNG, JPEG, GIF, BMP, WebP, TIFF, or AVIF).",
    [Locale.ChineseTW]:
      "附加的檔案必須是圖片（PNG、JPEG、GIF、BMP、WebP、TIFF 或 AVIF）。",
    [Locale.ChineseCN]:
      "附加的文件必须是图片（PNG、JPEG、GIF、BMP、WebP、TIFF 或 AVIF）。",
    [Locale.Japanese]:
      "添付ファイルは画像である必要があります（PNG、JPEG、GIF、BMP、WebP、TIFF、またはAVIF）。",
  } as LocaleRecord,
  imageFetchFailed: {
    [Locale.EnglishUS]: "Failed to fetch the attached image. Please try again.",
    [Locale.EnglishGB]: "Failed to fetch the attached image. Please try again.",
    [Locale.ChineseTW]: "無法取得附加的圖片。請重試。",
    [Locale.ChineseCN]: "无法获取附加的图片。请重试。",
    [Locale.Japanese]: "添付画像の取得に失敗しました。もう一度お試しください。",
  } as LocaleRecord,
  genericError: {
    [Locale.EnglishUS]:
      "An error occurred while generating the image. Please try again later.",
    [Locale.EnglishGB]:
      "An error occurred while generating the image. Please try again later.",
    [Locale.ChineseTW]: "生成圖片時發生錯誤。請稍後再試。",
    [Locale.ChineseCN]: "生成图片时发生错误。请稍后再试。",
    [Locale.Japanese]:
      "画像の生成中にエラーが発生しました。後でもう一度お試しください。",
  } as LocaleRecord,
} as const;

/**
 * Get localized response message
 */
export function getResponseMessage(
  key: keyof typeof RESPONSE_MESSAGES,
  locale: string,
): string {
  const messages = RESPONSE_MESSAGES[key];
  return getLocalized(messages, locale, "") ?? "";
}

// =============================================================================
// Image Format Error Messages
// =============================================================================

export const IMAGE_FORMAT_ERROR_MESSAGES = {
  [Locale.EnglishUS]:
    "Unsupported image format. Please use PNG, JPEG, GIF, BMP, WebP, TIFF, or AVIF.",
  [Locale.EnglishGB]:
    "Unsupported image format. Please use PNG, JPEG, GIF, BMP, WebP, TIFF, or AVIF.",
  [Locale.ChineseTW]:
    "不支援的圖片格式。請使用 PNG、JPEG、GIF、BMP、WebP、TIFF 或 AVIF。",
  [Locale.ChineseCN]:
    "不支持的图片格式。请使用 PNG、JPEG、GIF、BMP、WebP、TIFF 或 AVIF。",
  [Locale.Japanese]:
    "サポートされていない画像形式です。PNG、JPEG、GIF、BMP、WebP、TIFF、またはAVIFをご使用ください。",
} as LocaleRecord;

/**
 * Get a localized error message for unsupported image types
 */
export function getImageFormatErrorMessage(locale?: Locale | string): string {
  if (locale && locale in IMAGE_FORMAT_ERROR_MESSAGES) {
    return IMAGE_FORMAT_ERROR_MESSAGES[
      locale as keyof typeof IMAGE_FORMAT_ERROR_MESSAGES
    ] ?? IMAGE_FORMAT_ERROR_MESSAGES[Locale.EnglishUS]!;
  }
  return IMAGE_FORMAT_ERROR_MESSAGES[Locale.EnglishUS]!;
}
