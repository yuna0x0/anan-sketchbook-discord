/**
 * Adjust / Effects UI Localizations
 * Labels for the message action buttons, the Adjust/Effects modals, and the
 * image filter names.
 */

import { Locale } from "discord.js";
import {
  LocaleRecord,
  getLocalizedRequired,
  formatLocalized,
} from "./types.js";
import type { ImageFilterId } from "../utils/imageFilters.js";

// =============================================================================
// UI Labels
// =============================================================================

export const ADJUST_UI_LABELS = {
  adjustButton: {
    [Locale.EnglishUS]: "Adjust",
    [Locale.EnglishGB]: "Adjust",
    [Locale.ChineseTW]: "調整",
    [Locale.ChineseCN]: "调整",
    [Locale.Japanese]: "調整",
  } as LocaleRecord,
  effectsButton: {
    [Locale.EnglishUS]: "Effects",
    [Locale.EnglishGB]: "Effects",
    [Locale.ChineseTW]: "效果",
    [Locale.ChineseCN]: "效果",
    [Locale.Japanese]: "エフェクト",
  } as LocaleRecord,
  adjustModalTitle: {
    [Locale.EnglishUS]: "Adjust image",
    [Locale.EnglishGB]: "Adjust image",
    [Locale.ChineseTW]: "調整圖片",
    [Locale.ChineseCN]: "调整图片",
    [Locale.Japanese]: "画像を調整",
  } as LocaleRecord,
  effectsModalTitle: {
    [Locale.EnglishUS]: "Image effects",
    [Locale.EnglishGB]: "Image effects",
    [Locale.ChineseTW]: "圖片效果",
    [Locale.ChineseCN]: "图片效果",
    [Locale.Japanese]: "画像エフェクト",
  } as LocaleRecord,
  textLabel: {
    [Locale.EnglishUS]: "Text",
    [Locale.EnglishGB]: "Text",
    [Locale.ChineseTW]: "文字",
    [Locale.ChineseCN]: "文字",
    [Locale.Japanese]: "テキスト",
  } as LocaleRecord,
  expressionLabel: {
    [Locale.EnglishUS]: "Expression",
    [Locale.EnglishGB]: "Expression",
    [Locale.ChineseTW]: "表情",
    [Locale.ChineseCN]: "表情",
    [Locale.Japanese]: "表情",
  } as LocaleRecord,
  fontLabel: {
    [Locale.EnglishUS]: "Font",
    [Locale.EnglishGB]: "Font",
    [Locale.ChineseTW]: "字體",
    [Locale.ChineseCN]: "字体",
    [Locale.Japanese]: "フォント",
  } as LocaleRecord,
  fontSizeCapLabel: {
    [Locale.EnglishUS]: "Max font size",
    [Locale.EnglishGB]: "Max font size",
    [Locale.ChineseTW]: "最大字體大小",
    [Locale.ChineseCN]: "最大字体大小",
    [Locale.Japanese]: "最大フォントサイズ",
  } as LocaleRecord,
  fontSizeLabel: {
    [Locale.EnglishUS]: "Font size",
    [Locale.EnglishGB]: "Font size",
    [Locale.ChineseTW]: "字體大小",
    [Locale.ChineseCN]: "字体大小",
    [Locale.Japanese]: "フォントサイズ",
  } as LocaleRecord,
  layoutLabel: {
    [Locale.EnglishUS]: "Text layout",
    [Locale.EnglishGB]: "Text layout",
    [Locale.ChineseTW]: "文字排版",
    [Locale.ChineseCN]: "文字排版",
    [Locale.Japanese]: "テキストレイアウト",
  } as LocaleRecord,
  filterLabel: {
    [Locale.EnglishUS]: "Filter",
    [Locale.EnglishGB]: "Filter",
    [Locale.ChineseTW]: "濾鏡",
    [Locale.ChineseCN]: "滤镜",
    [Locale.Japanese]: "フィルター",
  } as LocaleRecord,
  stretchLabel: {
    [Locale.EnglishUS]: "Background fit",
    [Locale.EnglishGB]: "Background fit",
    [Locale.ChineseTW]: "背景符合模式",
    [Locale.ChineseCN]: "背景适应模式",
    [Locale.Japanese]: "背景フィットモード",
  } as LocaleRecord,
  overlayOption: {
    [Locale.EnglishUS]: "Overlay effect",
    [Locale.EnglishGB]: "Overlay effect",
    [Locale.ChineseTW]: "疊加效果",
    [Locale.ChineseCN]: "叠加效果",
    [Locale.Japanese]: "オーバーレイ効果",
  } as LocaleRecord,
  wrapOption: {
    [Locale.EnglishUS]: "Knuth-Plass text wrapping",
    [Locale.EnglishGB]: "Knuth-Plass text wrapping",
    [Locale.ChineseTW]: "Knuth-Plass 換行",
    [Locale.ChineseCN]: "Knuth-Plass 换行",
    [Locale.Japanese]: "Knuth-Plassでの折り返し",
  } as LocaleRecord,
  highlightOption: {
    [Locale.EnglishUS]: "Highlight bracketed text",
    [Locale.EnglishGB]: "Highlight bracketed text",
    [Locale.ChineseTW]: "強調括號內文字",
    [Locale.ChineseCN]: "强调括号内文字",
    [Locale.Japanese]: "括弧内のテキストを強調",
  } as LocaleRecord,
  fineTuneLabel: {
    [Locale.EnglishUS]: "Fine-tune",
    [Locale.EnglishGB]: "Fine-tune",
    [Locale.ChineseTW]: "微調",
    [Locale.ChineseCN]: "微调",
    [Locale.Japanese]: "微調整",
  } as LocaleRecord,
  languageLabel: {
    [Locale.EnglishUS]: "Name language",
    [Locale.EnglishGB]: "Name language",
    [Locale.ChineseTW]: "名字語言",
    [Locale.ChineseCN]: "名字语言",
    [Locale.Japanese]: "名前の言語",
  } as LocaleRecord,
  backgroundIdLabel: {
    [Locale.EnglishUS]: "Background ID",
    [Locale.EnglishGB]: "Background ID",
    [Locale.ChineseTW]: "背景 ID",
    [Locale.ChineseCN]: "背景 ID",
    [Locale.Japanese]: "背景ID",
  } as LocaleRecord,
  keyValueFieldHint: {
    [Locale.EnglishUS]: 'key=value pairs. Type "help" for the full option list.',
    [Locale.EnglishGB]: 'key=value pairs. Type "help" for the full option list.',
    [Locale.ChineseTW]: "key=value 格式。輸入 help 查看完整選項列表。",
    [Locale.ChineseCN]: "key=value 格式。输入 help 查看完整选项列表。",
    [Locale.Japanese]: "key=value 形式。help と入力すると全オプションを表示します。",
  } as LocaleRecord,
  defaultMarker: {
    [Locale.EnglishUS]: "Default",
    [Locale.EnglishGB]: "Default",
    [Locale.ChineseTW]: "預設",
    [Locale.ChineseCN]: "默认",
    [Locale.Japanese]: "デフォルト",
  } as LocaleRecord,
  onLabel: {
    [Locale.EnglishUS]: "On",
    [Locale.EnglishGB]: "On",
    [Locale.ChineseTW]: "開啟",
    [Locale.ChineseCN]: "开启",
    [Locale.Japanese]: "オン",
  } as LocaleRecord,
  offLabel: {
    [Locale.EnglishUS]: "Off",
    [Locale.EnglishGB]: "Off",
    [Locale.ChineseTW]: "關閉",
    [Locale.ChineseCN]: "关闭",
    [Locale.Japanese]: "オフ",
  } as LocaleRecord,
  defaultOn: {
    [Locale.EnglishUS]: "Default: on",
    [Locale.EnglishGB]: "Default: on",
    [Locale.ChineseTW]: "預設：開啟",
    [Locale.ChineseCN]: "默认：开启",
    [Locale.Japanese]: "デフォルト：オン",
  } as LocaleRecord,
  defaultOff: {
    [Locale.EnglishUS]: "Default: off",
    [Locale.EnglishGB]: "Default: off",
    [Locale.ChineseTW]: "預設：關閉",
    [Locale.ChineseCN]: "默认：关闭",
    [Locale.Japanese]: "デフォルト：オフ",
  } as LocaleRecord,
  fontSizeAutoDefault: {
    [Locale.EnglishUS]: "Default: automatic (max 64)",
    [Locale.EnglishGB]: "Default: automatic (max 64)",
    [Locale.ChineseTW]: "預設：自動（最大 64）",
    [Locale.ChineseCN]: "默认：自动（最大 64）",
    [Locale.Japanese]: "デフォルト：自動（最大64）",
  } as LocaleRecord,
  helpAppliedNote: {
    [Locale.EnglishUS]:
      "Your other changes were applied. The field where you typed help kept its previous value.",
    [Locale.EnglishGB]:
      "Your other changes were applied. The field where you typed help kept its previous value.",
    [Locale.ChineseTW]: "其他變更已套用；輸入 help 的欄位保留原本的值。",
    [Locale.ChineseCN]: "其他更改已应用；输入 help 的字段保留原有的值。",
    [Locale.Japanese]:
      "他の変更は適用されました。help と入力した欄は以前の値のままです。",
  } as LocaleRecord,
} as const;

/**
 * Get a localized "Default: {value}" label
 */
export function getDefaultValueLabel(locale: string, value: string): string {
  const marker = getLocalizedRequired(
    ADJUST_UI_LABELS.defaultMarker,
    locale,
    "Default",
  );
  return `${marker}: ${value}`;
}

// =============================================================================
// Fine-tune Help Card and Messages
// =============================================================================

const FINE_TUNE_HELP_MESSAGES: LocaleRecord = {
  [Locale.EnglishUS]: `**Fine-tune** (space-separated key=value pairs)
\`brightness\`, \`contrast\`: 0.1 to 3 (multiplier, 1 = unchanged)
\`saturation\`: 0 to 5 (0 = grayscale, 1 = unchanged)
\`hue\`: -360 to 360 (degrees)
\`alpha\`: 0 to 1 (opacity)
\`scale\`, \`scale_x\`, \`scale_y\`: 0.1 to 2 (resize factor)
\`rotate\`: -360 to 360 (degrees)
\`blur\`: 0.3 to 50, \`sharpen\`: 0.5 to 10 (strength)
\`tint\`: hex color overlay, RRGGBB or RRGGBBAA (e.g. \`tint=ff000066\` for a red rage effect)

**Filter settings**
Halftone: \`dot_size\` 4 to 24 (default 4), \`dot_angle\` 0 to 90 (default 45)
Dithering: \`px_size\` 1 to 8 (default 2), \`color_steps\` 2 to 8 (default 2)
Paper texture: \`grain\` 0.1 to 3 (default 1)
Heatmap has no settings.

**Output**
\`format\`: \`webp\` (default), \`png\`, \`jpg\` (attachment file format; jpg has no transparency)

Clearing a field resets it to the defaults.
Example: \`brightness=1.2 hue=90 tint=ff000055\``,
  [Locale.EnglishGB]: `**Fine-tune** (space-separated key=value pairs)
\`brightness\`, \`contrast\`: 0.1 to 3 (multiplier, 1 = unchanged)
\`saturation\`: 0 to 5 (0 = grayscale, 1 = unchanged)
\`hue\`: -360 to 360 (degrees)
\`alpha\`: 0 to 1 (opacity)
\`scale\`, \`scale_x\`, \`scale_y\`: 0.1 to 2 (resize factor)
\`rotate\`: -360 to 360 (degrees)
\`blur\`: 0.3 to 50, \`sharpen\`: 0.5 to 10 (strength)
\`tint\`: hex colour overlay, RRGGBB or RRGGBBAA (e.g. \`tint=ff000066\` for a red rage effect)

**Filter settings**
Halftone: \`dot_size\` 4 to 24 (default 4), \`dot_angle\` 0 to 90 (default 45)
Dithering: \`px_size\` 1 to 8 (default 2), \`color_steps\` 2 to 8 (default 2)
Paper texture: \`grain\` 0.1 to 3 (default 1)
Heatmap has no settings.

**Output**
\`format\`: \`webp\` (default), \`png\`, \`jpg\` (attachment file format; jpg has no transparency)

Clearing a field resets it to the defaults.
Example: \`brightness=1.2 hue=90 tint=ff000055\``,
  [Locale.ChineseTW]: `**微調**（以空格分隔的 key=value）
\`brightness\`、\`contrast\`：0.1 至 3（倍率，1 = 不變）
\`saturation\`：0 至 5（0 = 灰階，1 = 不變）
\`hue\`：-360 至 360（角度）
\`alpha\`：0 至 1（不透明度）
\`scale\`、\`scale_x\`、\`scale_y\`：0.1 至 2（縮放倍率）
\`rotate\`：-360 至 360（角度）
\`blur\`：0.3 至 50、\`sharpen\`：0.5 至 10（強度）
\`tint\`：十六進位顏色疊加，RRGGBB 或 RRGGBBAA（例如 \`tint=ff000066\` 呈現紅色憤怒效果）

**濾鏡設定**
半色調網點：\`dot_size\` 4 至 24（預設 4）、\`dot_angle\` 0 至 90（預設 45）
抖動：\`px_size\` 1 至 8（預設 2）、\`color_steps\` 2 至 8（預設 2）
紙張紋理：\`grain\` 0.1 至 3（預設 1）
熱力圖沒有設定項目。

**輸出**
\`format\`：\`webp\`（預設）、\`png\`、\`jpg\`（附件檔案格式；jpg 不支援透明）

清空欄位即可恢復預設值。
範例：\`brightness=1.2 hue=90 tint=ff000055\``,
  [Locale.ChineseCN]: `**微调**（以空格分隔的 key=value）
\`brightness\`、\`contrast\`：0.1 至 3（倍率，1 = 不变）
\`saturation\`：0 至 5（0 = 灰阶，1 = 不变）
\`hue\`：-360 至 360（角度）
\`alpha\`：0 至 1（不透明度）
\`scale\`、\`scale_x\`、\`scale_y\`：0.1 至 2（缩放倍率）
\`rotate\`：-360 至 360（角度）
\`blur\`：0.3 至 50、\`sharpen\`：0.5 至 10（强度）
\`tint\`：十六进制颜色叠加，RRGGBB 或 RRGGBBAA（例如 \`tint=ff000066\` 呈现红色愤怒效果）

**滤镜设置**
半色调网点：\`dot_size\` 4 至 24（默认 4）、\`dot_angle\` 0 至 90（默认 45）
抖动：\`px_size\` 1 至 8（默认 2）、\`color_steps\` 2 至 8（默认 2）
纸张纹理：\`grain\` 0.1 至 3（默认 1）
热力图没有设置项。

**输出**
\`format\`：\`webp\`（默认）、\`png\`、\`jpg\`（附件文件格式；jpg 不支持透明）

清空字段即可恢复默认值。
示例：\`brightness=1.2 hue=90 tint=ff000055\``,
  [Locale.Japanese]: `**微調整**（スペース区切りの key=value）
\`brightness\`、\`contrast\`：0.1～3（倍率、1 = 変更なし）
\`saturation\`：0～5（0 = グレースケール、1 = 変更なし）
\`hue\`：-360～360（度）
\`alpha\`：0～1（不透明度）
\`scale\`、\`scale_x\`、\`scale_y\`：0.1～2（拡大縮小率）
\`rotate\`：-360～360（度）
\`blur\`：0.3～50、\`sharpen\`：0.5～10（強さ）
\`tint\`：16進カラーオーバーレイ、RRGGBB または RRGGBBAA（例：\`tint=ff000066\` で赤い怒りの効果）

**フィルター設定**
ハーフトーン：\`dot_size\` 4～24（デフォルト4）、\`dot_angle\` 0～90（デフォルト45）
ディザリング：\`px_size\` 1～8（デフォルト2）、\`color_steps\` 2～8（デフォルト2）
紙のテクスチャ：\`grain\` 0.1～3（デフォルト1）
ヒートマップに設定はありません。

**出力**
\`format\`：\`webp\`（デフォルト）、\`png\`、\`jpg\`（添付ファイル形式。jpg は透過非対応）

欄を空にするとデフォルトに戻ります。
例：\`brightness=1.2 hue=90 tint=ff000055\``,
};

const FINE_TUNE_INVALID_PREFIXES: LocaleRecord = {
  [Locale.EnglishUS]: "Invalid input: {tokens}",
  [Locale.EnglishGB]: "Invalid input: {tokens}",
  [Locale.ChineseTW]: "無效的輸入：{tokens}",
  [Locale.ChineseCN]: "无效的输入：{tokens}",
  [Locale.Japanese]: "無効な入力です：{tokens}",
};

/**
 * Get the localized help card listing every fine-tune and filter-settings
 * key with its range
 */
export function getFineTuneHelpMessage(locale: string): string {
  return getLocalizedRequired(FINE_TUNE_HELP_MESSAGES, locale, "");
}

/**
 * Get the localized error message for invalid fine-tune or filter-settings
 * input, followed by the full help card
 */
export function getFineTuneInvalidMessage(
  locale: string,
  invalidTokens: string[],
): string {
  const prefix = formatLocalized(
    getLocalizedRequired(FINE_TUNE_INVALID_PREFIXES, locale, ""),
    { tokens: invalidTokens.join(", ") },
  );
  return `${prefix}\n\n${getFineTuneHelpMessage(locale)}`;
}

export type AdjustUILabelKey = keyof typeof ADJUST_UI_LABELS;

/**
 * Get a localized adjust UI label
 */
export function getAdjustUILabel(
  key: AdjustUILabelKey,
  locale: string,
): string {
  return getLocalizedRequired(ADJUST_UI_LABELS[key], locale, "");
}

// =============================================================================
// Filter Names
// =============================================================================

export const FILTER_NAME_LOCALIZATIONS: Record<ImageFilterId, LocaleRecord> = {
  none: {
    [Locale.EnglishUS]: "None",
    [Locale.EnglishGB]: "None",
    [Locale.ChineseTW]: "無",
    [Locale.ChineseCN]: "无",
    [Locale.Japanese]: "なし",
  },
  paper_texture: {
    [Locale.EnglishUS]: "Paper texture",
    [Locale.EnglishGB]: "Paper texture",
    [Locale.ChineseTW]: "紙張紋理",
    [Locale.ChineseCN]: "纸张纹理",
    [Locale.Japanese]: "紙のテクスチャ",
  },
  halftone_dots: {
    [Locale.EnglishUS]: "Halftone",
    [Locale.EnglishGB]: "Halftone",
    [Locale.ChineseTW]: "半色調網點",
    [Locale.ChineseCN]: "半色调网点",
    [Locale.Japanese]: "ハーフトーン",
  },
  image_dithering: {
    [Locale.EnglishUS]: "Dithering",
    [Locale.EnglishGB]: "Dithering",
    [Locale.ChineseTW]: "抖動",
    [Locale.ChineseCN]: "抖动",
    [Locale.Japanese]: "ディザリング",
  },
  heatmap: {
    [Locale.EnglishUS]: "Heatmap",
    [Locale.EnglishGB]: "Heatmap",
    [Locale.ChineseTW]: "熱力圖",
    [Locale.ChineseCN]: "热力图",
    [Locale.Japanese]: "ヒートマップ",
  },
};

/**
 * Get a localized filter name
 */
export function getFilterName(filter: ImageFilterId, locale: string): string {
  return getLocalizedRequired(FILTER_NAME_LOCALIZATIONS[filter], locale, filter);
}
