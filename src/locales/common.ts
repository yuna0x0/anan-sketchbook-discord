/**
 * Common Response Messages
 * Shared messages used across multiple commands
 */

import { Locale } from "discord.js";
import { LocaleRecord, getLocalized } from "./types.js";
import type { ImageFetchError } from "../utils/imageUtils.js";

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
  imageTooLarge: {
    [Locale.EnglishUS]:
      "The image is too large. Please use an image under 8 MB.",
    [Locale.EnglishGB]:
      "The image is too large. Please use an image under 8 MB.",
    [Locale.ChineseTW]: "圖片太大。請使用小於 8 MB 的圖片。",
    [Locale.ChineseCN]: "图片太大。请使用小于 8 MB 的图片。",
    [Locale.Japanese]: "画像が大きすぎます。8 MB 未満の画像をご使用ください。",
  } as LocaleRecord,
  imageTooManyPixels: {
    [Locale.EnglishUS]:
      "The image resolution is too high. Please use an image under 16 megapixels.",
    [Locale.EnglishGB]:
      "The image resolution is too high. Please use an image under 16 megapixels.",
    [Locale.ChineseTW]: "圖片解析度過高。請使用低於 1600 萬像素的圖片。",
    [Locale.ChineseCN]: "图片分辨率过高。请使用低于 1600 万像素的图片。",
    [Locale.Japanese]:
      "画像の解像度が高すぎます。1600万画素未満の画像をご使用ください。",
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
  renderTimeout: {
    [Locale.EnglishUS]:
      "Image generation took too long. Please try again.",
    [Locale.EnglishGB]:
      "Image generation took too long. Please try again.",
    [Locale.ChineseTW]: "圖片生成逾時，請再試一次。",
    [Locale.ChineseCN]: "图片生成超时，请再试一次。",
    [Locale.Japanese]:
      "画像の生成に時間がかかりすぎました。もう一度お試しください。",
  } as LocaleRecord,
  generating: {
    [Locale.EnglishUS]: "⏳ Generating image…",
    [Locale.EnglishGB]: "⏳ Generating image…",
    [Locale.ChineseTW]: "⏳ 圖片生成中…",
    [Locale.ChineseCN]: "⏳ 图片生成中…",
    [Locale.Japanese]: "⏳ 画像を生成中…",
  } as LocaleRecord,
  actionDenied: {
    [Locale.EnglishUS]:
      "Only the person who used the command can use this button.",
    [Locale.EnglishGB]:
      "Only the person who used the command can use this button.",
    [Locale.ChineseTW]: "只有使用指令的人才能使用此按鈕。",
    [Locale.ChineseCN]: "只有使用指令的人才能使用此按钮。",
    [Locale.Japanese]:
      "コマンドを使用した本人のみがこのボタンを使用できます。",
  } as LocaleRecord,
  sessionExpired: {
    [Locale.EnglishUS]:
      "This editing session has expired. Please run the command again.",
    [Locale.EnglishGB]:
      "This editing session has expired. Please run the command again.",
    [Locale.ChineseTW]: "此編輯工作階段已過期，請重新執行指令。",
    [Locale.ChineseCN]: "此编辑会话已过期，请重新运行指令。",
    [Locale.Japanese]:
      "この編集セッションは期限切れです。もう一度コマンドを実行してください。",
  } as LocaleRecord,
  deleteDenied: {
    [Locale.EnglishUS]:
      "Only the person who used the command, or a member with the Manage Messages permission, can delete this message.",
    [Locale.EnglishGB]:
      "Only the person who used the command, or a member with the Manage Messages permission, can delete this message.",
    [Locale.ChineseTW]:
      "只有使用指令的人或擁有「管理訊息」權限的成員才能刪除此訊息。",
    [Locale.ChineseCN]:
      "只有使用指令的人或拥有「管理消息」权限的成员才能删除此消息。",
    [Locale.Japanese]:
      "コマンドを使用した本人、または「メッセージの管理」権限を持つメンバーのみがこのメッセージを削除できます。",
  } as LocaleRecord,
  deleteFailed: {
    [Locale.EnglishUS]: "Failed to delete the message. Please try again later.",
    [Locale.EnglishGB]: "Failed to delete the message. Please try again later.",
    [Locale.ChineseTW]: "無法刪除訊息。請稍後再試。",
    [Locale.ChineseCN]: "无法删除消息。请稍后再试。",
    [Locale.Japanese]:
      "メッセージの削除に失敗しました。後でもう一度お試しください。",
  } as LocaleRecord,
  missingPermissions: {
    [Locale.EnglishUS]:
      "The bot doesn't have permission to send files in this channel. Here's your image as an ephemeral message instead (only visible to you).",
    [Locale.EnglishGB]:
      "The bot doesn't have permission to send files in this channel. Here's your image as an ephemeral message instead (only visible to you).",
    [Locale.ChineseTW]:
      "機器人沒有在此頻道傳送檔案的權限。以下是以僅限你可見的訊息傳送的圖片。",
    [Locale.ChineseCN]:
      "机器人没有在此频道发送文件的权限。以下是以仅限你可见的消息发送的图片。",
    [Locale.Japanese]:
      "このチャンネルでファイルを送信する権限がありません。あなただけに見えるメッセージとして画像を送信します。",
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
    return (
      IMAGE_FORMAT_ERROR_MESSAGES[
        locale as keyof typeof IMAGE_FORMAT_ERROR_MESSAGES
      ] ?? IMAGE_FORMAT_ERROR_MESSAGES[Locale.EnglishUS]!
    );
  }
  return IMAGE_FORMAT_ERROR_MESSAGES[Locale.EnglishUS]!;
}

/**
 * Map a user-image fetch error to its localized message
 */
export function getImageFetchErrorMessage(
  error: ImageFetchError,
  locale: string,
): string {
  switch (error) {
    case "notImage":
      return getResponseMessage("imageNotSupported", locale);
    case "fetchFailed":
      return getResponseMessage("imageFetchFailed", locale);
    case "tooLarge":
      return getResponseMessage("imageTooLarge", locale);
    case "tooManyPixels":
      return getResponseMessage("imageTooManyPixels", locale);
    case "unsupported":
      return getImageFormatErrorMessage(locale);
  }
}
