/**
 * Dialogue Character Localizations
 * Contains character name localizations for the dialogue command
 */

import { Locale, LocalizationMap } from "discord.js";
import { CharacterId } from "../../config/dialogue/characters.js";
import { LocaleRecord, getLocalized } from "../types.js";

// =============================================================================
// Character Name Localizations
// =============================================================================

export const CHARACTER_NAME_LOCALIZATIONS: Record<
  CharacterId,
  LocalizationMap
> = {
  ema: {
    [Locale.EnglishUS]: "Sakuraba Ema",
    [Locale.EnglishGB]: "Sakuraba Ema",
    [Locale.ChineseTW]: "櫻羽艾瑪",
    [Locale.ChineseCN]: "樱羽艾玛",
    [Locale.Japanese]: "桜羽エマ",
  },
  hiro: {
    [Locale.EnglishUS]: "Nikaido Hiro",
    [Locale.EnglishGB]: "Nikaido Hiro",
    [Locale.ChineseTW]: "二階堂希羅",
    [Locale.ChineseCN]: "二阶堂希罗",
    [Locale.Japanese]: "二階堂ヒロ",
  },
  sherry: {
    [Locale.EnglishUS]: "Tachibana Sherry",
    [Locale.EnglishGB]: "Tachibana Sherry",
    [Locale.ChineseTW]: "橘雪莉",
    [Locale.ChineseCN]: "橘雪莉",
    [Locale.Japanese]: "橘シェリー",
  },
  hanna: {
    [Locale.EnglishUS]: "Toono Hanna",
    [Locale.EnglishGB]: "Toono Hanna",
    [Locale.ChineseTW]: "遠野漢娜",
    [Locale.ChineseCN]: "远野汉娜",
    [Locale.Japanese]: "遠野ハンナ",
  },
  anan: {
    [Locale.EnglishUS]: "Natsume Anan",
    [Locale.EnglishGB]: "Natsume Anan",
    [Locale.ChineseTW]: "夏目安安",
    [Locale.ChineseCN]: "夏目安安",
    [Locale.Japanese]: "夏目アンアン",
  },
  yuki: {
    [Locale.EnglishUS]: "Tsukishiro Yuki",
    [Locale.EnglishGB]: "Tsukishiro Yuki",
    [Locale.ChineseTW]: "月代雪",
    [Locale.ChineseCN]: "月代雪",
    [Locale.Japanese]: "月代ユキ",
  },
  meruru: {
    [Locale.EnglishUS]: "Hikami Meruru",
    [Locale.EnglishGB]: "Hikami Meruru",
    [Locale.ChineseTW]: "冰上梅露露",
    [Locale.ChineseCN]: "冰上梅露露",
    [Locale.Japanese]: "氷上メルル",
  },
  noa: {
    [Locale.EnglishUS]: "Jougasaki Noa",
    [Locale.EnglishGB]: "Jougasaki Noa",
    [Locale.ChineseTW]: "城崎諾亞",
    [Locale.ChineseCN]: "城崎诺亚",
    [Locale.Japanese]: "城ケ崎ノア",
  },
  reia: {
    [Locale.EnglishUS]: "Hasumi Reia",
    [Locale.EnglishGB]: "Hasumi Reia",
    [Locale.ChineseTW]: "蓮見蕾雅",
    [Locale.ChineseCN]: "莲见蕾雅",
    [Locale.Japanese]: "蓮見レイア",
  },
  miria: {
    [Locale.EnglishUS]: "Saeki Miria",
    [Locale.EnglishGB]: "Saeki Miria",
    [Locale.ChineseTW]: "佐伯米莉亞",
    [Locale.ChineseCN]: "佐伯米莉亚",
    [Locale.Japanese]: "佐伯ミリア",
  },
  nanoka: {
    [Locale.EnglishUS]: "Kurobe Nanoka",
    [Locale.EnglishGB]: "Kurobe Nanoka",
    [Locale.ChineseTW]: "黑部奈葉香",
    [Locale.ChineseCN]: "黑部奈叶香",
    [Locale.Japanese]: "黒部ナノカ",
  },
  margo: {
    [Locale.EnglishUS]: "Houshou Margo",
    [Locale.EnglishGB]: "Houshou Margo",
    [Locale.ChineseTW]: "寶生瑪格",
    [Locale.ChineseCN]: "宝生玛格",
    [Locale.Japanese]: "宝生マーゴ",
  },
  alisa: {
    [Locale.EnglishUS]: "Shidou Alisa",
    [Locale.EnglishGB]: "Shidou Alisa",
    [Locale.ChineseTW]: "紫藤亞里沙",
    [Locale.ChineseCN]: "紫藤亚里沙",
    [Locale.Japanese]: "紫藤アリサ",
  },
  coco: {
    [Locale.EnglishUS]: "Sawatari Coco",
    [Locale.EnglishGB]: "Sawatari Coco",
    [Locale.ChineseTW]: "澤渡可可",
    [Locale.ChineseCN]: "泽渡可可",
    [Locale.Japanese]: "沢渡ココ",
  },
};

/**
 * Get localized character name
 */
export function getLocalizedCharacterName(
  characterId: CharacterId,
  locale: Locale | string,
): string {
  const localizations = CHARACTER_NAME_LOCALIZATIONS[characterId];
  if (!localizations) {
    return characterId;
  }
  return (
    getLocalized(localizations as LocaleRecord, locale, characterId) ??
    characterId
  );
}
