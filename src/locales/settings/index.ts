/**
 * Settings Localizations Index
 * Re-exports all settings-related localization functions and constants
 */

// Re-export command localizations
export { SETTINGS_COMMAND_LOCALIZATIONS } from "./commands.js";

// Re-export messages and helper
export { SETTINGS_MESSAGES, getSettingsMessage } from "./messages.js";

// Re-export display localizations and helpers
export {
  CHANNEL_MODE_DISPLAY,
  LANGUAGE_DISPLAY,
  getChannelModeDisplay,
  getLanguageDisplay,
} from "./display.js";

// Re-export UI labels and helper
export { SETTINGS_UI_LABELS, getSettingsUILabel } from "./ui-labels.js";

// Re-export UI messages and helper
export { SETTINGS_UI_MESSAGES, getSettingsUIMessage } from "./ui-messages.js";
