/**
 * Commands Index
 * Exports all available slash commands for the Discord bot.
 */

import * as sketchbook from "./sketchbook.js";
import * as dialogue from "./dialogue.js";
import * as settings from "./settings/index.js";

// Export all commands as a collection
export const commands = {
  sketchbook,
  dialogue,
  settings,
};
