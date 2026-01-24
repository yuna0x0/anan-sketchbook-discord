/**
 * Dialogue Characters Configuration
 * Character definitions including expressions, theme colors, and localized name configs
 */

import { Locale } from "discord.js";
import { RGBColor } from "../types.js";

// Name text configuration for rendering character names
export interface NameTextConfig {
  text: string;
  position: { x: number; y: number };
  fontColor: RGBColor;
  fontSize: number;
}

// Supported locales for name configuration (using Discord Locale)
export type NameConfigLocale = Locale;

// Localized name configurations (partial record of Discord Locale to name config)
export type LocalizedNameConfig = Partial<
  Record<NameConfigLocale, NameTextConfig[]>
>;

// Character information
export interface CharacterInfo {
  id: string;
  expressions: string[];
  themeColor: RGBColor;
  nameConfig: LocalizedNameConfig;
}

// All available characters
export const CHARACTERS: Record<string, CharacterInfo> = {
  ema: {
    id: "ema",
    expressions: [
      "ema_expression_1",
      "ema_expression_2",
      "ema_expression_3",
      "ema_expression_4",
      "ema_expression_5",
      "ema_expression_6",
      "ema_expression_7",
      "ema_expression_8",
    ],
    themeColor: { r: 253, g: 145, b: 175 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "樱",
          position: { x: 759, y: 73 },
          fontColor: { r: 253, g: 145, b: 175 },
          fontSize: 186,
        },
        {
          text: "羽",
          position: { x: 949, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "艾",
          position: { x: 1039, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "玛",
          position: { x: 1183, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "櫻",
          position: { x: 759, y: 73 },
          fontColor: { r: 253, g: 145, b: 175 },
          fontSize: 186,
        },
        {
          text: "羽",
          position: { x: 949, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "艾",
          position: { x: 1039, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "瑪",
          position: { x: 1183, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "桜",
          position: { x: 759, y: 73 },
          fontColor: { r: 253, g: 145, b: 175 },
          fontSize: 186,
        },
        {
          text: "羽",
          position: { x: 949, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "エ",
          position: { x: 1039, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "マ",
          position: { x: 1195, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  hiro: {
    id: "hiro",
    expressions: [
      "hiro_expression_1",
      "hiro_expression_2",
      "hiro_expression_3",
      "hiro_expression_4",
      "hiro_expression_5",
      "hiro_expression_6",
    ],
    themeColor: { r: 239, g: 79, b: 84 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "二",
          position: { x: 759, y: 63 },
          fontColor: { r: 239, g: 79, b: 84 },
          fontSize: 196,
        },
        {
          text: "阶堂",
          position: { x: 955, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "希",
          position: { x: 1143, y: 110 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "罗",
          position: { x: 1283, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "二",
          position: { x: 759, y: 63 },
          fontColor: { r: 239, g: 79, b: 84 },
          fontSize: 196,
        },
        {
          text: "階堂",
          position: { x: 955, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "希",
          position: { x: 1143, y: 110 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "羅",
          position: { x: 1283, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "二",
          position: { x: 759, y: 63 },
          fontColor: { r: 239, g: 79, b: 84 },
          fontSize: 196,
        },
        {
          text: "階堂",
          position: { x: 955, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "ヒ",
          position: { x: 1123, y: 110 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "ロ",
          position: { x: 1253, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  sherry: {
    id: "sherry",
    expressions: [
      "sherry_expression_1",
      "sherry_expression_2",
      "sherry_expression_3",
      "sherry_expression_4",
      "sherry_expression_5",
      "sherry_expression_6",
      "sherry_expression_7",
    ],
    themeColor: { r: 137, g: 177, b: 251 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "橘",
          position: { x: 759, y: 73 },
          fontColor: { r: 137, g: 177, b: 251 },
          fontSize: 186,
        },
        {
          text: "雪",
          position: { x: 943, y: 110 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "莉",
          position: { x: 1093, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "橘",
          position: { x: 759, y: 73 },
          fontColor: { r: 137, g: 177, b: 251 },
          fontSize: 186,
        },
        {
          text: "雪",
          position: { x: 943, y: 110 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "莉",
          position: { x: 1093, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "橘",
          position: { x: 759, y: 73 },
          fontColor: { r: 137, g: 177, b: 251 },
          fontSize: 186,
        },
        {
          text: "シェ",
          position: { x: 943, y: 110 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "リー",
          position: { x: 1223, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  hanna: {
    id: "hanna",
    expressions: [
      "hanna_expression_1",
      "hanna_expression_2",
      "hanna_expression_3",
      "hanna_expression_4",
      "hanna_expression_5",
    ],
    themeColor: { r: 169, g: 199, b: 30 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "远",
          position: { x: 759, y: 73 },
          fontColor: { r: 169, g: 199, b: 30 },
          fontSize: 186,
        },
        {
          text: "野",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "汉",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "娜",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "遠",
          position: { x: 759, y: 73 },
          fontColor: { r: 169, g: 199, b: 30 },
          fontSize: 186,
        },
        {
          text: "野",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "漢",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "娜",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "遠",
          position: { x: 759, y: 73 },
          fontColor: { r: 169, g: 199, b: 30 },
          fontSize: 186,
        },
        {
          text: "野",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "ハン",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "ナ",
          position: { x: 1320, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  anan: {
    id: "anan",
    expressions: [
      "anan_expression_1",
      "anan_expression_2",
      "anan_expression_3",
      "anan_expression_4",
      "anan_expression_5",
      "anan_expression_6",
      "anan_expression_7",
      "anan_expression_8",
      "anan_expression_9",
    ],
    themeColor: { r: 159, g: 145, b: 251 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "夏",
          position: { x: 759, y: 73 },
          fontColor: { r: 159, g: 145, b: 251 },
          fontSize: 186,
        },
        {
          text: "目",
          position: { x: 949, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "安",
          position: { x: 1039, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "安",
          position: { x: 1183, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "夏",
          position: { x: 759, y: 73 },
          fontColor: { r: 159, g: 145, b: 251 },
          fontSize: 186,
        },
        {
          text: "目",
          position: { x: 949, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "安",
          position: { x: 1039, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "安",
          position: { x: 1183, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "夏",
          position: { x: 759, y: 73 },
          fontColor: { r: 159, g: 145, b: 251 },
          fontSize: 186,
        },
        {
          text: "目",
          position: { x: 949, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "アン",
          position: { x: 1039, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "アン",
          position: { x: 1317, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  yuki: {
    id: "yuki",
    expressions: [
      "yuki_expression_1",
      "yuki_expression_2",
      "yuki_expression_3",
      "yuki_expression_4",
      "yuki_expression_5",
      "yuki_expression_6",
      "yuki_expression_7",
      "yuki_expression_8",
      "yuki_expression_9",
      "yuki_expression_10",
      "yuki_expression_11",
      "yuki_expression_12",
      "yuki_expression_13",
      "yuki_expression_14",
      "yuki_expression_15",
      "yuki_expression_16",
      "yuki_expression_17",
      "yuki_expression_18",
    ],
    themeColor: { r: 195, g: 209, b: 231 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "月",
          position: { x: 759, y: 63 },
          fontColor: { r: 195, g: 209, b: 231 },
          fontSize: 196,
        },
        {
          text: "代",
          position: { x: 948, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "雪",
          position: { x: 1053, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "月",
          position: { x: 759, y: 63 },
          fontColor: { r: 195, g: 209, b: 231 },
          fontSize: 196,
        },
        {
          text: "代",
          position: { x: 948, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "雪",
          position: { x: 1053, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "月",
          position: { x: 759, y: 63 },
          fontColor: { r: 195, g: 209, b: 231 },
          fontSize: 196,
        },
        {
          text: "代",
          position: { x: 948, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "ユキ",
          position: { x: 1053, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
      ],
    },
  },
  meruru: {
    id: "meruru",
    expressions: [
      "meruru_expression_1",
      "meruru_expression_2",
      "meruru_expression_3",
      "meruru_expression_4",
      "meruru_expression_5",
      "meruru_expression_6",
    ],
    themeColor: { r: 227, g: 185, b: 175 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "冰",
          position: { x: 759, y: 73 },
          fontColor: { r: 227, g: 185, b: 175 },
          fontSize: 186,
        },
        {
          text: "上",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "梅",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "露露",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "冰",
          position: { x: 759, y: 73 },
          fontColor: { r: 227, g: 185, b: 175 },
          fontSize: 186,
        },
        {
          text: "上",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "梅",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "露露",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "氷",
          position: { x: 759, y: 73 },
          fontColor: { r: 227, g: 185, b: 175 },
          fontSize: 186,
        },
        {
          text: "上",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "メル",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "ル",
          position: { x: 1330, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  noa: {
    id: "noa",
    expressions: [
      "noa_expression_1",
      "noa_expression_2",
      "noa_expression_3",
      "noa_expression_4",
      "noa_expression_5",
      "noa_expression_6",
    ],
    themeColor: { r: 104, g: 223, b: 231 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "城",
          position: { x: 759, y: 73 },
          fontColor: { r: 104, g: 223, b: 231 },
          fontSize: 186,
        },
        {
          text: "崎",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "诺",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "亚",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "城",
          position: { x: 759, y: 73 },
          fontColor: { r: 104, g: 223, b: 231 },
          fontSize: 186,
        },
        {
          text: "崎",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "諾",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "亞",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "城",
          position: { x: 759, y: 73 },
          fontColor: { r: 104, g: 223, b: 231 },
          fontSize: 186,
        },
        {
          text: "ケ崎",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "ノ",
          position: { x: 1130, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "ア",
          position: { x: 1280, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  reia: {
    id: "reia",
    expressions: [
      "reia_expression_1",
      "reia_expression_2",
      "reia_expression_3",
      "reia_expression_4",
      "reia_expression_5",
      "reia_expression_6",
      "reia_expression_7",
    ],
    themeColor: { r: 253, g: 177, b: 88 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "莲",
          position: { x: 759, y: 73 },
          fontColor: { r: 253, g: 177, b: 88 },
          fontSize: 186,
        },
        {
          text: "见",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "蕾",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "雅",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "蓮",
          position: { x: 759, y: 73 },
          fontColor: { r: 253, g: 177, b: 88 },
          fontSize: 186,
        },
        {
          text: "見",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "蕾",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "雅",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "蓮",
          position: { x: 759, y: 73 },
          fontColor: { r: 253, g: 177, b: 88 },
          fontSize: 186,
        },
        {
          text: "見",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "レイ",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "ア",
          position: { x: 1320, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  miria: {
    id: "miria",
    expressions: [
      "miria_expression_1",
      "miria_expression_2",
      "miria_expression_3",
      "miria_expression_4",
    ],
    themeColor: { r: 235, g: 207, b: 139 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "佐",
          position: { x: 759, y: 73 },
          fontColor: { r: 235, g: 207, b: 139 },
          fontSize: 186,
        },
        {
          text: "伯",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "米",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "莉亚",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "佐",
          position: { x: 759, y: 73 },
          fontColor: { r: 235, g: 207, b: 139 },
          fontSize: 186,
        },
        {
          text: "伯",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "米",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "莉亞",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "佐",
          position: { x: 759, y: 73 },
          fontColor: { r: 235, g: 207, b: 139 },
          fontSize: 186,
        },
        {
          text: "伯",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "ミリ",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "ア",
          position: { x: 1320, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  nanoka: {
    id: "nanoka",
    expressions: [
      "nanoka_expression_1",
      "nanoka_expression_2",
      "nanoka_expression_3",
      "nanoka_expression_4",
      "nanoka_expression_5",
    ],
    themeColor: { r: 131, g: 143, b: 147 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "黑",
          position: { x: 759, y: 63 },
          fontColor: { r: 131, g: 143, b: 147 },
          fontSize: 196,
        },
        {
          text: "部",
          position: { x: 955, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "奈",
          position: { x: 1053, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "叶香",
          position: { x: 1197, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "黑",
          position: { x: 759, y: 63 },
          fontColor: { r: 131, g: 143, b: 147 },
          fontSize: 196,
        },
        {
          text: "部",
          position: { x: 955, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "奈",
          position: { x: 1053, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "葉香",
          position: { x: 1197, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "黒",
          position: { x: 759, y: 63 },
          fontColor: { r: 131, g: 143, b: 147 },
          fontSize: 196,
        },
        {
          text: "部",
          position: { x: 955, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "ナノ",
          position: { x: 1053, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "カ",
          position: { x: 1331, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  margo: {
    id: "margo",
    expressions: [
      "margo_expression_1",
      "margo_expression_2",
      "margo_expression_3",
      "margo_expression_4",
      "margo_expression_5",
    ],
    themeColor: { r: 185, g: 124, b: 235 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "宝",
          position: { x: 759, y: 73 },
          fontColor: { r: 185, g: 124, b: 235 },
          fontSize: 186,
        },
        {
          text: "生",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "玛",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "格",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "寶",
          position: { x: 759, y: 73 },
          fontColor: { r: 185, g: 124, b: 235 },
          fontSize: 186,
        },
        {
          text: "生",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "瑪",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "格",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "宝",
          position: { x: 759, y: 73 },
          fontColor: { r: 185, g: 124, b: 235 },
          fontSize: 186,
        },
        {
          text: "生",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "マー",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "ゴ",
          position: { x: 1340, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  alisa: {
    id: "alisa",
    expressions: [
      "alisa_expression_1",
      "alisa_expression_2",
      "alisa_expression_3",
      "alisa_expression_4",
      "alisa_expression_5",
      "alisa_expression_6",
    ],
    themeColor: { r: 235, g: 75, b: 60 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "紫",
          position: { x: 759, y: 73 },
          fontColor: { r: 235, g: 75, b: 60 },
          fontSize: 186,
        },
        {
          text: "藤",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "亚",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "里沙",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "紫",
          position: { x: 759, y: 73 },
          fontColor: { r: 235, g: 75, b: 60 },
          fontSize: 186,
        },
        {
          text: "藤",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "亞",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "里沙",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "紫",
          position: { x: 759, y: 73 },
          fontColor: { r: 235, g: 75, b: 60 },
          fontSize: 186,
        },
        {
          text: "藤",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "アリ",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "サ",
          position: { x: 1320, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
  coco: {
    id: "coco",
    expressions: [
      "coco_expression_1",
      "coco_expression_2",
      "coco_expression_3",
      "coco_expression_4",
      "coco_expression_5",
    ],
    themeColor: { r: 251, g: 114, b: 78 },
    nameConfig: {
      [Locale.ChineseCN]: [
        {
          text: "泽",
          position: { x: 759, y: 73 },
          fontColor: { r: 251, g: 114, b: 78 },
          fontSize: 186,
        },
        {
          text: "渡",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "可",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "可",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.ChineseTW]: [
        {
          text: "澤",
          position: { x: 759, y: 73 },
          fontColor: { r: 251, g: 114, b: 78 },
          fontSize: 186,
        },
        {
          text: "渡",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "可",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "可",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
      [Locale.Japanese]: [
        {
          text: "沢",
          position: { x: 759, y: 73 },
          fontColor: { r: 251, g: 114, b: 78 },
          fontSize: 186,
        },
        {
          text: "渡",
          position: { x: 945, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
        {
          text: "コ",
          position: { x: 1042, y: 117 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 147,
        },
        {
          text: "コ",
          position: { x: 1186, y: 175 },
          fontColor: { r: 255, g: 255, b: 255 },
          fontSize: 92,
        },
      ],
    },
  },
};

// Character IDs as a type
export type CharacterId = keyof typeof CHARACTERS;

// Get character by ID
export function getCharacter(id: string): CharacterInfo | undefined {
  return CHARACTERS[id];
}

// Get all character IDs
export function getCharacterIds(): CharacterId[] {
  return Object.keys(CHARACTERS) as CharacterId[];
}

// Get expression number from expression name for a character
export function getExpressionNumber(
  character: CharacterInfo,
  expressionName: string,
): number | undefined {
  const index = character.expressions.indexOf(expressionName);
  return index >= 0 ? index + 1 : undefined;
}

// Get all expression names for a character
export function getExpressionNames(character: CharacterInfo): string[] {
  return character.expressions;
}

// Fallback locale when requested locale is not available for a character
export const FALLBACK_NAME_LOCALE: NameConfigLocale = Locale.Japanese;

// Get name config for a specific locale, falling back to FALLBACK_NAME_LOCALE
export function getNameConfig(
  character: CharacterInfo,
  locale: NameConfigLocale,
): NameTextConfig[] {
  return (
    character.nameConfig[locale] ??
    character.nameConfig[FALLBACK_NAME_LOCALE] ??
    []
  );
}
