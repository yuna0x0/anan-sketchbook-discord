/**
 * Manosaba Backgrounds
 * Background definitions for Magical Girl Witch Trials (Manosaba)
 */

// Available backgrounds (simplified list - first variant of each)
export const MANOSABA_BACKGROUNDS = {
  bg_001_001: "Background_001_001.webp",
  bg_001_002: "Background_001_002.webp",
  bg_002_001: "Background_002_001.webp",
  bg_003_001: "Background_003_001.webp",
  bg_003_002: "Background_003_002.webp",
  bg_004_001: "Background_004_001.webp",
  bg_005_001: "Background_005_001.webp",
  bg_005_002: "Background_005_002.webp",
  bg_006_001: "Background_006_001.webp",
  bg_007_001: "Background_007_001.webp",
  bg_007_002: "Background_007_002.webp",
  bg_009_001: "Background_009_001.webp",
  bg_009_002: "Background_009_002.webp",
  bg_010_001: "Background_010_001.webp",
  bg_011_001: "Background_011_001.webp",
  bg_012_001: "Background_012_001.webp",
  bg_013_001: "Background_013_001.webp",
  bg_014_001: "Background_014_001.webp",
  bg_016_001: "Background_016_001.webp",
  bg_017_001: "Background_017_001.webp",
  bg_017_002: "Background_017_002.webp",
  bg_018_001: "Background_018_001.webp",
  bg_019_001: "Background_019_001.webp",
  bg_019_002: "Background_019_002.webp",
  bg_020_001: "Background_020_001.webp",
  bg_021_001: "Background_021_001.webp",
  bg_022_001: "Background_022_001.webp",
  bg_022_002: "Background_022_002.webp",
  bg_022_003: "Background_022_003.webp",
  bg_022_004: "Background_022_004.webp",
  bg_023_001: "Background_023_001.webp",
  bg_023_002: "Background_023_002.webp",
  bg_023_003: "Background_023_003.webp",
  bg_023_004: "Background_023_004.webp",
  bg_023_005: "Background_023_005.webp",
  bg_023_006: "Background_023_006.webp",
  bg_023_007: "Background_023_007.webp",
  bg_023_008: "Background_023_008.webp",
  bg_024_001: "Background_024_001.webp",
  bg_024_002: "Background_024_002.webp",
  bg_025_001: "Background_025_001.webp",
  bg_025_002: "Background_025_002.webp",
  bg_026_001: "Background_026_001.webp",
  bg_027_001: "Background_027_001.webp",
  bg_028_001: "Background_028_001.webp",
  bg_028_002: "Background_028_002.webp",
  bg_029_001: "Background_029_001.webp",
  bg_029_002: "Background_029_002.webp",
  bg_030_001: "Background_030_001.webp",
  bg_030_002: "Background_030_002.webp",
  bg_031_001: "Background_031_001.webp",
  bg_031_002: "Background_031_002.webp",
  bg_031_003: "Background_031_003.webp",
  bg_031_004: "Background_031_004.webp",
  bg_031_005: "Background_031_005.webp",
  bg_032_001: "Background_032_001.webp",
  bg_033_001: "Background_033_001.webp",
  bg_034_001: "Background_034_001.webp",
} satisfies Record<string, string>;

// Manosaba background IDs as a compile-time union, used inside this game
// module to keep localization tables exhaustive
export type ManosabaBackgroundId = keyof typeof MANOSABA_BACKGROUNDS;

// Background used when none is selected
export const MANOSABA_DEFAULT_BACKGROUND_ID: ManosabaBackgroundId =
  "bg_001_001";
