/**
 * Dialogue Backgrounds Configuration
 * Background definitions and stretch mode options for dialogue images
 */

// Background stretch modes
export const STRETCH_MODES = {
  stretch: "Stretch to fill",
  stretch_x: "Stretch horizontally",
  stretch_y: "Stretch vertically",
  zoom_x: "Zoom horizontally (keep ratio)",
  zoom_y: "Zoom vertically (keep ratio)",
  original: "Original size (centered)",
} as const;

export type StretchMode = keyof typeof STRETCH_MODES;

// Available backgrounds (simplified list - first variant of each)
export const BACKGROUNDS: Record<string, string> = {
  bg_001_001: "Background_001_001.png",
  bg_001_002: "Background_001_002.png",
  bg_002_001: "Background_002_001.png",
  bg_003_001: "Background_003_001.png",
  bg_003_002: "Background_003_002.png",
  bg_004_001: "Background_004_001.png",
  bg_005_001: "Background_005_001.png",
  bg_005_002: "Background_005_002.png",
  bg_006_001: "Background_006_001.png",
  bg_007_001: "Background_007_001.png",
  bg_007_002: "Background_007_002.png",
  bg_009_001: "Background_009_001.png",
  bg_009_002: "Background_009_002.png",
  bg_010_001: "Background_010_001.png",
  bg_011_001: "Background_011_001.png",
  bg_012_001: "Background_012_001.png",
  bg_013_001: "Background_013_001.png",
  bg_014_001: "Background_014_001.png",
  bg_016_001: "Background_016_001.png",
  bg_017_001: "Background_017_001.png",
  bg_017_002: "Background_017_002.png",
  bg_018_001: "Background_018_001.png",
  bg_019_001: "Background_019_001.png",
  bg_019_002: "Background_019_002.png",
  bg_020_001: "Background_020_001.png",
  bg_021_001: "Background_021_001.png",
  bg_022_001: "Background_022_001.png",
  bg_022_002: "Background_022_002.png",
  bg_022_003: "Background_022_003.png",
  bg_022_004: "Background_022_004.png",
  bg_023_001: "Background_023_001.png",
  bg_023_002: "Background_023_002.png",
  bg_023_003: "Background_023_003.png",
  bg_023_004: "Background_023_004.png",
  bg_023_005: "Background_023_005.png",
  bg_023_006: "Background_023_006.png",
  bg_023_007: "Background_023_007.png",
  bg_023_008: "Background_023_008.png",
  bg_024_001: "Background_024_001.png",
  bg_024_002: "Background_024_002.png",
  bg_025_001: "Background_025_001.png",
  bg_025_002: "Background_025_002.png",
  bg_026_001: "Background_026_001.png",
  bg_027_001: "Background_027_001.png",
  bg_028_001: "Background_028_001.png",
  bg_028_002: "Background_028_002.png",
  bg_029_001: "Background_029_001.png",
  bg_029_002: "Background_029_002.png",
  bg_030_001: "Background_030_001.png",
  bg_030_002: "Background_030_002.png",
  bg_031_001: "Background_031_001.png",
  bg_031_002: "Background_031_002.png",
  bg_031_003: "Background_031_003.png",
  bg_031_004: "Background_031_004.png",
  bg_031_005: "Background_031_005.png",
  bg_032_001: "Background_032_001.png",
  bg_033_001: "Background_033_001.png",
  bg_034_001: "Background_034_001.png",
};

export type BackgroundId = keyof typeof BACKGROUNDS;

// Get all background IDs
export function getBackgroundIds(): string[] {
  return Object.keys(BACKGROUNDS);
}
