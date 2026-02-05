/**
 * Fonts Configuration
 * Font definitions and utilities shared across sketchbook and dialogue systems
 */

import { join } from "path";
import { ASSETS_DIR } from "./assets.js";

// Available fonts for sketchbook and dialogue systems
export const FONTS = {
  miSans: {
    name: "MiSans Bold",
    file: "MiSans-Bold.ttf",
  },
  notoSansTCBlack: {
    name: "Noto Sans TC Black",
    file: "NotoSansTC-Black.otf",
  },
  notoSansSCBlack: {
    name: "Noto Sans SC Black",
    file: "NotoSansSC-Black.otf",
  },
  notoSansKRBlack: {
    name: "Noto Sans KR Black",
    file: "NotoSansKR-Black.otf",
  },
  notoSansThaiBlack: {
    name: "Noto Sans Thai Black",
    file: "NotoSansThai-Black.otf",
  },
  tsukuMinPr6N: {
    name: "TsukuMin Pr6N",
    file: "TsukushiMincho.otf",
  },
  notoSerifTCSemiBold: {
    name: "Noto Serif TC SemiBold",
    file: "NotoSerifTC-SemiBold.otf",
  },
  notoSerifSCSemiBold: {
    name: "Noto Serif SC SemiBold",
    file: "NotoSerifSC-SemiBold.otf",
  },
  notoSerifKRSemiBold: {
    name: "Noto Serif KR SemiBold",
    file: "NotoSerifKR-SemiBold.otf",
  },
  notoSerifThaiSemiBold: {
    name: "Noto Serif Thai SemiBold",
    file: "NotoSerifThai-SemiBold.otf",
  },
} as const;

export type FontId = keyof typeof FONTS;

// Get the full path to a font file in the shared fonts directory
export function getFontPath(fontId: FontId): string {
  const font = FONTS[fontId];
  return join(ASSETS_DIR, "fonts", font.file);
}
