/**
 * Dialogue Configuration
 * Game-agnostic dialogue rendering options. Per-game configuration
 * (characters, backgrounds, layout, fonts) lives in src/config/games/.
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
