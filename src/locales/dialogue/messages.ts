/**
 * Dialogue Messages Localizations
 * Contains dialogue-specific response messages
 */

import { Locale } from "discord.js";
import { LocaleRecord, getLocalized, formatLocalized } from "../types.js";

// =============================================================================
// Dialogue Messages
// =============================================================================

export const DIALOGUE_MESSAGES = {
  selectCharacterFirst: {
    [Locale.EnglishUS]: "Please select a character first",
    [Locale.EnglishGB]: "Please select a character first",
    [Locale.ChineseTW]: "請先選擇一個角色",
    [Locale.ChineseCN]: "请先选择一个角色",
    [Locale.Japanese]: "先にキャラクターを選択してください",
  } as LocaleRecord,
  unknownCharacter: {
    [Locale.EnglishUS]: "Unknown character: {characterId}",
    [Locale.EnglishGB]: "Unknown character: {characterId}",
    [Locale.ChineseTW]: "未知角色：{characterId}",
    [Locale.ChineseCN]: "未知角色：{characterId}",
    [Locale.Japanese]: "不明なキャラクター：{characterId}",
  } as LocaleRecord,
  invalidExpression: {
    [Locale.EnglishUS]:
      "Invalid expression for {characterName}. Valid range: 1-{maxExpression}",
    [Locale.EnglishGB]:
      "Invalid expression for {characterName}. Valid range: 1-{maxExpression}",
    [Locale.ChineseTW]:
      "{characterName} 的表情無效。有效範圍：1-{maxExpression}",
    [Locale.ChineseCN]:
      "{characterName} 的表情无效。有效范围：1-{maxExpression}",
    [Locale.Japanese]:
      "{characterName} の表情が無効です。有効範囲：1-{maxExpression}",
  } as LocaleRecord,
  unknownBackground: {
    [Locale.EnglishUS]:
      "Unknown background: {backgroundId}. Use autocomplete to see available backgrounds.",
    [Locale.EnglishGB]:
      "Unknown background: {backgroundId}. Use autocomplete to see available backgrounds.",
    [Locale.ChineseTW]:
      "未知背景：{backgroundId}。請使用自動完成查看可用背景。",
    [Locale.ChineseCN]:
      "未知背景：{backgroundId}。请使用自动完成查看可用背景。",
    [Locale.Japanese]:
      "不明な背景：{backgroundId}。オートコンプリートで利用可能な背景を確認してください。",
  } as LocaleRecord,
} as const;

export function getDialogueMessage(
  key: keyof typeof DIALOGUE_MESSAGES,
  locale: string,
  replacements?: Record<string, string>,
): string {
  const messages = DIALOGUE_MESSAGES[key];
  const message = getLocalized(messages, locale, "") ?? "";
  return formatLocalized(message, replacements);
}
