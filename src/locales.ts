/**
 * Localization Configuration
 * Provides translations for slash command descriptions in multiple languages.
 * Uses Discord.js Locale enum for type safety and consistency.
 */

import { Locale, LocalizationMap } from "discord.js";
import {
  EmotionType,
  ExpressionOption,
  ExpressionOptionValue,
  CharacterId,
  NameConfigLocale,
} from "./config.js";

// =============================================================================
// Common Response Messages (used by both commands)
// =============================================================================

export const RESPONSE_MESSAGES = {
  // Success messages
  dmSent: {
    [Locale.EnglishUS]: "The image has been sent to your DMs!",
    [Locale.EnglishGB]: "The image has been sent to your DMs!",
    [Locale.ChineseTW]: "圖片已發送到你的私訊！",
    [Locale.ChineseCN]: "图片已发送到你的私信！",
    [Locale.Japanese]: "画像をDMに送信しました！",
  },
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
  },
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
  },
  imageFetchFailed: {
    [Locale.EnglishUS]: "Failed to fetch the attached image. Please try again.",
    [Locale.EnglishGB]: "Failed to fetch the attached image. Please try again.",
    [Locale.ChineseTW]: "無法取得附加的圖片。請重試。",
    [Locale.ChineseCN]: "无法获取附加的图片。请重试。",
    [Locale.Japanese]: "添付画像の取得に失敗しました。もう一度お試しください。",
  },
  genericError: {
    [Locale.EnglishUS]:
      "An error occurred while generating the image. Please try again later.",
    [Locale.EnglishGB]:
      "An error occurred while generating the image. Please try again later.",
    [Locale.ChineseTW]: "生成圖片時發生錯誤。請稍後再試。",
    [Locale.ChineseCN]: "生成图片时发生错误。请稍后再试。",
    [Locale.Japanese]:
      "画像の生成中にエラーが発生しました。後でもう一度お試しください。",
  },
} as const;

// Helper function to get localized response message
export function getResponseMessage(
  key: keyof typeof RESPONSE_MESSAGES,
  locale: string,
): string {
  const messages = RESPONSE_MESSAGES[key];
  return (
    messages[locale as keyof typeof messages] ||
    messages[Locale.EnglishUS] ||
    ""
  );
}

// =============================================================================
// Sketchbook Command Localizations
// =============================================================================

// Character name in different locales (for Anan specifically in sketchbook)
export const CHARACTER_NAME: Partial<Record<Locale, string>> = {
  [Locale.EnglishUS]: "Natsume Anan",
  [Locale.EnglishGB]: "Natsume Anan",
  [Locale.ChineseTW]: "夏目安安",
  [Locale.ChineseCN]: "夏目安安",
  [Locale.Japanese]: "夏目アンアン",
};

// Sketchbook command description localizations
export const COMMAND_DESCRIPTION_LOCALIZATIONS: LocalizationMap = {
  [Locale.EnglishUS]: "Generate an image with Anan holding a sketchbook",
  [Locale.EnglishGB]: "Generate an image with Anan holding a sketchbook",
  [Locale.ChineseTW]: "生成一張安安拿著素描本的圖片",
  [Locale.ChineseCN]: "生成一张安安拿着素描本的图片",
  [Locale.Japanese]: "アンアンがスケッチブックを持っている画像を生成する",
};

// Sketchbook-specific response messages
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
  },
} as const;

export function getSketchbookMessage(
  key: keyof typeof SKETCHBOOK_MESSAGES,
  locale: string,
): string {
  const messages = SKETCHBOOK_MESSAGES[key];
  return (
    messages[locale as keyof typeof messages] ||
    messages[Locale.EnglishUS] ||
    ""
  );
}

// Sketchbook option description localizations
export const OPTION_DESCRIPTION_LOCALIZATIONS: Record<string, LocalizationMap> =
  {
    text: {
      [Locale.EnglishUS]: "The text to display on the sketchbook",
      [Locale.EnglishGB]: "The text to display on the sketchbook",
      [Locale.ChineseTW]: "要顯示在素描本上的文字",
      [Locale.ChineseCN]: "要显示在素描本上的文字",
      [Locale.Japanese]: "スケッチブックに表示するテキスト",
    },
    image: {
      [Locale.EnglishUS]: "An image to paste on the sketchbook",
      [Locale.EnglishGB]: "An image to paste on the sketchbook",
      [Locale.ChineseTW]: "要貼在素描本上的圖片",
      [Locale.ChineseCN]: "要贴在素描本上的图片",
      [Locale.Japanese]: "スケッチブックに貼り付ける画像",
    },
    expression: {
      [Locale.EnglishUS]: "Anan's facial expression",
      [Locale.EnglishGB]: "Anan's facial expression",
      [Locale.ChineseTW]: "安安的表情",
      [Locale.ChineseCN]: "安安的表情",
      [Locale.Japanese]: "アンアンの表情",
    },
    align: {
      [Locale.EnglishUS]: "Horizontal text alignment",
      [Locale.EnglishGB]: "Horizontal text alignment",
      [Locale.ChineseTW]: "文字水平對齊方式",
      [Locale.ChineseCN]: "文字水平对齐方式",
      [Locale.Japanese]: "テキストの水平配置",
    },
    valign: {
      [Locale.EnglishUS]: "Vertical text alignment",
      [Locale.EnglishGB]: "Vertical text alignment",
      [Locale.ChineseTW]: "文字垂直對齊方式",
      [Locale.ChineseCN]: "文字垂直对齐方式",
      [Locale.Japanese]: "テキストの垂直配置",
    },
    dm: {
      [Locale.EnglishUS]: "Send the result to your DMs instead of the channel",
      [Locale.EnglishGB]: "Send the result to your DMs instead of the channel",
      [Locale.ChineseTW]: "將結果發送到私訊而不是頻道",
      [Locale.ChineseCN]: "将结果发送到私信而不是频道",
      [Locale.Japanese]: "結果をチャンネルではなくDMに送信する",
    },
    overlay: {
      [Locale.EnglishUS]: "Apply the overlay effect (default: True)",
      [Locale.EnglishGB]: "Apply the overlay effect (default: True)",
      [Locale.ChineseTW]: "套用疊加效果 (預設: True)",
      [Locale.ChineseCN]: "应用叠加效果 (默认: True)",
      [Locale.Japanese]: "オーバーレイ効果を適用する (デフォルト: True)",
    },
    wrap: {
      [Locale.EnglishUS]: "Text wrapping algorithm",
      [Locale.EnglishGB]: "Text wrapping algorithm",
      [Locale.ChineseTW]: "文字換行演算法",
      [Locale.ChineseCN]: "文字换行算法",
      [Locale.Japanese]: "テキスト折り返しアルゴリズム",
    },
  };

// Expression display name localizations (includes random)
export const EXPRESSION_DISPLAY_NAME_LOCALIZATIONS: Record<
  ExpressionOptionValue,
  LocalizationMap
> = {
  [EmotionType.NORMAL]: {
    [Locale.EnglishUS]: "Normal",
    [Locale.EnglishGB]: "Normal",
    [Locale.ChineseTW]: "普通",
    [Locale.ChineseCN]: "普通",
    [Locale.Japanese]: "通常",
  },
  [EmotionType.HAPPY]: {
    [Locale.EnglishUS]: "Happy",
    [Locale.EnglishGB]: "Happy",
    [Locale.ChineseTW]: "開心",
    [Locale.ChineseCN]: "开心",
    [Locale.Japanese]: "嬉しい",
  },
  [EmotionType.ANGRY]: {
    [Locale.EnglishUS]: "Angry",
    [Locale.EnglishGB]: "Angry",
    [Locale.ChineseTW]: "生氣",
    [Locale.ChineseCN]: "生气",
    [Locale.Japanese]: "怒り",
  },
  [EmotionType.SPEECHLESS]: {
    [Locale.EnglishUS]: "Speechless",
    [Locale.EnglishGB]: "Speechless",
    [Locale.ChineseTW]: "無言",
    [Locale.ChineseCN]: "无语",
    [Locale.Japanese]: "呆れ",
  },
  [EmotionType.BLUSH]: {
    [Locale.EnglishUS]: "Blush",
    [Locale.EnglishGB]: "Blush",
    [Locale.ChineseTW]: "害羞",
    [Locale.ChineseCN]: "害羞",
    [Locale.Japanese]: "照れ",
  },
  [EmotionType.YANDERE]: {
    [Locale.EnglishUS]: "Yandere",
    [Locale.EnglishGB]: "Yandere",
    [Locale.ChineseTW]: "病嬌",
    [Locale.ChineseCN]: "病娇",
    [Locale.Japanese]: "ヤンデレ",
  },
  [EmotionType.CLOSED_EYES]: {
    [Locale.EnglishUS]: "Closed Eyes",
    [Locale.EnglishGB]: "Closed Eyes",
    [Locale.ChineseTW]: "閉眼",
    [Locale.ChineseCN]: "闭眼",
    [Locale.Japanese]: "目を閉じる",
  },
  [EmotionType.SAD]: {
    [Locale.EnglishUS]: "Sad",
    [Locale.EnglishGB]: "Sad",
    [Locale.ChineseTW]: "悲傷",
    [Locale.ChineseCN]: "悲伤",
    [Locale.Japanese]: "悲しい",
  },
  [EmotionType.SCARED]: {
    [Locale.EnglishUS]: "Scared",
    [Locale.EnglishGB]: "Scared",
    [Locale.ChineseTW]: "害怕",
    [Locale.ChineseCN]: "害怕",
    [Locale.Japanese]: "怖い",
  },
  [EmotionType.EXCITED]: {
    [Locale.EnglishUS]: "Excited",
    [Locale.EnglishGB]: "Excited",
    [Locale.ChineseTW]: "興奮",
    [Locale.ChineseCN]: "兴奋",
    [Locale.Japanese]: "興奮",
  },
  [EmotionType.SURPRISED]: {
    [Locale.EnglishUS]: "Surprised",
    [Locale.EnglishGB]: "Surprised",
    [Locale.ChineseTW]: "驚訝",
    [Locale.ChineseCN]: "惊讶",
    [Locale.Japanese]: "驚き",
  },
  [EmotionType.CRYING]: {
    [Locale.EnglishUS]: "Crying",
    [Locale.EnglishGB]: "Crying",
    [Locale.ChineseTW]: "哭泣",
    [Locale.ChineseCN]: "哭泣",
    [Locale.Japanese]: "泣く",
  },
  [ExpressionOption.RANDOM]: {
    [Locale.EnglishUS]: "(Random)",
    [Locale.EnglishGB]: "(Random)",
    [Locale.ChineseTW]: "(隨機)",
    [Locale.ChineseCN]: "(随机)",
    [Locale.Japanese]: "(ランダム)",
  },
};

// Alignment choice localizations
export const ALIGN_CHOICE_LOCALIZATIONS: Record<string, LocalizationMap> = {
  left: {
    [Locale.EnglishUS]: "Left",
    [Locale.EnglishGB]: "Left",
    [Locale.ChineseTW]: "左",
    [Locale.ChineseCN]: "左",
    [Locale.Japanese]: "左",
  },
  center: {
    [Locale.EnglishUS]: "Center",
    [Locale.EnglishGB]: "Centre",
    [Locale.ChineseTW]: "中",
    [Locale.ChineseCN]: "中",
    [Locale.Japanese]: "中央",
  },
  right: {
    [Locale.EnglishUS]: "Right",
    [Locale.EnglishGB]: "Right",
    [Locale.ChineseTW]: "右",
    [Locale.ChineseCN]: "右",
    [Locale.Japanese]: "右",
  },
};

// Vertical alignment choice localizations
export const VALIGN_CHOICE_LOCALIZATIONS: Record<string, LocalizationMap> = {
  top: {
    [Locale.EnglishUS]: "Top",
    [Locale.EnglishGB]: "Top",
    [Locale.ChineseTW]: "上",
    [Locale.ChineseCN]: "上",
    [Locale.Japanese]: "上",
  },
  middle: {
    [Locale.EnglishUS]: "Middle",
    [Locale.EnglishGB]: "Middle",
    [Locale.ChineseTW]: "中",
    [Locale.ChineseCN]: "中",
    [Locale.Japanese]: "中央",
  },
  bottom: {
    [Locale.EnglishUS]: "Bottom",
    [Locale.EnglishGB]: "Bottom",
    [Locale.ChineseTW]: "下",
    [Locale.ChineseCN]: "下",
    [Locale.Japanese]: "下",
  },
};

// Wrap algorithm choice localizations
export const WRAP_CHOICE_LOCALIZATIONS: Record<string, LocalizationMap> = {
  greedy: {
    [Locale.EnglishUS]: "Greedy (faster)",
    [Locale.EnglishGB]: "Greedy (faster)",
    [Locale.ChineseTW]: "貪婪演算法（較快）",
    [Locale.ChineseCN]: "贪婪算法（较快）",
    [Locale.Japanese]: "グリーディ（高速）",
  },
  knuth_plass: {
    [Locale.EnglishUS]: "Knuth-Plass (better quality)",
    [Locale.EnglishGB]: "Knuth-Plass (better quality)",
    [Locale.ChineseTW]: "Knuth-Plass（品質較佳）",
    [Locale.ChineseCN]: "Knuth-Plass（质量较佳）",
    [Locale.Japanese]: "Knuth-Plass（高品質）",
  },
};

// =============================================================================
// Dialogue Command Localizations
// =============================================================================

// Dialogue command description localizations
export const DIALOGUE_COMMAND_DESCRIPTION_LOCALIZATIONS: LocalizationMap = {
  [Locale.EnglishUS]: "Generate an in-game style dialogue image",
  [Locale.EnglishGB]: "Generate an in-game style dialogue image",
  [Locale.ChineseTW]: "生成遊戲風格的對話圖片",
  [Locale.ChineseCN]: "生成游戏风格的对话图片",
  [Locale.Japanese]: "ゲーム風の台詞画像を生成する",
};

// Dialogue option description localizations
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

// Dialogue-specific response messages
export const DIALOGUE_MESSAGES = {
  selectCharacterFirst: {
    [Locale.EnglishUS]: "Please select a character first",
    [Locale.EnglishGB]: "Please select a character first",
    [Locale.ChineseTW]: "請先選擇一個角色",
    [Locale.ChineseCN]: "请先选择一个角色",
    [Locale.Japanese]: "先にキャラクターを選択してください",
  },
  unknownCharacter: {
    [Locale.EnglishUS]: "Unknown character: {characterId}",
    [Locale.EnglishGB]: "Unknown character: {characterId}",
    [Locale.ChineseTW]: "未知角色：{characterId}",
    [Locale.ChineseCN]: "未知角色：{characterId}",
    [Locale.Japanese]: "不明なキャラクター：{characterId}",
  },
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
  },
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
  },
} as const;

export function getDialogueMessage(
  key: keyof typeof DIALOGUE_MESSAGES,
  locale: string,
  replacements?: Record<string, string>,
): string {
  const messages = DIALOGUE_MESSAGES[key];
  let message: string =
    messages[locale as keyof typeof messages] ||
    messages[Locale.EnglishUS] ||
    "";

  if (replacements) {
    for (const [placeholder, value] of Object.entries(replacements)) {
      message = message.replace(new RegExp(`\\{${placeholder}\\}`, "g"), value);
    }
  }

  return message;
}

// Language choice localizations for the name display
// Format: "Language Name (code)"
export const LANGUAGE_CHOICE_LOCALIZATIONS: Partial<
  Record<NameConfigLocale, LocalizationMap>
> = {
  [Locale.ChineseCN]: {
    [Locale.EnglishUS]: "Simplified Chinese (zh-CN)",
    [Locale.EnglishGB]: "Simplified Chinese (zh-CN)",
    [Locale.ChineseTW]: "簡體中文 (zh-CN)",
    [Locale.ChineseCN]: "简体中文 (zh-CN)",
    [Locale.Japanese]: "簡体字中国語 (zh-CN)",
  },
  [Locale.ChineseTW]: {
    [Locale.EnglishUS]: "Traditional Chinese (zh-TW)",
    [Locale.EnglishGB]: "Traditional Chinese (zh-TW)",
    [Locale.ChineseTW]: "繁體中文 (zh-TW)",
    [Locale.ChineseCN]: "繁体中文 (zh-TW)",
    [Locale.Japanese]: "繁体字中国語 (zh-TW)",
  },
  [Locale.Japanese]: {
    [Locale.EnglishUS]: "Japanese (ja)",
    [Locale.EnglishGB]: "Japanese (ja)",
    [Locale.ChineseTW]: "日文 (ja)",
    [Locale.ChineseCN]: "日文 (ja)",
    [Locale.Japanese]: "日本語 (ja)",
  },
};

// Character name localizations (Japanese names with localized display)
// Based on Localization/zh-Hans/Text/CharacterNames.txt and converted to zh-TW using opencc
export const CHARACTER_NAME_LOCALIZATIONS: Record<
  CharacterId,
  LocalizationMap
> = {
  ema: {
    [Locale.ChineseTW]: "櫻羽艾瑪",
    [Locale.ChineseCN]: "樱羽艾玛",
    [Locale.Japanese]: "桜羽エマ",
  },
  hiro: {
    [Locale.ChineseTW]: "二階堂希羅",
    [Locale.ChineseCN]: "二阶堂希罗",
    [Locale.Japanese]: "二階堂ヒロ",
  },
  sherry: {
    [Locale.ChineseTW]: "橘雪莉",
    [Locale.ChineseCN]: "橘雪莉",
    [Locale.Japanese]: "橘シェリー",
  },
  hanna: {
    [Locale.ChineseTW]: "遠野漢娜",
    [Locale.ChineseCN]: "远野汉娜",
    [Locale.Japanese]: "遠野ハンナ",
  },
  anan: {
    [Locale.ChineseTW]: "夏目安安",
    [Locale.ChineseCN]: "夏目安安",
    [Locale.Japanese]: "夏目アンアン",
  },
  yuki: {
    [Locale.ChineseTW]: "月代雪",
    [Locale.ChineseCN]: "月代雪",
    [Locale.Japanese]: "月代ユキ",
  },
  meruru: {
    [Locale.ChineseTW]: "冰上梅露露",
    [Locale.ChineseCN]: "冰上梅露露",
    [Locale.Japanese]: "氷上メルル",
  },
  noa: {
    [Locale.ChineseTW]: "城崎諾亞",
    [Locale.ChineseCN]: "城崎诺亚",
    [Locale.Japanese]: "城ケ崎ノア",
  },
  reia: {
    [Locale.ChineseTW]: "蓮見蕾雅",
    [Locale.ChineseCN]: "莲见蕾雅",
    [Locale.Japanese]: "蓮見レイア",
  },
  miria: {
    [Locale.ChineseTW]: "佐伯米莉亞",
    [Locale.ChineseCN]: "佐伯米莉亚",
    [Locale.Japanese]: "佐伯ミリア",
  },
  nanoka: {
    [Locale.ChineseTW]: "黑部奈葉香",
    [Locale.ChineseCN]: "黑部奈叶香",
    [Locale.Japanese]: "黒部ナノカ",
  },
  margo: {
    [Locale.ChineseTW]: "寶生瑪格",
    [Locale.ChineseCN]: "宝生玛格",
    [Locale.Japanese]: "宝生マーゴ",
  },
  alisa: {
    [Locale.ChineseTW]: "紫藤亞里沙",
    [Locale.ChineseCN]: "紫藤亚里沙",
    [Locale.Japanese]: "紫藤アリサ",
  },
  coco: {
    [Locale.ChineseTW]: "澤渡可可",
    [Locale.ChineseCN]: "泽渡可可",
    [Locale.Japanese]: "沢渡ココ",
  },
};

// Background name localizations
// Based on game Localization files and user's reference sheet
// Keys use Discord Locale enum values for type safety
export interface BackgroundLocalization {
  [Locale.EnglishUS]: string;
  [Locale.ChineseCN]: string;
  [Locale.ChineseTW]: string;
  [Locale.Japanese]: string;
}

export const BACKGROUND_NAME_LOCALIZATIONS: Record<
  string,
  BackgroundLocalization
> = {
  // 1_1: 牢房內部
  bg_001_001: {
    [Locale.EnglishUS]: "Cell Interior",
    [Locale.ChineseCN]: "牢房内部",
    [Locale.ChineseTW]: "牢房內部",
    [Locale.Japanese]: "監房内部",
  },
  // 1_2: 牢房內部 (有看守)
  bg_001_002: {
    [Locale.EnglishUS]: "Cell Interior (with Guard)",
    [Locale.ChineseCN]: "牢房内部 (有看守)",
    [Locale.ChineseTW]: "牢房內部 (有看守)",
    [Locale.Japanese]: "監房内部 (看守あり)",
  },
  // 2_1: 牢房走廊
  bg_002_001: {
    [Locale.EnglishUS]: "Cell Corridor",
    [Locale.ChineseCN]: "牢房走廊",
    [Locale.ChineseTW]: "牢房走廊",
    [Locale.Japanese]: "監房廊下",
  },
  // 3_1: 懲罰室外部 (未上鎖)
  bg_003_001: {
    [Locale.EnglishUS]: "Solitary Confinement Exterior (Unlocked)",
    [Locale.ChineseCN]: "惩罚室外部 (未上锁)",
    [Locale.ChineseTW]: "懲罰室外部 (未上鎖)",
    [Locale.Japanese]: "懲罰房外部 (未施錠)",
  },
  // 3_2: 懲罰室外部 (上鎖)
  bg_003_002: {
    [Locale.EnglishUS]: "Solitary Confinement Exterior (Locked)",
    [Locale.ChineseCN]: "惩罚室外部 (上锁)",
    [Locale.ChineseTW]: "懲罰室外部 (上鎖)",
    [Locale.Japanese]: "懲罰房外部 (施錠)",
  },
  // 4_1: 玄關大廳
  bg_004_001: {
    [Locale.EnglishUS]: "Entrance Hall",
    [Locale.ChineseCN]: "玄关大厅",
    [Locale.ChineseTW]: "玄關大廳",
    [Locale.Japanese]: "玄関ホール",
  },
  // 5_1: 會客廳 (弓弩)
  bg_005_001: {
    [Locale.EnglishUS]: "Parlor (with Crossbow)",
    [Locale.ChineseCN]: "会客厅 (弓弩)",
    [Locale.ChineseTW]: "會客廳 (弓弩)",
    [Locale.Japanese]: "ラウンジ (弓弩あり)",
  },
  // 5_2: 會客廳 (沒弓弩)
  bg_005_002: {
    [Locale.EnglishUS]: "Parlor (without Crossbow)",
    [Locale.ChineseCN]: "会客厅 (没弓弩)",
    [Locale.ChineseTW]: "會客廳 (沒弓弩)",
    [Locale.Japanese]: "ラウンジ (弓弩なし)",
  },
  // 6_1: 食堂
  bg_006_001: {
    [Locale.EnglishUS]: "Mess Hall",
    [Locale.ChineseCN]: "食堂",
    [Locale.ChineseTW]: "食堂",
    [Locale.Japanese]: "食堂",
  },
  // 7_1: 醫務室 (夜晚)
  bg_007_001: {
    [Locale.EnglishUS]: "Infirmary (Night)",
    [Locale.ChineseCN]: "医务室 (夜晚)",
    [Locale.ChineseTW]: "醫務室 (夜晚)",
    [Locale.Japanese]: "医務室 (夜)",
  },
  // 7_2: 醫務室 (白天)
  bg_007_002: {
    [Locale.EnglishUS]: "Infirmary (Day)",
    [Locale.ChineseCN]: "医务室 (白天)",
    [Locale.ChineseTW]: "醫務室 (白天)",
    [Locale.Japanese]: "医務室 (昼)",
  },
  // 9_1: 走廊 (白天)
  bg_009_001: {
    [Locale.EnglishUS]: "Hallway (Day)",
    [Locale.ChineseCN]: "走廊 (白天)",
    [Locale.ChineseTW]: "走廊 (白天)",
    [Locale.Japanese]: "廊下 (昼)",
  },
  // 9_2: 走廊 (夜晚)
  bg_009_002: {
    [Locale.EnglishUS]: "Hallway (Night)",
    [Locale.ChineseCN]: "走廊 (夜晚)",
    [Locale.ChineseTW]: "走廊 (夜晚)",
    [Locale.Japanese]: "廊下 (夜)",
  },
  // 10_1: 玄關到二樓階梯
  bg_010_001: {
    [Locale.EnglishUS]: "Entrance to Second Floor Stairs",
    [Locale.ChineseCN]: "玄关到二楼阶梯",
    [Locale.ChineseTW]: "玄關到二樓階梯",
    [Locale.Japanese]: "玄関から二階への階段",
  },
  // 11_1: 娛樂室
  bg_011_001: {
    [Locale.EnglishUS]: "Recreation Room",
    [Locale.ChineseCN]: "娱乐室",
    [Locale.ChineseTW]: "娛樂室",
    [Locale.Japanese]: "娯楽室",
  },
  // 12_1: 圖書室
  bg_012_001: {
    [Locale.EnglishUS]: "Library",
    [Locale.ChineseCN]: "图书室",
    [Locale.ChineseTW]: "圖書室",
    [Locale.Japanese]: "図書室",
  },
  // 13_1: 審判庭 (全景)
  bg_013_001: {
    [Locale.EnglishUS]: "Courtroom (Panoramic)",
    [Locale.ChineseCN]: "审判庭 (全景)",
    [Locale.ChineseTW]: "審判庭 (全景)",
    [Locale.Japanese]: "裁判所 (全景)",
  },
  // 14_1: 審判庭 (特寫)
  bg_014_001: {
    [Locale.EnglishUS]: "Courtroom (Close-up)",
    [Locale.ChineseCN]: "审判庭 (特写)",
    [Locale.ChineseTW]: "審判庭 (特寫)",
    [Locale.Japanese]: "裁判所 (クローズアップ)",
  },
  // 16_1: 花田
  bg_016_001: {
    [Locale.EnglishUS]: "Flower Field",
    [Locale.ChineseCN]: "花田",
    [Locale.ChineseTW]: "花田",
    [Locale.Japanese]: "花畑",
  },
  // 17_1: 湖 (白天)
  bg_017_001: {
    [Locale.EnglishUS]: "Lake (Day)",
    [Locale.ChineseCN]: "湖 (白天)",
    [Locale.ChineseTW]: "湖 (白天)",
    [Locale.Japanese]: "湖 (昼)",
  },
  // 17_2: 湖 (夜晚)
  bg_017_002: {
    [Locale.EnglishUS]: "Lake (Night)",
    [Locale.ChineseCN]: "湖 (夜晚)",
    [Locale.ChineseTW]: "湖 (夜晚)",
    [Locale.Japanese]: "湖 (夜)",
  },
  // 18_1: 圍牆
  bg_018_001: {
    [Locale.EnglishUS]: "Wall",
    [Locale.ChineseCN]: "围墙",
    [Locale.ChineseTW]: "圍牆",
    [Locale.Japanese]: "塀",
  },
  // 19_1: 監牢入口 (白天)
  bg_019_001: {
    [Locale.EnglishUS]: "Prison Entrance (Day)",
    [Locale.ChineseCN]: "监牢入口 (白天)",
    [Locale.ChineseTW]: "監牢入口 (白天)",
    [Locale.Japanese]: "牢屋敷前 (昼)",
  },
  // 19_2: 監牢入口 (夜晚)
  bg_019_002: {
    [Locale.EnglishUS]: "Prison Entrance (Night)",
    [Locale.ChineseCN]: "监牢入口 (夜晚)",
    [Locale.ChineseTW]: "監牢入口 (夜晚)",
    [Locale.Japanese]: "牢屋敷前 (夜)",
  },
  // 20_1: 下水道
  bg_020_001: {
    [Locale.EnglishUS]: "Sewer",
    [Locale.ChineseCN]: "下水道",
    [Locale.ChineseTW]: "下水道",
    [Locale.Japanese]: "下水道",
  },
  // 21_1: 懲罰室內部
  bg_021_001: {
    [Locale.EnglishUS]: "Solitary Confinement Interior",
    [Locale.ChineseCN]: "惩罚室内部",
    [Locale.ChineseTW]: "懲罰室內部",
    [Locale.Japanese]: "懲罰房内部",
  },
  // 22_1: 招待所外部 (白天)
  bg_022_001: {
    [Locale.EnglishUS]: "Guesthouse Exterior (Day)",
    [Locale.ChineseCN]: "招待所外部 (白天)",
    [Locale.ChineseTW]: "招待所外部 (白天)",
    [Locale.Japanese]: "ゲストハウス前 (昼)",
  },
  // 22_2: 招待所外部 (夜晚)
  bg_022_002: {
    [Locale.EnglishUS]: "Guesthouse Exterior (Night)",
    [Locale.ChineseCN]: "招待所外部 (夜晚)",
    [Locale.ChineseTW]: "招待所外部 (夜晚)",
    [Locale.Japanese]: "ゲストハウス前 (夜)",
  },
  // 22_3: 招待所燃燒及紅色顏料
  bg_022_003: {
    [Locale.EnglishUS]: "Guesthouse Burning & Red Paint",
    [Locale.ChineseCN]: "招待所燃烧及红色颜料",
    [Locale.ChineseTW]: "招待所燃燒及紅色顏料",
    [Locale.Japanese]: "ゲストハウス炎上・赤い絵の具",
  },
  // 22_4: 招待所及紅色顏料
  bg_022_004: {
    [Locale.EnglishUS]: "Guesthouse & Red Paint",
    [Locale.ChineseCN]: "招待所及红色颜料",
    [Locale.ChineseTW]: "招待所及紅色顏料",
    [Locale.Japanese]: "ゲストハウス・赤い絵の具",
  },
  // 23_1: 新地精之室內部 (白天 / 歪斜 / 原火精之室)
  bg_023_001: {
    [Locale.EnglishUS]:
      "New Gnome Chamber Interior (Day / Tilted / Former Salamander Chamber)",
    [Locale.ChineseCN]: "新地精之室内部 (白天 / 歪斜 / 原火精之室)",
    [Locale.ChineseTW]: "新地精之室內部 (白天 / 歪斜 / 原火精之室)",
    [Locale.Japanese]: "新地精の間内部 (昼 / 傾斜 / 旧火精の間)",
  },
  // 23_2: 原地精之室內部 (白天)
  bg_023_002: {
    [Locale.EnglishUS]: "Original Gnome Chamber Interior (Day)",
    [Locale.ChineseCN]: "原地精之室内部 (白天)",
    [Locale.ChineseTW]: "原地精之室內部 (白天)",
    [Locale.Japanese]: "旧地精の間内部 (昼)",
  },
  // 23_3: 水精之室 (白天)
  bg_023_003: {
    [Locale.EnglishUS]: "Undine Chamber (Day)",
    [Locale.ChineseCN]: "水精之室 (白天)",
    [Locale.ChineseTW]: "水精之室 (白天)",
    [Locale.Japanese]: "水精の間 (昼)",
  },
  // 23_4: 水精之室 (白天 / 密道開啟)
  bg_023_004: {
    [Locale.EnglishUS]: "Undine Chamber (Day / Secret Passage Open)",
    [Locale.ChineseCN]: "水精之室 (白天 / 密道开启)",
    [Locale.ChineseTW]: "水精之室 (白天 / 密道開啟)",
    [Locale.Japanese]: "水精の間 (昼 / 隠し通路開)",
  },
  // 23_5: 燃燒後的新火精之室 (白天 / 歪斜 / 原地精之室)
  bg_023_005: {
    [Locale.EnglishUS]:
      "Burned New Salamander Chamber (Day / Tilted / Former Gnome Chamber)",
    [Locale.ChineseCN]: "燃烧后的新火精之室 (白天 / 歪斜 / 原地精之室)",
    [Locale.ChineseTW]: "燃燒後的新火精之室 (白天 / 歪斜 / 原地精之室)",
    [Locale.Japanese]: "炎上後の新火精の間 (昼 / 傾斜 / 旧地精の間)",
  },
  // 23_6: 水精之室 (夜晚)
  bg_023_006: {
    [Locale.EnglishUS]: "Undine Chamber (Night)",
    [Locale.ChineseCN]: "水精之室 (夜晚)",
    [Locale.ChineseTW]: "水精之室 (夜晚)",
    [Locale.Japanese]: "水精の間 (夜)",
  },
  // 23_7: 原火精之室 (夜晚)
  bg_023_007: {
    [Locale.EnglishUS]: "Original Salamander Chamber (Night)",
    [Locale.ChineseCN]: "原火精之室 (夜晚)",
    [Locale.ChineseTW]: "原火精之室 (夜晚)",
    [Locale.Japanese]: "旧火精の間 (夜)",
  },
  // 23_8: 水精之室 (夜晚 / 密道開啟)
  bg_023_008: {
    [Locale.EnglishUS]: "Undine Chamber (Night / Secret Passage Open)",
    [Locale.ChineseCN]: "水精之室 (夜晚 / 密道开启)",
    [Locale.ChineseTW]: "水精之室 (夜晚 / 密道開啟)",
    [Locale.Japanese]: "水精の間 (夜 / 隠し通路開)",
  },
  // 24_1: 倉庫
  bg_024_001: {
    [Locale.EnglishUS]: "Warehouse",
    [Locale.ChineseCN]: "仓库",
    [Locale.ChineseTW]: "倉庫",
    [Locale.Japanese]: "倉庫",
  },
  // 24_2: 倉庫 (彈痕)
  bg_024_002: {
    [Locale.EnglishUS]: "Warehouse (Bullet Holes)",
    [Locale.ChineseCN]: "仓库 (弹痕)",
    [Locale.ChineseTW]: "倉庫 (彈痕)",
    [Locale.Japanese]: "倉庫 (弾痕)",
  },
  // 25_1: 地下控制室
  bg_025_001: {
    [Locale.EnglishUS]: "Underground Control Room",
    [Locale.ChineseCN]: "地下控制室",
    [Locale.ChineseTW]: "地下控制室",
    [Locale.Japanese]: "地下制御室",
  },
  // 25_2: 地下控制室 (通風管道開啟)
  bg_025_002: {
    [Locale.EnglishUS]: "Underground Control Room (Vent Open)",
    [Locale.ChineseCN]: "地下控制室 (通风管道开启)",
    [Locale.ChineseTW]: "地下控制室 (通風管道開啟)",
    [Locale.Japanese]: "地下制御室 (換気口開)",
  },
  // 26_1: 地下冷凍庫
  bg_026_001: {
    [Locale.EnglishUS]: "Underground Freezer",
    [Locale.ChineseCN]: "地下冷冻库",
    [Locale.ChineseTW]: "地下冷凍庫",
    [Locale.Japanese]: "地下冷凍庫",
  },
  // 27_1: 焚燒爐
  bg_027_001: {
    [Locale.EnglishUS]: "Incinerator",
    [Locale.ChineseCN]: "焚烧炉",
    [Locale.ChineseTW]: "焚燒爐",
    [Locale.Japanese]: "焼却炉",
  },
  // 28_1: 中廳 (白天)
  bg_028_001: {
    [Locale.EnglishUS]: "Central Hall (Day)",
    [Locale.ChineseCN]: "中厅 (白天)",
    [Locale.ChineseTW]: "中廳 (白天)",
    [Locale.Japanese]: "中央ホール (昼)",
  },
  // 28_2: 中廳 (夜晚)
  bg_028_002: {
    [Locale.EnglishUS]: "Central Hall (Night)",
    [Locale.ChineseCN]: "中厅 (夜晚)",
    [Locale.ChineseTW]: "中廳 (夜晚)",
    [Locale.Japanese]: "中央ホール (夜)",
  },
  // 29_1: 諾亞的畫室 (白天)
  bg_029_001: {
    [Locale.EnglishUS]: "Noah's Studio (Day)",
    [Locale.ChineseCN]: "诺亚的画室 (白天)",
    [Locale.ChineseTW]: "諾亞的畫室 (白天)",
    [Locale.Japanese]: "ノアのアトリエ (昼)",
  },
  // 29_2: 諾亞的畫室 (夜晚)
  bg_029_002: {
    [Locale.EnglishUS]: "Noah's Studio (Night)",
    [Locale.ChineseCN]: "诺亚的画室 (夜晚)",
    [Locale.ChineseTW]: "諾亞的畫室 (夜晚)",
    [Locale.Japanese]: "ノアのアトリエ (夜)",
  },
  // 30_1: 淋浴房
  bg_030_001: {
    [Locale.EnglishUS]: "Showers",
    [Locale.ChineseCN]: "淋浴房",
    [Locale.ChineseTW]: "淋浴房",
    [Locale.Japanese]: "シャワールーム",
  },
  // 30_2: 淋浴房 (有諾亞的畫)
  bg_030_002: {
    [Locale.EnglishUS]: "Showers (with Noah's Painting)",
    [Locale.ChineseCN]: "淋浴房 (有诺亚的画)",
    [Locale.ChineseTW]: "淋浴房 (有諾亞的畫)",
    [Locale.Japanese]: "シャワールーム (ノアの絵あり)",
  },
  // 31_1: 通往地下的電梯 (門關閉)
  bg_031_001: {
    [Locale.EnglishUS]: "Elevator to Underground (Door Closed)",
    [Locale.ChineseCN]: "通往地下的电梯 (门关闭)",
    [Locale.ChineseTW]: "通往地下的電梯 (門關閉)",
    [Locale.Japanese]: "地下へのエレベーター (扉閉)",
  },
  // 31_2: 通往地下的電梯 (門開啟)
  bg_031_002: {
    [Locale.EnglishUS]: "Elevator to Underground (Door Open)",
    [Locale.ChineseCN]: "通往地下的电梯 (门开启)",
    [Locale.ChineseTW]: "通往地下的電梯 (門開啟)",
    [Locale.Japanese]: "地下へのエレベーター (扉開)",
  },
  // 31_3: 通往地下的電梯 (門開啟 / 頂蓋開啟)
  bg_031_003: {
    [Locale.EnglishUS]: "Elevator to Underground (Door Open / Hatch Open)",
    [Locale.ChineseCN]: "通往地下的电梯 (门开启 / 顶盖开启)",
    [Locale.ChineseTW]: "通往地下的電梯 (門開啟 / 頂蓋開啟)",
    [Locale.Japanese]: "地下へのエレベーター (扉開 / 天井開)",
  },
  // 31_4: 通往地下的電梯 (門關閉 / 旁邊有人字梯)
  bg_031_004: {
    [Locale.EnglishUS]:
      "Elevator to Underground (Door Closed / Stepladder Nearby)",
    [Locale.ChineseCN]: "通往地下的电梯 (门关闭 / 旁边有人字梯)",
    [Locale.ChineseTW]: "通往地下的電梯 (門關閉 / 旁邊有人字梯)",
    [Locale.Japanese]: "地下へのエレベーター (扉閉 / 脚立あり)",
  },
  // 31_5: 通往地下的電梯 (門開啟 / 頂蓋開啟 / 旁邊有人字梯)
  bg_031_005: {
    [Locale.EnglishUS]:
      "Elevator to Underground (Door Open / Hatch Open / Stepladder Nearby)",
    [Locale.ChineseCN]: "通往地下的电梯 (门开启 / 顶盖开启 / 旁边有人字梯)",
    [Locale.ChineseTW]: "通往地下的電梯 (門開啟 / 頂蓋開啟 / 旁邊有人字梯)",
    [Locale.Japanese]: "地下へのエレベーター (扉開 / 天井開 / 脚立あり)",
  },
  // 32_1: 天空
  bg_032_001: {
    [Locale.EnglishUS]: "Sky",
    [Locale.ChineseCN]: "天空",
    [Locale.ChineseTW]: "天空",
    [Locale.Japanese]: "空",
  },
  // 33_1: 星空
  bg_033_001: {
    [Locale.EnglishUS]: "Starry Sky",
    [Locale.ChineseCN]: "星空",
    [Locale.ChineseTW]: "星空",
    [Locale.Japanese]: "星空",
  },
  // 34_1: 虛空
  bg_034_001: {
    [Locale.EnglishUS]: "Void",
    [Locale.ChineseCN]: "虚空",
    [Locale.ChineseTW]: "虛空",
    [Locale.Japanese]: "虚空",
  },
};

/**
 * Get localized background name based on Discord locale
 * @param backgroundId - The background ID (e.g., "bg_001_001")
 * @param locale - The Discord locale string (e.g., "zh-TW", "ja", "en-US")
 * @returns The localized background name, or the ID if no localization exists
 */
export function getLocalizedBackgroundName(
  backgroundId: string,
  locale: string,
): string {
  const localization = BACKGROUND_NAME_LOCALIZATIONS[backgroundId];
  if (!localization) {
    return backgroundId;
  }

  // Map locale string to BackgroundLocalization key
  // Discord locales that map to English
  const englishLocales = [
    Locale.EnglishUS,
    Locale.EnglishGB,
    // Add other locales that should fall back to English
  ];

  // Check for direct match first
  if (locale in localization) {
    return localization[locale as keyof BackgroundLocalization];
  }

  // Fall back to English for unsupported locales
  if (englishLocales.includes(locale as Locale) || !(locale in localization)) {
    return localization[Locale.EnglishUS];
  }

  return backgroundId;
}

// Stretch mode localizations
export const STRETCH_MODE_LOCALIZATIONS: Record<string, LocalizationMap> = {
  stretch: {
    [Locale.EnglishUS]: "Stretch to fill",
    [Locale.EnglishGB]: "Stretch to fill",
    [Locale.ChineseTW]: "撐滿畫布",
    [Locale.ChineseCN]: "撑满画布",
    [Locale.Japanese]: "キャンバスに合わせて引き伸ばす",
  },
  stretch_x: {
    [Locale.EnglishUS]: "Stretch horizontally",
    [Locale.EnglishGB]: "Stretch horizontally",
    [Locale.ChineseTW]: "橫向拉伸",
    [Locale.ChineseCN]: "横向拉伸",
    [Locale.Japanese]: "横方向に引き伸ばす",
  },
  stretch_y: {
    [Locale.EnglishUS]: "Stretch vertically",
    [Locale.EnglishGB]: "Stretch vertically",
    [Locale.ChineseTW]: "縱向拉伸",
    [Locale.ChineseCN]: "纵向拉伸",
    [Locale.Japanese]: "縦方向に引き伸ばす",
  },
  zoom_x: {
    [Locale.EnglishUS]: "Zoom horizontally (keep ratio)",
    [Locale.EnglishGB]: "Zoom horizontally (keep ratio)",
    [Locale.ChineseTW]: "水平縮放 (保持比例)",
    [Locale.ChineseCN]: "水平缩放 (保持比例)",
    [Locale.Japanese]: "横方向にズーム (比率維持)",
  },
  zoom_y: {
    [Locale.EnglishUS]: "Zoom vertically (keep ratio)",
    [Locale.EnglishGB]: "Zoom vertically (keep ratio)",
    [Locale.ChineseTW]: "垂直縮放 (保持比例)",
    [Locale.ChineseCN]: "垂直缩放 (保持比例)",
    [Locale.Japanese]: "縦方向にズーム (比率維持)",
  },
  original: {
    [Locale.EnglishUS]: "Original size (centered)",
    [Locale.EnglishGB]: "Original size (centred)",
    [Locale.ChineseTW]: "原始尺寸 (置中)",
    [Locale.ChineseCN]: "原始尺寸 (居中)",
    [Locale.Japanese]: "元のサイズ (中央配置)",
  },
};

// Font name localizations
export const FONT_NAME_LOCALIZATIONS: Record<string, LocalizationMap> = {
  stzhongs: {
    [Locale.EnglishUS]: "STZhongsong",
    [Locale.EnglishGB]: "STZhongsong",
    [Locale.ChineseTW]: "華文中宋",
    [Locale.ChineseCN]: "华文中宋",
    [Locale.Japanese]: "STZhongsong",
  },
  msyh: {
    [Locale.EnglishUS]: "Microsoft YaHei",
    [Locale.EnglishGB]: "Microsoft YaHei",
    [Locale.ChineseTW]: "微軟雅黑",
    [Locale.ChineseCN]: "微软雅黑",
    [Locale.Japanese]: "Microsoft YaHei",
  },
  simsun: {
    [Locale.EnglishUS]: "SimSun",
    [Locale.EnglishGB]: "SimSun",
    [Locale.ChineseTW]: "宋體",
    [Locale.ChineseCN]: "宋体",
    [Locale.Japanese]: "SimSun",
  },
};

// =============================================================================
// Per-Character Expression Localizations
// =============================================================================

// Expression name localizations for each character
// You can fill in the actual expression names for each language later
// Format: { [expressionId]: { [Locale]: "Display Name" } }
export const CHARACTER_EXPRESSION_LOCALIZATIONS: Record<
  string,
  LocalizationMap
> = {
  // Ema expressions (8 total)
  ema_expression_1: {
    [Locale.EnglishUS]: "Expression 1",
    [Locale.EnglishGB]: "Expression 1",
    [Locale.ChineseTW]: "表情 1",
    [Locale.ChineseCN]: "表情 1",
    [Locale.Japanese]: "表情 1",
  },
  ema_expression_2: {
    [Locale.EnglishUS]: "Expression 2",
    [Locale.EnglishGB]: "Expression 2",
    [Locale.ChineseTW]: "表情 2",
    [Locale.ChineseCN]: "表情 2",
    [Locale.Japanese]: "表情 2",
  },
  ema_expression_3: {
    [Locale.EnglishUS]: "Expression 3",
    [Locale.EnglishGB]: "Expression 3",
    [Locale.ChineseTW]: "表情 3",
    [Locale.ChineseCN]: "表情 3",
    [Locale.Japanese]: "表情 3",
  },
  ema_expression_4: {
    [Locale.EnglishUS]: "Expression 4",
    [Locale.EnglishGB]: "Expression 4",
    [Locale.ChineseTW]: "表情 4",
    [Locale.ChineseCN]: "表情 4",
    [Locale.Japanese]: "表情 4",
  },
  ema_expression_5: {
    [Locale.EnglishUS]: "Expression 5",
    [Locale.EnglishGB]: "Expression 5",
    [Locale.ChineseTW]: "表情 5",
    [Locale.ChineseCN]: "表情 5",
    [Locale.Japanese]: "表情 5",
  },
  ema_expression_6: {
    [Locale.EnglishUS]: "Expression 6",
    [Locale.EnglishGB]: "Expression 6",
    [Locale.ChineseTW]: "表情 6",
    [Locale.ChineseCN]: "表情 6",
    [Locale.Japanese]: "表情 6",
  },
  ema_expression_7: {
    [Locale.EnglishUS]: "Expression 7",
    [Locale.EnglishGB]: "Expression 7",
    [Locale.ChineseTW]: "表情 7",
    [Locale.ChineseCN]: "表情 7",
    [Locale.Japanese]: "表情 7",
  },
  ema_expression_8: {
    [Locale.EnglishUS]: "Expression 8",
    [Locale.EnglishGB]: "Expression 8",
    [Locale.ChineseTW]: "表情 8",
    [Locale.ChineseCN]: "表情 8",
    [Locale.Japanese]: "表情 8",
  },

  // Hiro expressions (6 total)
  hiro_expression_1: {
    [Locale.EnglishUS]: "Expression 1",
    [Locale.EnglishGB]: "Expression 1",
    [Locale.ChineseTW]: "表情 1",
    [Locale.ChineseCN]: "表情 1",
    [Locale.Japanese]: "表情 1",
  },
  hiro_expression_2: {
    [Locale.EnglishUS]: "Expression 2",
    [Locale.EnglishGB]: "Expression 2",
    [Locale.ChineseTW]: "表情 2",
    [Locale.ChineseCN]: "表情 2",
    [Locale.Japanese]: "表情 2",
  },
  hiro_expression_3: {
    [Locale.EnglishUS]: "Expression 3",
    [Locale.EnglishGB]: "Expression 3",
    [Locale.ChineseTW]: "表情 3",
    [Locale.ChineseCN]: "表情 3",
    [Locale.Japanese]: "表情 3",
  },
  hiro_expression_4: {
    [Locale.EnglishUS]: "Expression 4",
    [Locale.EnglishGB]: "Expression 4",
    [Locale.ChineseTW]: "表情 4",
    [Locale.ChineseCN]: "表情 4",
    [Locale.Japanese]: "表情 4",
  },
  hiro_expression_5: {
    [Locale.EnglishUS]: "Expression 5",
    [Locale.EnglishGB]: "Expression 5",
    [Locale.ChineseTW]: "表情 5",
    [Locale.ChineseCN]: "表情 5",
    [Locale.Japanese]: "表情 5",
  },
  hiro_expression_6: {
    [Locale.EnglishUS]: "Expression 6",
    [Locale.EnglishGB]: "Expression 6",
    [Locale.ChineseTW]: "表情 6",
    [Locale.ChineseCN]: "表情 6",
    [Locale.Japanese]: "表情 6",
  },

  // Sherry expressions (7 total)
  sherry_expression_1: {
    [Locale.EnglishUS]: "Expression 1",
    [Locale.EnglishGB]: "Expression 1",
    [Locale.ChineseTW]: "表情 1",
    [Locale.ChineseCN]: "表情 1",
    [Locale.Japanese]: "表情 1",
  },
  sherry_expression_2: {
    [Locale.EnglishUS]: "Expression 2",
    [Locale.EnglishGB]: "Expression 2",
    [Locale.ChineseTW]: "表情 2",
    [Locale.ChineseCN]: "表情 2",
    [Locale.Japanese]: "表情 2",
  },
  sherry_expression_3: {
    [Locale.EnglishUS]: "Expression 3",
    [Locale.EnglishGB]: "Expression 3",
    [Locale.ChineseTW]: "表情 3",
    [Locale.ChineseCN]: "表情 3",
    [Locale.Japanese]: "表情 3",
  },
  sherry_expression_4: {
    [Locale.EnglishUS]: "Expression 4",
    [Locale.EnglishGB]: "Expression 4",
    [Locale.ChineseTW]: "表情 4",
    [Locale.ChineseCN]: "表情 4",
    [Locale.Japanese]: "表情 4",
  },
  sherry_expression_5: {
    [Locale.EnglishUS]: "Expression 5",
    [Locale.EnglishGB]: "Expression 5",
    [Locale.ChineseTW]: "表情 5",
    [Locale.ChineseCN]: "表情 5",
    [Locale.Japanese]: "表情 5",
  },
  sherry_expression_6: {
    [Locale.EnglishUS]: "Expression 6",
    [Locale.EnglishGB]: "Expression 6",
    [Locale.ChineseTW]: "表情 6",
    [Locale.ChineseCN]: "表情 6",
    [Locale.Japanese]: "表情 6",
  },
  sherry_expression_7: {
    [Locale.EnglishUS]: "Expression 7",
    [Locale.EnglishGB]: "Expression 7",
    [Locale.ChineseTW]: "表情 7",
    [Locale.ChineseCN]: "表情 7",
    [Locale.Japanese]: "表情 7",
  },

  // Hanna expressions (5 total)
  hanna_expression_1: {
    [Locale.EnglishUS]: "Expression 1",
    [Locale.EnglishGB]: "Expression 1",
    [Locale.ChineseTW]: "表情 1",
    [Locale.ChineseCN]: "表情 1",
    [Locale.Japanese]: "表情 1",
  },
  hanna_expression_2: {
    [Locale.EnglishUS]: "Expression 2",
    [Locale.EnglishGB]: "Expression 2",
    [Locale.ChineseTW]: "表情 2",
    [Locale.ChineseCN]: "表情 2",
    [Locale.Japanese]: "表情 2",
  },
  hanna_expression_3: {
    [Locale.EnglishUS]: "Expression 3",
    [Locale.EnglishGB]: "Expression 3",
    [Locale.ChineseTW]: "表情 3",
    [Locale.ChineseCN]: "表情 3",
    [Locale.Japanese]: "表情 3",
  },
  hanna_expression_4: {
    [Locale.EnglishUS]: "Expression 4",
    [Locale.EnglishGB]: "Expression 4",
    [Locale.ChineseTW]: "表情 4",
    [Locale.ChineseCN]: "表情 4",
    [Locale.Japanese]: "表情 4",
  },
  hanna_expression_5: {
    [Locale.EnglishUS]: "Expression 5",
    [Locale.EnglishGB]: "Expression 5",
    [Locale.ChineseTW]: "表情 5",
    [Locale.ChineseCN]: "表情 5",
    [Locale.Japanese]: "表情 5",
  },

  // Anan expressions (9 total)
  anan_expression_1: {
    [Locale.EnglishUS]: "Expression 1",
    [Locale.EnglishGB]: "Expression 1",
    [Locale.ChineseTW]: "表情 1",
    [Locale.ChineseCN]: "表情 1",
    [Locale.Japanese]: "表情 1",
  },
  anan_expression_2: {
    [Locale.EnglishUS]: "Expression 2",
    [Locale.EnglishGB]: "Expression 2",
    [Locale.ChineseTW]: "表情 2",
    [Locale.ChineseCN]: "表情 2",
    [Locale.Japanese]: "表情 2",
  },
  anan_expression_3: {
    [Locale.EnglishUS]: "Expression 3",
    [Locale.EnglishGB]: "Expression 3",
    [Locale.ChineseTW]: "表情 3",
    [Locale.ChineseCN]: "表情 3",
    [Locale.Japanese]: "表情 3",
  },
  anan_expression_4: {
    [Locale.EnglishUS]: "Expression 4",
    [Locale.EnglishGB]: "Expression 4",
    [Locale.ChineseTW]: "表情 4",
    [Locale.ChineseCN]: "表情 4",
    [Locale.Japanese]: "表情 4",
  },
  anan_expression_5: {
    [Locale.EnglishUS]: "Expression 5",
    [Locale.EnglishGB]: "Expression 5",
    [Locale.ChineseTW]: "表情 5",
    [Locale.ChineseCN]: "表情 5",
    [Locale.Japanese]: "表情 5",
  },
  anan_expression_6: {
    [Locale.EnglishUS]: "Expression 6",
    [Locale.EnglishGB]: "Expression 6",
    [Locale.ChineseTW]: "表情 6",
    [Locale.ChineseCN]: "表情 6",
    [Locale.Japanese]: "表情 6",
  },
  anan_expression_7: {
    [Locale.EnglishUS]: "Expression 7",
    [Locale.EnglishGB]: "Expression 7",
    [Locale.ChineseTW]: "表情 7",
    [Locale.ChineseCN]: "表情 7",
    [Locale.Japanese]: "表情 7",
  },
  anan_expression_8: {
    [Locale.EnglishUS]: "Expression 8",
    [Locale.EnglishGB]: "Expression 8",
    [Locale.ChineseTW]: "表情 8",
    [Locale.ChineseCN]: "表情 8",
    [Locale.Japanese]: "表情 8",
  },
  anan_expression_9: {
    [Locale.EnglishUS]: "Expression 9",
    [Locale.EnglishGB]: "Expression 9",
    [Locale.ChineseTW]: "表情 9",
    [Locale.ChineseCN]: "表情 9",
    [Locale.Japanese]: "表情 9",
  },

  // Yuki expressions (18 total)
  yuki_expression_1: {
    [Locale.EnglishUS]: "Expression 1",
    [Locale.EnglishGB]: "Expression 1",
    [Locale.ChineseTW]: "表情 1",
    [Locale.ChineseCN]: "表情 1",
    [Locale.Japanese]: "表情 1",
  },
  yuki_expression_2: {
    [Locale.EnglishUS]: "Expression 2",
    [Locale.EnglishGB]: "Expression 2",
    [Locale.ChineseTW]: "表情 2",
    [Locale.ChineseCN]: "表情 2",
    [Locale.Japanese]: "表情 2",
  },
  yuki_expression_3: {
    [Locale.EnglishUS]: "Expression 3",
    [Locale.EnglishGB]: "Expression 3",
    [Locale.ChineseTW]: "表情 3",
    [Locale.ChineseCN]: "表情 3",
    [Locale.Japanese]: "表情 3",
  },
  yuki_expression_4: {
    [Locale.EnglishUS]: "Expression 4",
    [Locale.EnglishGB]: "Expression 4",
    [Locale.ChineseTW]: "表情 4",
    [Locale.ChineseCN]: "表情 4",
    [Locale.Japanese]: "表情 4",
  },
  yuki_expression_5: {
    [Locale.EnglishUS]: "Expression 5",
    [Locale.EnglishGB]: "Expression 5",
    [Locale.ChineseTW]: "表情 5",
    [Locale.ChineseCN]: "表情 5",
    [Locale.Japanese]: "表情 5",
  },
  yuki_expression_6: {
    [Locale.EnglishUS]: "Expression 6",
    [Locale.EnglishGB]: "Expression 6",
    [Locale.ChineseTW]: "表情 6",
    [Locale.ChineseCN]: "表情 6",
    [Locale.Japanese]: "表情 6",
  },
  yuki_expression_7: {
    [Locale.EnglishUS]: "Expression 7",
    [Locale.EnglishGB]: "Expression 7",
    [Locale.ChineseTW]: "表情 7",
    [Locale.ChineseCN]: "表情 7",
    [Locale.Japanese]: "表情 7",
  },
  yuki_expression_8: {
    [Locale.EnglishUS]: "Expression 8",
    [Locale.EnglishGB]: "Expression 8",
    [Locale.ChineseTW]: "表情 8",
    [Locale.ChineseCN]: "表情 8",
    [Locale.Japanese]: "表情 8",
  },
  yuki_expression_9: {
    [Locale.EnglishUS]: "Expression 9",
    [Locale.EnglishGB]: "Expression 9",
    [Locale.ChineseTW]: "表情 9",
    [Locale.ChineseCN]: "表情 9",
    [Locale.Japanese]: "表情 9",
  },
  yuki_expression_10: {
    [Locale.EnglishUS]: "Expression 10",
    [Locale.EnglishGB]: "Expression 10",
    [Locale.ChineseTW]: "表情 10",
    [Locale.ChineseCN]: "表情 10",
    [Locale.Japanese]: "表情 10",
  },
  yuki_expression_11: {
    [Locale.EnglishUS]: "Expression 11",
    [Locale.EnglishGB]: "Expression 11",
    [Locale.ChineseTW]: "表情 11",
    [Locale.ChineseCN]: "表情 11",
    [Locale.Japanese]: "表情 11",
  },
  yuki_expression_12: {
    [Locale.EnglishUS]: "Expression 12",
    [Locale.EnglishGB]: "Expression 12",
    [Locale.ChineseTW]: "表情 12",
    [Locale.ChineseCN]: "表情 12",
    [Locale.Japanese]: "表情 12",
  },
  yuki_expression_13: {
    [Locale.EnglishUS]: "Expression 13",
    [Locale.EnglishGB]: "Expression 13",
    [Locale.ChineseTW]: "表情 13",
    [Locale.ChineseCN]: "表情 13",
    [Locale.Japanese]: "表情 13",
  },
  yuki_expression_14: {
    [Locale.EnglishUS]: "Expression 14",
    [Locale.EnglishGB]: "Expression 14",
    [Locale.ChineseTW]: "表情 14",
    [Locale.ChineseCN]: "表情 14",
    [Locale.Japanese]: "表情 14",
  },
  yuki_expression_15: {
    [Locale.EnglishUS]: "Expression 15",
    [Locale.EnglishGB]: "Expression 15",
    [Locale.ChineseTW]: "表情 15",
    [Locale.ChineseCN]: "表情 15",
    [Locale.Japanese]: "表情 15",
  },
  yuki_expression_16: {
    [Locale.EnglishUS]: "Expression 16",
    [Locale.EnglishGB]: "Expression 16",
    [Locale.ChineseTW]: "表情 16",
    [Locale.ChineseCN]: "表情 16",
    [Locale.Japanese]: "表情 16",
  },
  yuki_expression_17: {
    [Locale.EnglishUS]: "Expression 17",
    [Locale.EnglishGB]: "Expression 17",
    [Locale.ChineseTW]: "表情 17",
    [Locale.ChineseCN]: "表情 17",
    [Locale.Japanese]: "表情 17",
  },
  yuki_expression_18: {
    [Locale.EnglishUS]: "Expression 18",
    [Locale.EnglishGB]: "Expression 18",
    [Locale.ChineseTW]: "表情 18",
    [Locale.ChineseCN]: "表情 18",
    [Locale.Japanese]: "表情 18",
  },

  // Meruru expressions (6 total)
  meruru_expression_1: {
    [Locale.EnglishUS]: "Expression 1",
    [Locale.EnglishGB]: "Expression 1",
    [Locale.ChineseTW]: "表情 1",
    [Locale.ChineseCN]: "表情 1",
    [Locale.Japanese]: "表情 1",
  },
  meruru_expression_2: {
    [Locale.EnglishUS]: "Expression 2",
    [Locale.EnglishGB]: "Expression 2",
    [Locale.ChineseTW]: "表情 2",
    [Locale.ChineseCN]: "表情 2",
    [Locale.Japanese]: "表情 2",
  },
  meruru_expression_3: {
    [Locale.EnglishUS]: "Expression 3",
    [Locale.EnglishGB]: "Expression 3",
    [Locale.ChineseTW]: "表情 3",
    [Locale.ChineseCN]: "表情 3",
    [Locale.Japanese]: "表情 3",
  },
  meruru_expression_4: {
    [Locale.EnglishUS]: "Expression 4",
    [Locale.EnglishGB]: "Expression 4",
    [Locale.ChineseTW]: "表情 4",
    [Locale.ChineseCN]: "表情 4",
    [Locale.Japanese]: "表情 4",
  },
  meruru_expression_5: {
    [Locale.EnglishUS]: "Expression 5",
    [Locale.EnglishGB]: "Expression 5",
    [Locale.ChineseTW]: "表情 5",
    [Locale.ChineseCN]: "表情 5",
    [Locale.Japanese]: "表情 5",
  },
  meruru_expression_6: {
    [Locale.EnglishUS]: "Expression 6",
    [Locale.EnglishGB]: "Expression 6",
    [Locale.ChineseTW]: "表情 6",
    [Locale.ChineseCN]: "表情 6",
    [Locale.Japanese]: "表情 6",
  },

  // Noa expressions (6 total)
  noa_expression_1: {
    [Locale.EnglishUS]: "Expression 1",
    [Locale.EnglishGB]: "Expression 1",
    [Locale.ChineseTW]: "表情 1",
    [Locale.ChineseCN]: "表情 1",
    [Locale.Japanese]: "表情 1",
  },
  noa_expression_2: {
    [Locale.EnglishUS]: "Expression 2",
    [Locale.EnglishGB]: "Expression 2",
    [Locale.ChineseTW]: "表情 2",
    [Locale.ChineseCN]: "表情 2",
    [Locale.Japanese]: "表情 2",
  },
  noa_expression_3: {
    [Locale.EnglishUS]: "Expression 3",
    [Locale.EnglishGB]: "Expression 3",
    [Locale.ChineseTW]: "表情 3",
    [Locale.ChineseCN]: "表情 3",
    [Locale.Japanese]: "表情 3",
  },
  noa_expression_4: {
    [Locale.EnglishUS]: "Expression 4",
    [Locale.EnglishGB]: "Expression 4",
    [Locale.ChineseTW]: "表情 4",
    [Locale.ChineseCN]: "表情 4",
    [Locale.Japanese]: "表情 4",
  },
  noa_expression_5: {
    [Locale.EnglishUS]: "Expression 5",
    [Locale.EnglishGB]: "Expression 5",
    [Locale.ChineseTW]: "表情 5",
    [Locale.ChineseCN]: "表情 5",
    [Locale.Japanese]: "表情 5",
  },
  noa_expression_6: {
    [Locale.EnglishUS]: "Expression 6",
    [Locale.EnglishGB]: "Expression 6",
    [Locale.ChineseTW]: "表情 6",
    [Locale.ChineseCN]: "表情 6",
    [Locale.Japanese]: "表情 6",
  },

  // Reia expressions (7 total)
  reia_expression_1: {
    [Locale.EnglishUS]: "Expression 1",
    [Locale.EnglishGB]: "Expression 1",
    [Locale.ChineseTW]: "表情 1",
    [Locale.ChineseCN]: "表情 1",
    [Locale.Japanese]: "表情 1",
  },
  reia_expression_2: {
    [Locale.EnglishUS]: "Expression 2",
    [Locale.EnglishGB]: "Expression 2",
    [Locale.ChineseTW]: "表情 2",
    [Locale.ChineseCN]: "表情 2",
    [Locale.Japanese]: "表情 2",
  },
  reia_expression_3: {
    [Locale.EnglishUS]: "Expression 3",
    [Locale.EnglishGB]: "Expression 3",
    [Locale.ChineseTW]: "表情 3",
    [Locale.ChineseCN]: "表情 3",
    [Locale.Japanese]: "表情 3",
  },
  reia_expression_4: {
    [Locale.EnglishUS]: "Expression 4",
    [Locale.EnglishGB]: "Expression 4",
    [Locale.ChineseTW]: "表情 4",
    [Locale.ChineseCN]: "表情 4",
    [Locale.Japanese]: "表情 4",
  },
  reia_expression_5: {
    [Locale.EnglishUS]: "Expression 5",
    [Locale.EnglishGB]: "Expression 5",
    [Locale.ChineseTW]: "表情 5",
    [Locale.ChineseCN]: "表情 5",
    [Locale.Japanese]: "表情 5",
  },
  reia_expression_6: {
    [Locale.EnglishUS]: "Expression 6",
    [Locale.EnglishGB]: "Expression 6",
    [Locale.ChineseTW]: "表情 6",
    [Locale.ChineseCN]: "表情 6",
    [Locale.Japanese]: "表情 6",
  },
  reia_expression_7: {
    [Locale.EnglishUS]: "Expression 7",
    [Locale.EnglishGB]: "Expression 7",
    [Locale.ChineseTW]: "表情 7",
    [Locale.ChineseCN]: "表情 7",
    [Locale.Japanese]: "表情 7",
  },

  // Miria expressions (4 total)
  miria_expression_1: {
    [Locale.EnglishUS]: "Expression 1",
    [Locale.EnglishGB]: "Expression 1",
    [Locale.ChineseTW]: "表情 1",
    [Locale.ChineseCN]: "表情 1",
    [Locale.Japanese]: "表情 1",
  },
  miria_expression_2: {
    [Locale.EnglishUS]: "Expression 2",
    [Locale.EnglishGB]: "Expression 2",
    [Locale.ChineseTW]: "表情 2",
    [Locale.ChineseCN]: "表情 2",
    [Locale.Japanese]: "表情 2",
  },
  miria_expression_3: {
    [Locale.EnglishUS]: "Expression 3",
    [Locale.EnglishGB]: "Expression 3",
    [Locale.ChineseTW]: "表情 3",
    [Locale.ChineseCN]: "表情 3",
    [Locale.Japanese]: "表情 3",
  },
  miria_expression_4: {
    [Locale.EnglishUS]: "Expression 4",
    [Locale.EnglishGB]: "Expression 4",
    [Locale.ChineseTW]: "表情 4",
    [Locale.ChineseCN]: "表情 4",
    [Locale.Japanese]: "表情 4",
  },

  // Nanoka expressions (5 total)
  nanoka_expression_1: {
    [Locale.EnglishUS]: "Expression 1",
    [Locale.EnglishGB]: "Expression 1",
    [Locale.ChineseTW]: "表情 1",
    [Locale.ChineseCN]: "表情 1",
    [Locale.Japanese]: "表情 1",
  },
  nanoka_expression_2: {
    [Locale.EnglishUS]: "Expression 2",
    [Locale.EnglishGB]: "Expression 2",
    [Locale.ChineseTW]: "表情 2",
    [Locale.ChineseCN]: "表情 2",
    [Locale.Japanese]: "表情 2",
  },
  nanoka_expression_3: {
    [Locale.EnglishUS]: "Expression 3",
    [Locale.EnglishGB]: "Expression 3",
    [Locale.ChineseTW]: "表情 3",
    [Locale.ChineseCN]: "表情 3",
    [Locale.Japanese]: "表情 3",
  },
  nanoka_expression_4: {
    [Locale.EnglishUS]: "Expression 4",
    [Locale.EnglishGB]: "Expression 4",
    [Locale.ChineseTW]: "表情 4",
    [Locale.ChineseCN]: "表情 4",
    [Locale.Japanese]: "表情 4",
  },
  nanoka_expression_5: {
    [Locale.EnglishUS]: "Expression 5",
    [Locale.EnglishGB]: "Expression 5",
    [Locale.ChineseTW]: "表情 5",
    [Locale.ChineseCN]: "表情 5",
    [Locale.Japanese]: "表情 5",
  },

  // Margo expressions (5 total)
  margo_expression_1: {
    [Locale.EnglishUS]: "Expression 1",
    [Locale.EnglishGB]: "Expression 1",
    [Locale.ChineseTW]: "表情 1",
    [Locale.ChineseCN]: "表情 1",
    [Locale.Japanese]: "表情 1",
  },
  margo_expression_2: {
    [Locale.EnglishUS]: "Expression 2",
    [Locale.EnglishGB]: "Expression 2",
    [Locale.ChineseTW]: "表情 2",
    [Locale.ChineseCN]: "表情 2",
    [Locale.Japanese]: "表情 2",
  },
  margo_expression_3: {
    [Locale.EnglishUS]: "Expression 3",
    [Locale.EnglishGB]: "Expression 3",
    [Locale.ChineseTW]: "表情 3",
    [Locale.ChineseCN]: "表情 3",
    [Locale.Japanese]: "表情 3",
  },
  margo_expression_4: {
    [Locale.EnglishUS]: "Expression 4",
    [Locale.EnglishGB]: "Expression 4",
    [Locale.ChineseTW]: "表情 4",
    [Locale.ChineseCN]: "表情 4",
    [Locale.Japanese]: "表情 4",
  },
  margo_expression_5: {
    [Locale.EnglishUS]: "Expression 5",
    [Locale.EnglishGB]: "Expression 5",
    [Locale.ChineseTW]: "表情 5",
    [Locale.ChineseCN]: "表情 5",
    [Locale.Japanese]: "表情 5",
  },

  // Alisa expressions (6 total)
  alisa_expression_1: {
    [Locale.EnglishUS]: "Expression 1",
    [Locale.EnglishGB]: "Expression 1",
    [Locale.ChineseTW]: "表情 1",
    [Locale.ChineseCN]: "表情 1",
    [Locale.Japanese]: "表情 1",
  },
  alisa_expression_2: {
    [Locale.EnglishUS]: "Expression 2",
    [Locale.EnglishGB]: "Expression 2",
    [Locale.ChineseTW]: "表情 2",
    [Locale.ChineseCN]: "表情 2",
    [Locale.Japanese]: "表情 2",
  },
  alisa_expression_3: {
    [Locale.EnglishUS]: "Expression 3",
    [Locale.EnglishGB]: "Expression 3",
    [Locale.ChineseTW]: "表情 3",
    [Locale.ChineseCN]: "表情 3",
    [Locale.Japanese]: "表情 3",
  },
  alisa_expression_4: {
    [Locale.EnglishUS]: "Expression 4",
    [Locale.EnglishGB]: "Expression 4",
    [Locale.ChineseTW]: "表情 4",
    [Locale.ChineseCN]: "表情 4",
    [Locale.Japanese]: "表情 4",
  },
  alisa_expression_5: {
    [Locale.EnglishUS]: "Expression 5",
    [Locale.EnglishGB]: "Expression 5",
    [Locale.ChineseTW]: "表情 5",
    [Locale.ChineseCN]: "表情 5",
    [Locale.Japanese]: "表情 5",
  },
  alisa_expression_6: {
    [Locale.EnglishUS]: "Expression 6",
    [Locale.EnglishGB]: "Expression 6",
    [Locale.ChineseTW]: "表情 6",
    [Locale.ChineseCN]: "表情 6",
    [Locale.Japanese]: "表情 6",
  },

  // Coco expressions (5 total)
  coco_expression_1: {
    [Locale.EnglishUS]: "Expression 1",
    [Locale.EnglishGB]: "Expression 1",
    [Locale.ChineseTW]: "表情 1",
    [Locale.ChineseCN]: "表情 1",
    [Locale.Japanese]: "表情 1",
  },
  coco_expression_2: {
    [Locale.EnglishUS]: "Expression 2",
    [Locale.EnglishGB]: "Expression 2",
    [Locale.ChineseTW]: "表情 2",
    [Locale.ChineseCN]: "表情 2",
    [Locale.Japanese]: "表情 2",
  },
  coco_expression_3: {
    [Locale.EnglishUS]: "Expression 3",
    [Locale.EnglishGB]: "Expression 3",
    [Locale.ChineseTW]: "表情 3",
    [Locale.ChineseCN]: "表情 3",
    [Locale.Japanese]: "表情 3",
  },
  coco_expression_4: {
    [Locale.EnglishUS]: "Expression 4",
    [Locale.EnglishGB]: "Expression 4",
    [Locale.ChineseTW]: "表情 4",
    [Locale.ChineseCN]: "表情 4",
    [Locale.Japanese]: "表情 4",
  },
  coco_expression_5: {
    [Locale.EnglishUS]: "Expression 5",
    [Locale.EnglishGB]: "Expression 5",
    [Locale.ChineseTW]: "表情 5",
    [Locale.ChineseCN]: "表情 5",
    [Locale.Japanese]: "表情 5",
  },
};

/**
 * Get localized expression name for autocomplete display
 */
export function getLocalizedExpressionName(
  expressionId: string,
  locale: Locale | string,
): string {
  const localization = CHARACTER_EXPRESSION_LOCALIZATIONS[expressionId];

  if (!localization) {
    // Fallback: extract a display name from the expression ID
    // e.g., "ema_expression_1" -> "Expression 1"
    const match = expressionId.match(/expression_(\d+)$/);
    if (match) {
      return `Expression ${match[1]}`;
    }
    return expressionId;
  }

  // Map Discord locale to our localization keys
  const localeKey = locale as Locale;

  // Try exact locale match first
  if (localization[localeKey]) {
    return localization[localeKey] as string;
  }

  // Try English locales as fallback
  const englishLocales = [Locale.EnglishUS, Locale.EnglishGB];

  for (const englishLocale of englishLocales) {
    if (localization[englishLocale]) {
      return localization[englishLocale] as string;
    }
  }

  // Final fallback: return the expression ID
  return expressionId;
}
