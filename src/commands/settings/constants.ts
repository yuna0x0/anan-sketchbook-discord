/**
 * Constants and utilities for the settings command
 */

// ============================================================================
// Constants
// ============================================================================

// Available commands in this bot
export const BOT_COMMANDS = ["sketchbook", "dialogue"];

// Component custom ID prefixes
export const PREFIX = "settings";
export const SEPARATOR = ":";

// Session timeout in milliseconds (15 minutes)
export const SESSION_TIMEOUT = 15 * 60 * 1000;

// ============================================================================
// Types
// ============================================================================

export interface ParsedCustomId {
  prefix: string;
  action: string;
  userId: string;
  args: string[];
}

// ============================================================================
// Custom ID Helpers
// ============================================================================

/**
 * Create a custom ID for a component
 */
export function createCustomId(
  action: string,
  userId: string,
  ...args: string[]
): string {
  return [PREFIX, action, userId, ...args].join(SEPARATOR);
}

/**
 * Parse a custom ID
 */
export function parseCustomId(customId: string): ParsedCustomId | null {
  const parts = customId.split(SEPARATOR);
  if (parts.length < 3 || parts[0] !== PREFIX) {
    return null;
  }
  return {
    prefix: parts[0],
    action: parts[1],
    userId: parts[2],
    args: parts.slice(3),
  };
}

/**
 * Check if a custom ID belongs to this settings command
 */
export function isSettingsCustomId(customId: string): boolean {
  return customId.startsWith(PREFIX + SEPARATOR);
}
