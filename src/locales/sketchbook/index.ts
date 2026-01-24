/**
 * Sketchbook Localizations Index
 * Re-exports all sketchbook-related localization functions and constants
 */

// Re-export command localizations
export {
  COMMAND_DESCRIPTION_LOCALIZATIONS,
  OPTION_DESCRIPTION_LOCALIZATIONS,
} from "./commands.js";

// Re-export messages and helpers
export {
  SKETCHBOOK_MESSAGES,
  getSketchbookMessage,
  SKETCHBOOK_ATTACHMENT_DESCRIPTION,
  getSketchbookAttachmentDescription,
} from "./messages.js";

// Re-export expression localizations
export { EXPRESSION_DISPLAY_NAME_LOCALIZATIONS } from "./expressions.js";

// Re-export choice localizations
export {
  ALIGN_CHOICE_LOCALIZATIONS,
  VALIGN_CHOICE_LOCALIZATIONS,
  WRAP_CHOICE_LOCALIZATIONS,
} from "./choices.js";

// Re-export fonts from shared location
export { FONT_NAME_LOCALIZATIONS } from "../fonts.js";
