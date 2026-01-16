/**
 * Commands Index
 * Exports all available slash commands for the Discord bot.
 */

import * as sketchbook from "./sketchbook.js";

// Export all commands as a collection
export const commands = {
  sketchbook,
};

// Command type definition
export type Command = {
  data: typeof sketchbook.data;
  execute: typeof sketchbook.execute;
};
