/**
 * Locales Index
 * Re-exports all localization functions and constants from modular files
 */

// Re-export types and utilities
export {
  type LocaleRecord,
  type SupportedLocale,
  type SupportedGuildLanguage,
  SUPPORTED_LOCALES,
  SUPPORTED_GUILD_LANGUAGES,
  isSupportedGuildLanguage,
  getLocalized,
  getLocalizedRequired,
  resolveLocale,
  formatLocalized,
} from "./types.js";

// Re-export common messages
export {
  RESPONSE_MESSAGES,
  getResponseMessage,
  IMAGE_FORMAT_ERROR_MESSAGES,
  getImageFormatErrorMessage,
} from "./common.js";

// Re-export shared fonts
export { FONT_NAME_LOCALIZATIONS } from "./fonts.js";

// Re-export sketchbook localizations
export {
  COMMAND_DESCRIPTION_LOCALIZATIONS,
  SKETCHBOOK_MESSAGES,
  getSketchbookMessage,
  SKETCHBOOK_ATTACHMENT_DESCRIPTION,
  getSketchbookAttachmentDescription,
  OPTION_DESCRIPTION_LOCALIZATIONS,
  EXPRESSION_DISPLAY_NAME_LOCALIZATIONS,
  ALIGN_CHOICE_LOCALIZATIONS,
  VALIGN_CHOICE_LOCALIZATIONS,
  WRAP_CHOICE_LOCALIZATIONS,
} from "./sketchbook/index.js";

// Re-export dialogue localizations
export {
  DIALOGUE_COMMAND_DESCRIPTION_LOCALIZATIONS,
  DIALOGUE_OPTION_LOCALIZATIONS,
  DIALOGUE_MESSAGES,
  getDialogueMessage,
  LANGUAGE_CHOICE_LOCALIZATIONS,
  STRETCH_MODE_LOCALIZATIONS,
  CHARACTER_NAME_LOCALIZATIONS,
  getLocalizedCharacterName,
  BACKGROUND_NAME_LOCALIZATIONS,
  getLocalizedBackgroundName,
  CHARACTER_EXPRESSION_LOCALIZATIONS,
  getLocalizedExpressionName,
} from "./dialogue/index.js";

// Re-export settings localizations
export {
  SETTINGS_COMMAND_LOCALIZATIONS,
  SETTINGS_MESSAGES,
  CHANNEL_MODE_DISPLAY,
  LANGUAGE_DISPLAY,
  getSettingsMessage,
  getChannelModeDisplay,
  getLanguageDisplay,
  SETTINGS_UI_LABELS,
  SETTINGS_UI_MESSAGES,
  getSettingsUILabel,
  getSettingsUIMessage,
} from "./settings/index.js";

// Re-export permission denied localizations
export {
  PERMISSION_DENIED_MESSAGES,
  getPermissionDeniedMessage,
} from "./permissions.js";
