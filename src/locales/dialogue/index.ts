/**
 * Dialogue Localizations Index
 * Re-exports all dialogue-related localization functions and constants
 */

// Re-export command localizations
export {
  DIALOGUE_COMMAND_DESCRIPTION_LOCALIZATIONS,
  DIALOGUE_OPTION_LOCALIZATIONS,
} from "./commands.js";

// Re-export messages and helper
export { DIALOGUE_MESSAGES, getDialogueMessage } from "./messages.js";

// Re-export character localizations and helper
export {
  CHARACTER_NAME_LOCALIZATIONS,
  getLocalizedCharacterName,
} from "./characters.js";

// Re-export choice localizations
export {
  LANGUAGE_CHOICE_LOCALIZATIONS,
  STRETCH_MODE_LOCALIZATIONS,
} from "./choices.js";

// Re-export background localizations and helper
export {
  BACKGROUND_NAME_LOCALIZATIONS,
  getLocalizedBackgroundName,
} from "./backgrounds.js";

// Re-export character expression localizations and helper
export {
  CHARACTER_EXPRESSION_LOCALIZATIONS,
  getLocalizedExpressionName,
} from "./expressions.js";

// Re-export fonts from shared location
export { FONT_NAME_LOCALIZATIONS } from "../fonts.js";
