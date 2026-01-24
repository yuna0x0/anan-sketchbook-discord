/**
 * Background Localizations
 * Translations for dialogue command background names
 */

import { Locale, LocalizationMap } from "discord.js";

// =============================================================================
// Background Name Localizations
// =============================================================================

export const BACKGROUND_NAME_LOCALIZATIONS: Record<string, LocalizationMap> = {
  // 1_1: 牢房內部
  bg_001_001: {
    [Locale.EnglishUS]: "Cell Interior",
    [Locale.EnglishGB]: "Cell Interior",
    [Locale.ChineseCN]: "牢房内部",
    [Locale.ChineseTW]: "牢房內部",
    [Locale.Japanese]: "監房内部",
  },
  // 1_2: 牢房內部 (有看守)
  bg_001_002: {
    [Locale.EnglishUS]: "Cell Interior (with Guard)",
    [Locale.EnglishGB]: "Cell Interior (with Guard)",
    [Locale.ChineseCN]: "牢房内部 (有看守)",
    [Locale.ChineseTW]: "牢房內部 (有看守)",
    [Locale.Japanese]: "監房内部 (看守あり)",
  },
  // 2_1: 牢房走廊
  bg_002_001: {
    [Locale.EnglishUS]: "Cell Corridor",
    [Locale.EnglishGB]: "Cell Corridor",
    [Locale.ChineseCN]: "牢房走廊",
    [Locale.ChineseTW]: "牢房走廊",
    [Locale.Japanese]: "監房廊下",
  },
  // 3_1: 懲罰室外部 (未上鎖)
  bg_003_001: {
    [Locale.EnglishUS]: "Solitary Confinement Exterior (Unlocked)",
    [Locale.EnglishGB]: "Solitary Confinement Exterior (Unlocked)",
    [Locale.ChineseCN]: "惩罚室外部 (未上锁)",
    [Locale.ChineseTW]: "懲罰室外部 (未上鎖)",
    [Locale.Japanese]: "懲罰房外部 (未施錠)",
  },
  // 3_2: 懲罰室外部 (上鎖)
  bg_003_002: {
    [Locale.EnglishUS]: "Solitary Confinement Exterior (Locked)",
    [Locale.EnglishGB]: "Solitary Confinement Exterior (Locked)",
    [Locale.ChineseCN]: "惩罚室外部 (上锁)",
    [Locale.ChineseTW]: "懲罰室外部 (上鎖)",
    [Locale.Japanese]: "懲罰房外部 (施錠)",
  },
  // 4_1: 玄關大廳
  bg_004_001: {
    [Locale.EnglishUS]: "Entrance Hall",
    [Locale.EnglishGB]: "Entrance Hall",
    [Locale.ChineseCN]: "玄关大厅",
    [Locale.ChineseTW]: "玄關大廳",
    [Locale.Japanese]: "玄関ホール",
  },
  // 5_1: 會客廳 (弓弩)
  bg_005_001: {
    [Locale.EnglishUS]: "Parlor (with Crossbow)",
    [Locale.EnglishGB]: "Parlor (with Crossbow)",
    [Locale.ChineseCN]: "会客厅 (弓弩)",
    [Locale.ChineseTW]: "會客廳 (弓弩)",
    [Locale.Japanese]: "ラウンジ (弓弩あり)",
  },
  // 5_2: 會客廳 (沒弓弩)
  bg_005_002: {
    [Locale.EnglishUS]: "Parlor (without Crossbow)",
    [Locale.EnglishGB]: "Parlor (without Crossbow)",
    [Locale.ChineseCN]: "会客厅 (没弓弩)",
    [Locale.ChineseTW]: "會客廳 (沒弓弩)",
    [Locale.Japanese]: "ラウンジ (弓弩なし)",
  },
  // 6_1: 食堂
  bg_006_001: {
    [Locale.EnglishUS]: "Mess Hall",
    [Locale.EnglishGB]: "Mess Hall",
    [Locale.ChineseCN]: "食堂",
    [Locale.ChineseTW]: "食堂",
    [Locale.Japanese]: "食堂",
  },
  // 7_1: 醫務室 (夜晚)
  bg_007_001: {
    [Locale.EnglishUS]: "Infirmary (Night)",
    [Locale.EnglishGB]: "Infirmary (Night)",
    [Locale.ChineseCN]: "医务室 (夜晚)",
    [Locale.ChineseTW]: "醫務室 (夜晚)",
    [Locale.Japanese]: "医務室 (夜)",
  },
  // 7_2: 醫務室 (白天)
  bg_007_002: {
    [Locale.EnglishUS]: "Infirmary (Day)",
    [Locale.EnglishGB]: "Infirmary (Day)",
    [Locale.ChineseCN]: "医务室 (白天)",
    [Locale.ChineseTW]: "醫務室 (白天)",
    [Locale.Japanese]: "医務室 (昼)",
  },
  // 9_1: 走廊 (白天)
  bg_009_001: {
    [Locale.EnglishUS]: "Hallway (Day)",
    [Locale.EnglishGB]: "Hallway (Day)",
    [Locale.ChineseCN]: "走廊 (白天)",
    [Locale.ChineseTW]: "走廊 (白天)",
    [Locale.Japanese]: "廊下 (昼)",
  },
  // 9_2: 走廊 (夜晚)
  bg_009_002: {
    [Locale.EnglishUS]: "Hallway (Night)",
    [Locale.EnglishGB]: "Hallway (Night)",
    [Locale.ChineseCN]: "走廊 (夜晚)",
    [Locale.ChineseTW]: "走廊 (夜晚)",
    [Locale.Japanese]: "廊下 (夜)",
  },
  // 10_1: 玄關到二樓階梯
  bg_010_001: {
    [Locale.EnglishUS]: "Entrance to Second Floor Stairs",
    [Locale.EnglishGB]: "Entrance to Second Floor Stairs",
    [Locale.ChineseCN]: "玄关到二楼阶梯",
    [Locale.ChineseTW]: "玄關到二樓階梯",
    [Locale.Japanese]: "玄関から二階への階段",
  },
  // 11_1: 娛樂室
  bg_011_001: {
    [Locale.EnglishUS]: "Recreation Room",
    [Locale.EnglishGB]: "Recreation Room",
    [Locale.ChineseCN]: "娱乐室",
    [Locale.ChineseTW]: "娛樂室",
    [Locale.Japanese]: "娯楽室",
  },
  // 12_1: 圖書室
  bg_012_001: {
    [Locale.EnglishUS]: "Library",
    [Locale.EnglishGB]: "Library",
    [Locale.ChineseCN]: "图书室",
    [Locale.ChineseTW]: "圖書室",
    [Locale.Japanese]: "図書室",
  },
  // 13_1: 審判庭 (全景)
  bg_013_001: {
    [Locale.EnglishUS]: "Courtroom (Panoramic)",
    [Locale.EnglishGB]: "Courtroom (Panoramic)",
    [Locale.ChineseCN]: "审判庭 (全景)",
    [Locale.ChineseTW]: "審判庭 (全景)",
    [Locale.Japanese]: "裁判所 (全景)",
  },
  // 14_1: 審判庭 (特寫)
  bg_014_001: {
    [Locale.EnglishUS]: "Courtroom (Close-up)",
    [Locale.EnglishGB]: "Courtroom (Close-up)",
    [Locale.ChineseCN]: "审判庭 (特写)",
    [Locale.ChineseTW]: "審判庭 (特寫)",
    [Locale.Japanese]: "裁判所 (クローズアップ)",
  },
  // 16_1: 花田
  bg_016_001: {
    [Locale.EnglishUS]: "Flower Field",
    [Locale.EnglishGB]: "Flower Field",
    [Locale.ChineseCN]: "花田",
    [Locale.ChineseTW]: "花田",
    [Locale.Japanese]: "花畑",
  },
  // 17_1: 湖 (白天)
  bg_017_001: {
    [Locale.EnglishUS]: "Lake (Day)",
    [Locale.EnglishGB]: "Lake (Day)",
    [Locale.ChineseCN]: "湖 (白天)",
    [Locale.ChineseTW]: "湖 (白天)",
    [Locale.Japanese]: "湖 (昼)",
  },
  // 17_2: 湖 (夜晚)
  bg_017_002: {
    [Locale.EnglishUS]: "Lake (Night)",
    [Locale.EnglishGB]: "Lake (Night)",
    [Locale.ChineseCN]: "湖 (夜晚)",
    [Locale.ChineseTW]: "湖 (夜晚)",
    [Locale.Japanese]: "湖 (夜)",
  },
  // 18_1: 圍牆
  bg_018_001: {
    [Locale.EnglishUS]: "Wall",
    [Locale.EnglishGB]: "Wall",
    [Locale.ChineseCN]: "围墙",
    [Locale.ChineseTW]: "圍牆",
    [Locale.Japanese]: "塀",
  },
  // 19_1: 監牢入口 (白天)
  bg_019_001: {
    [Locale.EnglishUS]: "Prison Entrance (Day)",
    [Locale.EnglishGB]: "Prison Entrance (Day)",
    [Locale.ChineseCN]: "监牢入口 (白天)",
    [Locale.ChineseTW]: "監牢入口 (白天)",
    [Locale.Japanese]: "牢屋敷前 (昼)",
  },
  // 19_2: 監牢入口 (夜晚)
  bg_019_002: {
    [Locale.EnglishUS]: "Prison Entrance (Night)",
    [Locale.EnglishGB]: "Prison Entrance (Night)",
    [Locale.ChineseCN]: "监牢入口 (夜晚)",
    [Locale.ChineseTW]: "監牢入口 (夜晚)",
    [Locale.Japanese]: "牢屋敷前 (夜)",
  },
  // 20_1: 下水道
  bg_020_001: {
    [Locale.EnglishUS]: "Sewer",
    [Locale.EnglishGB]: "Sewer",
    [Locale.ChineseCN]: "下水道",
    [Locale.ChineseTW]: "下水道",
    [Locale.Japanese]: "下水道",
  },
  // 21_1: 懲罰室內部
  bg_021_001: {
    [Locale.EnglishUS]: "Solitary Confinement Interior",
    [Locale.EnglishGB]: "Solitary Confinement Interior",
    [Locale.ChineseCN]: "惩罚室内部",
    [Locale.ChineseTW]: "懲罰室內部",
    [Locale.Japanese]: "懲罰房内部",
  },
  // 22_1: 招待所外部 (白天)
  bg_022_001: {
    [Locale.EnglishUS]: "Guesthouse Exterior (Day)",
    [Locale.EnglishGB]: "Guesthouse Exterior (Day)",
    [Locale.ChineseCN]: "招待所外部 (白天)",
    [Locale.ChineseTW]: "招待所外部 (白天)",
    [Locale.Japanese]: "ゲストハウス前 (昼)",
  },
  // 22_2: 招待所外部 (夜晚)
  bg_022_002: {
    [Locale.EnglishUS]: "Guesthouse Exterior (Night)",
    [Locale.EnglishGB]: "Guesthouse Exterior (Night)",
    [Locale.ChineseCN]: "招待所外部 (夜晚)",
    [Locale.ChineseTW]: "招待所外部 (夜晚)",
    [Locale.Japanese]: "ゲストハウス前 (夜)",
  },
  // 22_3: 招待所燃燒及紅色顏料
  bg_022_003: {
    [Locale.EnglishUS]: "Guesthouse Burning & Red Paint",
    [Locale.EnglishGB]: "Guesthouse Burning & Red Paint",
    [Locale.ChineseCN]: "招待所燃烧及红色颜料",
    [Locale.ChineseTW]: "招待所燃燒及紅色顏料",
    [Locale.Japanese]: "ゲストハウス炎上・赤い絵の具",
  },
  // 22_4: 招待所及紅色顏料
  bg_022_004: {
    [Locale.EnglishUS]: "Guesthouse & Red Paint",
    [Locale.EnglishGB]: "Guesthouse & Red Paint",
    [Locale.ChineseCN]: "招待所及红色颜料",
    [Locale.ChineseTW]: "招待所及紅色顏料",
    [Locale.Japanese]: "ゲストハウス・赤い絵の具",
  },
  // 23_1: 新地精之室內部 (白天 / 歪斜 / 原火精之室)
  bg_023_001: {
    [Locale.EnglishUS]:
      "New Gnome Chamber Interior (Day / Tilted / Former Salamander Chamber)",
    [Locale.EnglishGB]:
      "New Gnome Chamber Interior (Day / Tilted / Former Salamander Chamber)",
    [Locale.ChineseCN]: "新地精之室内部 (白天 / 歪斜 / 原火精之室)",
    [Locale.ChineseTW]: "新地精之室內部 (白天 / 歪斜 / 原火精之室)",
    [Locale.Japanese]: "新地精の間内部 (昼 / 傾斜 / 旧火精の間)",
  },
  // 23_2: 原地精之室內部 (白天)
  bg_023_002: {
    [Locale.EnglishUS]: "Original Gnome Chamber Interior (Day)",
    [Locale.EnglishGB]: "Original Gnome Chamber Interior (Day)",
    [Locale.ChineseCN]: "原地精之室内部 (白天)",
    [Locale.ChineseTW]: "原地精之室內部 (白天)",
    [Locale.Japanese]: "旧地精の間内部 (昼)",
  },
  // 23_3: 水精之室 (白天)
  bg_023_003: {
    [Locale.EnglishUS]: "Undine Chamber (Day)",
    [Locale.EnglishGB]: "Undine Chamber (Day)",
    [Locale.ChineseCN]: "水精之室 (白天)",
    [Locale.ChineseTW]: "水精之室 (白天)",
    [Locale.Japanese]: "水精の間 (昼)",
  },
  // 23_4: 水精之室 (白天 / 密道開啟)
  bg_023_004: {
    [Locale.EnglishUS]: "Undine Chamber (Day / Secret Passage Open)",
    [Locale.EnglishGB]: "Undine Chamber (Day / Secret Passage Open)",
    [Locale.ChineseCN]: "水精之室 (白天 / 密道开启)",
    [Locale.ChineseTW]: "水精之室 (白天 / 密道開啟)",
    [Locale.Japanese]: "水精の間 (昼 / 隠し通路開)",
  },
  // 23_5: 燃燒後的新火精之室 (白天 / 歪斜 / 原地精之室)
  bg_023_005: {
    [Locale.EnglishUS]:
      "Burned New Salamander Chamber (Day / Tilted / Former Gnome Chamber)",
    [Locale.EnglishGB]:
      "Burned New Salamander Chamber (Day / Tilted / Former Gnome Chamber)",
    [Locale.ChineseCN]: "燃烧后的新火精之室 (白天 / 歪斜 / 原地精之室)",
    [Locale.ChineseTW]: "燃燒後的新火精之室 (白天 / 歪斜 / 原地精之室)",
    [Locale.Japanese]: "炎上後の新火精の間 (昼 / 傾斜 / 旧地精の間)",
  },
  // 23_6: 水精之室 (夜晚)
  bg_023_006: {
    [Locale.EnglishUS]: "Undine Chamber (Night)",
    [Locale.EnglishGB]: "Undine Chamber (Night)",
    [Locale.ChineseCN]: "水精之室 (夜晚)",
    [Locale.ChineseTW]: "水精之室 (夜晚)",
    [Locale.Japanese]: "水精の間 (夜)",
  },
  // 23_7: 原火精之室 (夜晚)
  bg_023_007: {
    [Locale.EnglishUS]: "Original Salamander Chamber (Night)",
    [Locale.EnglishGB]: "Original Salamander Chamber (Night)",
    [Locale.ChineseCN]: "原火精之室 (夜晚)",
    [Locale.ChineseTW]: "原火精之室 (夜晚)",
    [Locale.Japanese]: "旧火精の間 (夜)",
  },
  // 23_8: 水精之室 (夜晚 / 密道開啟)
  bg_023_008: {
    [Locale.EnglishUS]: "Undine Chamber (Night / Secret Passage Open)",
    [Locale.EnglishGB]: "Undine Chamber (Night / Secret Passage Open)",
    [Locale.ChineseCN]: "水精之室 (夜晚 / 密道开启)",
    [Locale.ChineseTW]: "水精之室 (夜晚 / 密道開啟)",
    [Locale.Japanese]: "水精の間 (夜 / 隠し通路開)",
  },
  // 24_1: 倉庫
  bg_024_001: {
    [Locale.EnglishUS]: "Warehouse",
    [Locale.EnglishGB]: "Warehouse",
    [Locale.ChineseCN]: "仓库",
    [Locale.ChineseTW]: "倉庫",
    [Locale.Japanese]: "倉庫",
  },
  // 24_2: 倉庫 (彈痕)
  bg_024_002: {
    [Locale.EnglishUS]: "Warehouse (Bullet Holes)",
    [Locale.EnglishGB]: "Warehouse (Bullet Holes)",
    [Locale.ChineseCN]: "仓库 (弹痕)",
    [Locale.ChineseTW]: "倉庫 (彈痕)",
    [Locale.Japanese]: "倉庫 (弾痕)",
  },
  // 25_1: 地下控制室
  bg_025_001: {
    [Locale.EnglishUS]: "Underground Control Room",
    [Locale.EnglishGB]: "Underground Control Room",
    [Locale.ChineseCN]: "地下控制室",
    [Locale.ChineseTW]: "地下控制室",
    [Locale.Japanese]: "地下制御室",
  },
  // 25_2: 地下控制室 (通風管道開啟)
  bg_025_002: {
    [Locale.EnglishUS]: "Underground Control Room (Vent Open)",
    [Locale.EnglishGB]: "Underground Control Room (Vent Open)",
    [Locale.ChineseCN]: "地下控制室 (通风管道开启)",
    [Locale.ChineseTW]: "地下控制室 (通風管道開啟)",
    [Locale.Japanese]: "地下制御室 (換気口開)",
  },
  // 26_1: 地下冷凍庫
  bg_026_001: {
    [Locale.EnglishUS]: "Underground Freezer",
    [Locale.EnglishGB]: "Underground Freezer",
    [Locale.ChineseCN]: "地下冷冻库",
    [Locale.ChineseTW]: "地下冷凍庫",
    [Locale.Japanese]: "地下冷凍庫",
  },
  // 27_1: 焚燒爐
  bg_027_001: {
    [Locale.EnglishUS]: "Incinerator",
    [Locale.EnglishGB]: "Incinerator",
    [Locale.ChineseCN]: "焚烧炉",
    [Locale.ChineseTW]: "焚燒爐",
    [Locale.Japanese]: "焼却炉",
  },
  // 28_1: 中廳 (白天)
  bg_028_001: {
    [Locale.EnglishUS]: "Central Hall (Day)",
    [Locale.EnglishGB]: "Central Hall (Day)",
    [Locale.ChineseCN]: "中厅 (白天)",
    [Locale.ChineseTW]: "中廳 (白天)",
    [Locale.Japanese]: "中央ホール (昼)",
  },
  // 28_2: 中廳 (夜晚)
  bg_028_002: {
    [Locale.EnglishUS]: "Central Hall (Night)",
    [Locale.EnglishGB]: "Central Hall (Night)",
    [Locale.ChineseCN]: "中厅 (夜晚)",
    [Locale.ChineseTW]: "中廳 (夜晚)",
    [Locale.Japanese]: "中央ホール (夜)",
  },
  // 29_1: 諾亞的畫室 (白天)
  bg_029_001: {
    [Locale.EnglishUS]: "Noa's Studio (Day)",
    [Locale.EnglishGB]: "Noa's Studio (Day)",
    [Locale.ChineseCN]: "诺亚的画室 (白天)",
    [Locale.ChineseTW]: "諾亞的畫室 (白天)",
    [Locale.Japanese]: "ノアのアトリエ (昼)",
  },
  // 29_2: 諾亞的畫室 (夜晚)
  bg_029_002: {
    [Locale.EnglishUS]: "Noa's Studio (Night)",
    [Locale.EnglishGB]: "Noa's Studio (Night)",
    [Locale.ChineseCN]: "诺亚的画室 (夜晚)",
    [Locale.ChineseTW]: "諾亞的畫室 (夜晚)",
    [Locale.Japanese]: "ノアのアトリエ (夜)",
  },
  // 30_1: 淋浴房
  bg_030_001: {
    [Locale.EnglishUS]: "Showers",
    [Locale.EnglishGB]: "Showers",
    [Locale.ChineseCN]: "淋浴房",
    [Locale.ChineseTW]: "淋浴房",
    [Locale.Japanese]: "シャワールーム",
  },
  // 30_2: 淋浴房 (有諾亞的畫)
  bg_030_002: {
    [Locale.EnglishUS]: "Showers (with Noa's Painting)",
    [Locale.EnglishGB]: "Showers (with Noa's Painting)",
    [Locale.ChineseCN]: "淋浴房 (有诺亚的画)",
    [Locale.ChineseTW]: "淋浴房 (有諾亞的畫)",
    [Locale.Japanese]: "シャワールーム (ノアの絵あり)",
  },
  // 31_1: 通往地下的電梯 (門關閉)
  bg_031_001: {
    [Locale.EnglishUS]: "Elevator to Underground (Door Closed)",
    [Locale.EnglishGB]: "Elevator to Underground (Door Closed)",
    [Locale.ChineseCN]: "通往地下的电梯 (门关闭)",
    [Locale.ChineseTW]: "通往地下的電梯 (門關閉)",
    [Locale.Japanese]: "地下へのエレベーター (扉閉)",
  },
  // 31_2: 通往地下的電梯 (門開啟)
  bg_031_002: {
    [Locale.EnglishUS]: "Elevator to Underground (Door Open)",
    [Locale.EnglishGB]: "Elevator to Underground (Door Open)",
    [Locale.ChineseCN]: "通往地下的电梯 (门开启)",
    [Locale.ChineseTW]: "通往地下的電梯 (門開啟)",
    [Locale.Japanese]: "地下へのエレベーター (扉開)",
  },
  // 31_3: 通往地下的電梯 (門開啟 / 頂蓋開啟)
  bg_031_003: {
    [Locale.EnglishUS]: "Elevator to Underground (Door Open / Hatch Open)",
    [Locale.EnglishGB]: "Elevator to Underground (Door Open / Hatch Open)",
    [Locale.ChineseCN]: "通往地下的电梯 (门开启 / 顶盖开启)",
    [Locale.ChineseTW]: "通往地下的電梯 (門開啟 / 頂蓋開啟)",
    [Locale.Japanese]: "地下へのエレベーター (扉開 / 天井開)",
  },
  // 31_4: 通往地下的電梯 (門關閉 / 旁邊有人字梯)
  bg_031_004: {
    [Locale.EnglishUS]:
      "Elevator to Underground (Door Closed / Stepladder Nearby)",
    [Locale.EnglishGB]:
      "Elevator to Underground (Door Closed / Stepladder Nearby)",
    [Locale.ChineseCN]: "通往地下的电梯 (门关闭 / 旁边有人字梯)",
    [Locale.ChineseTW]: "通往地下的電梯 (門關閉 / 旁邊有人字梯)",
    [Locale.Japanese]: "地下へのエレベーター (扉閉 / 脚立あり)",
  },
  // 31_5: 通往地下的電梯 (門開啟 / 頂蓋開啟 / 旁邊有人字梯)
  bg_031_005: {
    [Locale.EnglishUS]:
      "Elevator to Underground (Door Open / Hatch Open / Stepladder Nearby)",
    [Locale.EnglishGB]:
      "Elevator to Underground (Door Open / Hatch Open / Stepladder Nearby)",
    [Locale.ChineseCN]: "通往地下的电梯 (门开启 / 顶盖开启 / 旁边有人字梯)",
    [Locale.ChineseTW]: "通往地下的電梯 (門開啟 / 頂蓋開啟 / 旁邊有人字梯)",
    [Locale.Japanese]: "地下へのエレベーター (扉開 / 天井開 / 脚立あり)",
  },
  // 32_1: 天空
  bg_032_001: {
    [Locale.EnglishUS]: "Sky",
    [Locale.EnglishGB]: "Sky",
    [Locale.ChineseCN]: "天空",
    [Locale.ChineseTW]: "天空",
    [Locale.Japanese]: "空",
  },
  // 33_1: 星空
  bg_033_001: {
    [Locale.EnglishUS]: "Starry Sky",
    [Locale.EnglishGB]: "Starry Sky",
    [Locale.ChineseCN]: "星空",
    [Locale.ChineseTW]: "星空",
    [Locale.Japanese]: "星空",
  },
  // 34_1: 虛空
  bg_034_001: {
    [Locale.EnglishUS]: "Void",
    [Locale.EnglishGB]: "Void",
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
    return localization[locale as Locale] ?? backgroundId;
  }

  // Fall back to English for unsupported locales
  if (englishLocales.includes(locale as Locale) || !(locale in localization)) {
    return localization[Locale.EnglishUS] ?? backgroundId;
  }

  return backgroundId;
}
