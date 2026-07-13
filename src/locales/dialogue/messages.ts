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
    [Locale.EnglishUS]:
      "Unknown character for {gameName}: {characterId}. Use autocomplete to pick a character from this game.",
    [Locale.EnglishGB]:
      "Unknown character for {gameName}: {characterId}. Use autocomplete to pick a character from this game.",
    [Locale.ChineseTW]:
      "{gameName} 沒有這個角色：{characterId}。請使用自動完成選擇此遊戲的角色。",
    [Locale.ChineseCN]:
      "{gameName} 没有这个角色：{characterId}。请使用自动完成选择此游戏的角色。",
    [Locale.Japanese]:
      "{gameName} に存在しないキャラクターです：{characterId}。オートコンプリートでこのゲームのキャラクターを選択してください。",
  } as LocaleRecord,
  characterWrongGame: {
    [Locale.EnglishUS]:
      "{characterName} belongs to {otherGame}, but the selected game is {selectedGame}. Set the game option to {otherGame} to use this character.",
    [Locale.EnglishGB]:
      "{characterName} belongs to {otherGame}, but the selected game is {selectedGame}. Set the game option to {otherGame} to use this character.",
    [Locale.ChineseTW]:
      "{characterName} 屬於 {otherGame}，但目前選擇的遊戲是 {selectedGame}。請將 game 選項設為 {otherGame} 以使用此角色。",
    [Locale.ChineseCN]:
      "{characterName} 属于 {otherGame}，但当前选择的游戏是 {selectedGame}。请将 game 选项设为 {otherGame} 以使用此角色。",
    [Locale.Japanese]:
      "{characterName} は {otherGame} のキャラクターですが、選択中のゲームは {selectedGame} です。このキャラクターを使うには game オプションを {otherGame} に設定してください。",
  } as LocaleRecord,
  characterWrongGameMultiple: {
    [Locale.EnglishUS]:
      "Character {characterId} is not in {selectedGame}, but exists in: {otherGames}. Set the game option to one of those games to use it.",
    [Locale.EnglishGB]:
      "Character {characterId} is not in {selectedGame}, but exists in: {otherGames}. Set the game option to one of those games to use it.",
    [Locale.ChineseTW]:
      "角色 {characterId} 不在 {selectedGame} 中，但存在於：{otherGames}。請將 game 選項設為其中一款遊戲以使用此角色。",
    [Locale.ChineseCN]:
      "角色 {characterId} 不在 {selectedGame} 中，但存在于：{otherGames}。请将 game 选项设为其中一款游戏以使用此角色。",
    [Locale.Japanese]:
      "キャラクター {characterId} は {selectedGame} にはいませんが、次のゲームに存在します：{otherGames}。使用するには game オプションをいずれかのゲームに設定してください。",
  } as LocaleRecord,
  invalidExpression: {
    [Locale.EnglishUS]:
      "{characterName} has no such expression in {gameName}. Use autocomplete to pick one of their expressions.",
    [Locale.EnglishGB]:
      "{characterName} has no such expression in {gameName}. Use autocomplete to pick one of their expressions.",
    [Locale.ChineseTW]:
      "{gameName} 的 {characterName} 沒有這個表情。請使用自動完成選擇表情。",
    [Locale.ChineseCN]:
      "{gameName} 的 {characterName} 没有这个表情。请使用自动完成选择表情。",
    [Locale.Japanese]:
      "{gameName} の {characterName} にはこの表情がありません。オートコンプリートで表情を選択してください。",
  } as LocaleRecord,
  unknownBackground: {
    [Locale.EnglishUS]:
      "Unknown background for {gameName}: {backgroundId}. Use autocomplete to see this game's backgrounds.",
    [Locale.EnglishGB]:
      "Unknown background for {gameName}: {backgroundId}. Use autocomplete to see this game's backgrounds.",
    [Locale.ChineseTW]:
      "{gameName} 沒有這個背景：{backgroundId}。請使用自動完成查看此遊戲的可用背景。",
    [Locale.ChineseCN]:
      "{gameName} 没有这个背景：{backgroundId}。请使用自动完成查看此游戏的可用背景。",
    [Locale.Japanese]:
      "{gameName} に存在しない背景です：{backgroundId}。オートコンプリートでこのゲームの背景を確認してください。",
  } as LocaleRecord,
  backgroundWrongGame: {
    [Locale.EnglishUS]:
      "This background belongs to {otherGame}, but the selected game is {selectedGame}. Set the game option to {otherGame} to use it.",
    [Locale.EnglishGB]:
      "This background belongs to {otherGame}, but the selected game is {selectedGame}. Set the game option to {otherGame} to use it.",
    [Locale.ChineseTW]:
      "此背景屬於 {otherGame}，但目前選擇的遊戲是 {selectedGame}。請將 game 選項設為 {otherGame} 以使用此背景。",
    [Locale.ChineseCN]:
      "此背景属于 {otherGame}，但当前选择的游戏是 {selectedGame}。请将 game 选项设为 {otherGame} 以使用此背景。",
    [Locale.Japanese]:
      "この背景は {otherGame} のものですが、選択中のゲームは {selectedGame} です。使用するには game オプションを {otherGame} に設定してください。",
  } as LocaleRecord,
  backgroundWrongGameMultiple: {
    [Locale.EnglishUS]:
      "Background {backgroundId} is not in {selectedGame}, but exists in: {otherGames}. Set the game option to one of those games to use it.",
    [Locale.EnglishGB]:
      "Background {backgroundId} is not in {selectedGame}, but exists in: {otherGames}. Set the game option to one of those games to use it.",
    [Locale.ChineseTW]:
      "背景 {backgroundId} 不在 {selectedGame} 中，但存在於：{otherGames}。請將 game 選項設為其中一款遊戲以使用此背景。",
    [Locale.ChineseCN]:
      "背景 {backgroundId} 不在 {selectedGame} 中，但存在于：{otherGames}。请将 game 选项设为其中一款游戏以使用此背景。",
    [Locale.Japanese]:
      "背景 {backgroundId} は {selectedGame} にはありませんが、次のゲームに存在します：{otherGames}。使用するには game オプションをいずれかのゲームに設定してください。",
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
