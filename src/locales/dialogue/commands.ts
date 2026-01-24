/**
 * Dialogue Command Localizations
 * Contains command descriptions and option localizations
 */

import { Locale, LocalizationMap } from "discord.js";

// =============================================================================
// Command Description
// =============================================================================

export const DIALOGUE_COMMAND_DESCRIPTION_LOCALIZATIONS: LocalizationMap = {
  [Locale.EnglishUS]: "Generate an in-game style dialogue image",
  [Locale.EnglishGB]: "Generate an in-game style dialogue image",
  [Locale.ChineseTW]: "生成遊戲風格的對話圖片",
  [Locale.ChineseCN]: "生成游戏风格的对话图片",
  [Locale.Japanese]: "ゲーム風の台詞画像を生成する",
};

// =============================================================================
// Option Descriptions
// =============================================================================

export const DIALOGUE_OPTION_LOCALIZATIONS: Record<string, LocalizationMap> = {
  character: {
    [Locale.EnglishUS]: "The character to display",
    [Locale.EnglishGB]: "The character to display",
    [Locale.ChineseTW]: "要顯示的角色",
    [Locale.ChineseCN]: "要显示的角色",
    [Locale.Japanese]: "表示するキャラクター",
  },
  expression: {
    [Locale.EnglishUS]: "Character expression",
    [Locale.EnglishGB]: "Character expression",
    [Locale.ChineseTW]: "角色表情",
    [Locale.ChineseCN]: "角色表情",
    [Locale.Japanese]: "キャラクターの表情",
  },
  text: {
    [Locale.EnglishUS]:
      "The dialogue text (supports emoji and [bracket] highlighting)",
    [Locale.EnglishGB]:
      "The dialogue text (supports emoji and [bracket] highlighting)",
    [Locale.ChineseTW]: "對話文字 (支援表情符號和【括號】高亮)",
    [Locale.ChineseCN]: "对话文字 (支持表情符号和【括号】高亮)",
    [Locale.Japanese]: "台詞テキスト (絵文字と【括弧】ハイライト対応)",
  },
  background: {
    [Locale.EnglishUS]: "Background image ID (use autocomplete)",
    [Locale.EnglishGB]: "Background image ID (use autocomplete)",
    [Locale.ChineseTW]: "背景圖片 ID (使用自動完成)",
    [Locale.ChineseCN]: "背景图片 ID (使用自动完成)",
    [Locale.Japanese]: "背景画像 ID (オートコンプリートを使用)",
  },
  custom_background: {
    [Locale.EnglishUS]: "Upload a custom background image",
    [Locale.EnglishGB]: "Upload a custom background image",
    [Locale.ChineseTW]: "上傳自定義背景圖片",
    [Locale.ChineseCN]: "上传自定义背景图片",
    [Locale.Japanese]: "カスタム背景画像をアップロード",
  },
  stretch: {
    [Locale.EnglishUS]: "How to fit the background to the canvas",
    [Locale.EnglishGB]: "How to fit the background to the canvas",
    [Locale.ChineseTW]: "背景圖片的縮放方式",
    [Locale.ChineseCN]: "背景图片的缩放方式",
    [Locale.Japanese]: "背景のフィット方法",
  },
  font: {
    [Locale.EnglishUS]: "Font for the dialogue text",
    [Locale.EnglishGB]: "Font for the dialogue text",
    [Locale.ChineseTW]: "對話文字的字體",
    [Locale.ChineseCN]: "对话文字的字体",
    [Locale.Japanese]: "台詞テキストのフォント",
  },
  font_size: {
    [Locale.EnglishUS]: "Font size for the dialogue text (default: 72)",
    [Locale.EnglishGB]: "Font size for the dialogue text (default: 72)",
    [Locale.ChineseTW]: "對話文字的字體大小 (預設: 72)",
    [Locale.ChineseCN]: "对话文字的字体大小 (默认: 72)",
    [Locale.Japanese]: "台詞テキストのフォントサイズ (デフォルト: 72)",
  },
  highlight: {
    [Locale.EnglishUS]:
      "Highlight text in [brackets] with character color (default: True)",
    [Locale.EnglishGB]:
      "Highlight text in [brackets] with character color (default: True)",
    [Locale.ChineseTW]: "用角色顏色高亮【括號】內的文字 (預設: True)",
    [Locale.ChineseCN]: "用角色颜色高亮【括号】内的文字 (默认: True)",
    [Locale.Japanese]:
      "【括弧】内のテキストをキャラクターの色でハイライト (デフォルト: True)",
  },
  dm: {
    [Locale.EnglishUS]: "Send the result to your DMs instead of the channel",
    [Locale.EnglishGB]: "Send the result to your DMs instead of the channel",
    [Locale.ChineseTW]: "將結果發送到私訊而不是頻道",
    [Locale.ChineseCN]: "将结果发送到私信而不是频道",
    [Locale.Japanese]: "結果をチャンネルではなくDMに送信する",
  },
  language: {
    [Locale.EnglishUS]: "Language for the character name display",
    [Locale.EnglishGB]: "Language for the character name display",
    [Locale.ChineseTW]: "角色名稱顯示語言",
    [Locale.ChineseCN]: "角色名称显示语言",
    [Locale.Japanese]: "キャラクター名の表示言語",
  },
};
