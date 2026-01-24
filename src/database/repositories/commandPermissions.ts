/**
 * Command Permissions Repository
 * Handles CRUD operations for command-level permissions.
 * Supports role-based and channel-based permission control.
 *
 * Channel permissions now use a separate table (command_channel_permissions)
 * similar to global channel permissions, with a single list + mode approach.
 */

import { getDatabase } from "../index.js";
import { getOrCreateGuildSettings } from "./guildSettings.js";

export type CommandChannelMode = "inherit" | "all" | "whitelist" | "blacklist";

export interface CommandPermission {
  id: number;
  guild_id: string;
  command_name: string;
  enabled: boolean;
  allowed_roles: string[];
  denied_roles: string[];
  channel_mode: CommandChannelMode;
  created_at: string;
  updated_at: string;
}

export interface CommandChannelPermission {
  id: number;
  guild_id: string;
  command_name: string;
  channel_id: string;
  created_at: string;
}

interface CommandPermissionRow {
  id: number;
  guild_id: string;
  command_name: string;
  enabled: number;
  allowed_roles: string;
  denied_roles: string;
  channel_mode: string;
  created_at: string;
  updated_at: string;
}

interface CommandChannelPermissionRow {
  id: number;
  guild_id: string;
  command_name: string;
  channel_id: string;
  created_at: string;
}

/**
 * Safely parses a JSON array string, returning an empty array on failure.
 */
function parseJsonArray(jsonString: string): string[] {
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Converts a database row to a CommandPermission object.
 */
function rowToCommandPermission(row: CommandPermissionRow): CommandPermission {
  return {
    id: row.id,
    guild_id: row.guild_id,
    command_name: row.command_name,
    enabled: row.enabled === 1,
    allowed_roles: parseJsonArray(row.allowed_roles),
    denied_roles: parseJsonArray(row.denied_roles),
    channel_mode: (row.channel_mode as CommandChannelMode) || "inherit",
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * Converts a database row to a CommandChannelPermission object.
 */
function rowToCommandChannelPermission(
  row: CommandChannelPermissionRow,
): CommandChannelPermission {
  return {
    id: row.id,
    guild_id: row.guild_id,
    command_name: row.command_name,
    channel_id: row.channel_id,
    created_at: row.created_at,
  };
}

// ============================================================================
// Command Permission CRUD
// ============================================================================

/**
 * Gets command permission settings for a specific command in a guild.
 */
export function getCommandPermission(
  guildId: string,
  commandName: string,
): CommandPermission | null {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM command_permissions
    WHERE guild_id = ? AND command_name = ?
  `);

  const row = stmt.get(guildId, commandName) as
    | CommandPermissionRow
    | undefined;

  if (!row) {
    return null;
  }

  return rowToCommandPermission(row);
}

/**
 * Gets or creates command permission settings.
 * If settings don't exist, creates them with default values.
 */
export function getOrCreateCommandPermission(
  guildId: string,
  commandName: string,
): CommandPermission {
  const existing = getCommandPermission(guildId, commandName);

  if (existing) {
    return existing;
  }

  // Ensure guild settings exist
  getOrCreateGuildSettings(guildId);

  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO command_permissions (guild_id, command_name)
    VALUES (?, ?)
  `);

  stmt.run(guildId, commandName);

  return getCommandPermission(guildId, commandName)!;
}

/**
 * Gets all command permissions for a guild.
 */
export function getGuildCommandPermissions(
  guildId: string,
): CommandPermission[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM command_permissions
    WHERE guild_id = ?
    ORDER BY command_name ASC
  `);

  const rows = stmt.all(guildId) as unknown as CommandPermissionRow[];
  return rows.map(rowToCommandPermission);
}

/**
 * Sets whether a command is enabled or disabled for a guild.
 */
export function setCommandEnabled(
  guildId: string,
  commandName: string,
  enabled: boolean,
): CommandPermission {
  getOrCreateCommandPermission(guildId, commandName);

  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE command_permissions
    SET enabled = ?
    WHERE guild_id = ? AND command_name = ?
  `);

  stmt.run(enabled ? 1 : 0, guildId, commandName);

  return getCommandPermission(guildId, commandName)!;
}

// ============================================================================
// Role Permission Functions
// ============================================================================

/**
 * Adds a role to the allowed roles list for a command.
 */
export function addAllowedRole(
  guildId: string,
  commandName: string,
  roleId: string,
): CommandPermission {
  const permission = getOrCreateCommandPermission(guildId, commandName);
  const allowedRoles = new Set(permission.allowed_roles);
  allowedRoles.add(roleId);

  // Remove from denied if present
  const deniedRoles = new Set(permission.denied_roles);
  deniedRoles.delete(roleId);

  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE command_permissions
    SET allowed_roles = ?, denied_roles = ?
    WHERE guild_id = ? AND command_name = ?
  `);

  stmt.run(
    JSON.stringify([...allowedRoles]),
    JSON.stringify([...deniedRoles]),
    guildId,
    commandName,
  );

  return getCommandPermission(guildId, commandName)!;
}

/**
 * Removes a role from the allowed roles list for a command.
 */
export function removeAllowedRole(
  guildId: string,
  commandName: string,
  roleId: string,
): CommandPermission {
  const permission = getOrCreateCommandPermission(guildId, commandName);
  const allowedRoles = new Set(permission.allowed_roles);
  allowedRoles.delete(roleId);

  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE command_permissions
    SET allowed_roles = ?
    WHERE guild_id = ? AND command_name = ?
  `);

  stmt.run(JSON.stringify([...allowedRoles]), guildId, commandName);

  return getCommandPermission(guildId, commandName)!;
}

/**
 * Adds a role to the denied roles list for a command.
 */
export function addDeniedRole(
  guildId: string,
  commandName: string,
  roleId: string,
): CommandPermission {
  const permission = getOrCreateCommandPermission(guildId, commandName);
  const deniedRoles = new Set(permission.denied_roles);
  deniedRoles.add(roleId);

  // Remove from allowed if present
  const allowedRoles = new Set(permission.allowed_roles);
  allowedRoles.delete(roleId);

  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE command_permissions
    SET allowed_roles = ?, denied_roles = ?
    WHERE guild_id = ? AND command_name = ?
  `);

  stmt.run(
    JSON.stringify([...allowedRoles]),
    JSON.stringify([...deniedRoles]),
    guildId,
    commandName,
  );

  return getCommandPermission(guildId, commandName)!;
}

/**
 * Removes a role from the denied roles list for a command.
 */
export function removeDeniedRole(
  guildId: string,
  commandName: string,
  roleId: string,
): CommandPermission {
  const permission = getOrCreateCommandPermission(guildId, commandName);
  const deniedRoles = new Set(permission.denied_roles);
  deniedRoles.delete(roleId);

  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE command_permissions
    SET denied_roles = ?
    WHERE guild_id = ? AND command_name = ?
  `);

  stmt.run(JSON.stringify([...deniedRoles]), guildId, commandName);

  return getCommandPermission(guildId, commandName)!;
}

// ============================================================================
// Clear Functions
// ============================================================================

/**
 * Clears all permissions for a command and resets to default.
 * Also clears channel permissions from the separate table.
 */
export function clearCommandPermissions(
  guildId: string,
  commandName: string,
): void {
  const db = getDatabase();

  // Clear channel permissions from separate table
  const clearChannelsStmt = db.prepare(`
    DELETE FROM command_channel_permissions
    WHERE guild_id = ? AND command_name = ?
  `);
  clearChannelsStmt.run(guildId, commandName);

  // Reset command permissions to defaults
  const resetStmt = db.prepare(`
    UPDATE command_permissions
    SET enabled = 1,
        allowed_roles = '[]', denied_roles = '[]',
        channel_mode = 'inherit'
    WHERE guild_id = ? AND command_name = ?
  `);
  resetStmt.run(guildId, commandName);
}

/**
 * Clears all channel permissions for a command (channel list only, preserves mode).
 * Use clearCommandChannelsAndMode() to also reset the mode to inherit.
 */
export function clearCommandChannels(
  guildId: string,
  commandName: string,
): void {
  const db = getDatabase();

  const stmt = db.prepare(`
    DELETE FROM command_channel_permissions
    WHERE guild_id = ? AND command_name = ?
  `);
  stmt.run(guildId, commandName);
}

/**
 * Clears all channel permissions for a command and resets channel mode to inherit.
 * Used by the "Clear All" button to fully reset channel settings.
 */
export function clearCommandChannelsAndMode(
  guildId: string,
  commandName: string,
): void {
  // Clear channel list
  clearCommandChannels(guildId, commandName);

  // Reset channel mode to inherit
  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE command_permissions
    SET channel_mode = 'inherit'
    WHERE guild_id = ? AND command_name = ?
  `);
  stmt.run(guildId, commandName);
}

/**
 * Clears all role permissions for a command.
 */
export function clearCommandRoles(guildId: string, commandName: string): void {
  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE command_permissions
    SET allowed_roles = '[]', denied_roles = '[]'
    WHERE guild_id = ? AND command_name = ?
  `);
  stmt.run(guildId, commandName);
}

// ============================================================================
// Permission Check Functions
// ============================================================================

/**
 * Checks if a command is enabled for a guild.
 */
export function isCommandEnabled(
  guildId: string,
  commandName: string,
): boolean {
  const permission = getCommandPermission(guildId, commandName);
  return permission?.enabled ?? true;
}

/**
 * Checks if a user can use a specific command based on role permissions.
 * Resolution order:
 * 1. User has any denied role → DENY
 * 2. If allowed roles exist:
 *    - User has an allowed role → ALLOW
 *    - User has no allowed role → DENY
 * 3. No restrictions → ALLOW (default)
 */
export function canUserUseCommand(
  guildId: string,
  commandName: string,
  userRoleIds: string[],
): boolean {
  const permission = getCommandPermission(guildId, commandName);

  // No permission settings = allow
  if (!permission) {
    return true;
  }

  // 1. User has any denied role
  const hasDeniedRole = userRoleIds.some((roleId) =>
    permission.denied_roles.includes(roleId),
  );
  if (hasDeniedRole) {
    return false;
  }

  // 2. Check allowed roles
  if (permission.allowed_roles.length > 0) {
    const hasAllowedRole = userRoleIds.some((roleId) =>
      permission.allowed_roles.includes(roleId),
    );
    return hasAllowedRole;
  }

  // 3. Default: allow
  return true;
}

// ============================================================================
// Per-Command Channel Permissions (using separate table)
// ============================================================================

/**
 * Sets the channel mode for a specific command.
 * - 'inherit': Use global channel settings (default)
 * - 'all': Command works in all channels
 * - 'whitelist': Only channels in the list
 * - 'blacklist': All except channels in the list
 */
export function setCommandChannelMode(
  guildId: string,
  commandName: string,
  mode: CommandChannelMode,
): CommandPermission {
  getOrCreateCommandPermission(guildId, commandName);

  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE command_permissions
    SET channel_mode = ?
    WHERE guild_id = ? AND command_name = ?
  `);

  stmt.run(mode, guildId, commandName);

  return getCommandPermission(guildId, commandName)!;
}

/**
 * Gets the channel mode for a command.
 */
export function getCommandChannelMode(
  guildId: string,
  commandName: string,
): CommandChannelMode {
  const permission = getCommandPermission(guildId, commandName);
  return permission?.channel_mode ?? "inherit";
}

/**
 * Adds a channel to the command's channel list.
 */
export function addCommandChannelPermission(
  guildId: string,
  commandName: string,
  channelId: string,
): CommandChannelPermission {
  // Ensure command permission exists
  getOrCreateCommandPermission(guildId, commandName);

  const db = getDatabase();

  // Use INSERT OR IGNORE to handle duplicates
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO command_channel_permissions (guild_id, command_name, channel_id)
    VALUES (?, ?, ?)
  `);

  stmt.run(guildId, commandName, channelId);

  return getCommandChannelPermission(guildId, commandName, channelId)!;
}

/**
 * Gets a specific channel permission for a command.
 */
export function getCommandChannelPermission(
  guildId: string,
  commandName: string,
  channelId: string,
): CommandChannelPermission | null {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM command_channel_permissions
    WHERE guild_id = ? AND command_name = ? AND channel_id = ?
  `);

  const row = stmt.get(guildId, commandName, channelId) as
    | CommandChannelPermissionRow
    | undefined;

  if (!row) {
    return null;
  }

  return rowToCommandChannelPermission(row);
}

/**
 * Gets all channel permissions for a command.
 */
export function getCommandChannelPermissions(
  guildId: string,
  commandName: string,
): CommandChannelPermission[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM command_channel_permissions
    WHERE guild_id = ? AND command_name = ?
    ORDER BY created_at ASC
  `);

  const rows = stmt.all(
    guildId,
    commandName,
  ) as unknown as CommandChannelPermissionRow[];
  return rows.map(rowToCommandChannelPermission);
}

/**
 * Gets all channel permissions for all commands in a guild.
 * Useful for getting channel counts per command in overview panels.
 */
export function getAllCommandChannelPermissions(
  guildId: string,
): CommandChannelPermission[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM command_channel_permissions
    WHERE guild_id = ?
    ORDER BY command_name ASC, created_at ASC
  `);

  const rows = stmt.all(guildId) as unknown as CommandChannelPermissionRow[];
  return rows.map(rowToCommandChannelPermission);
}

/**
 * Removes a channel from the command's channel list.
 */
export function removeCommandChannelPermission(
  guildId: string,
  commandName: string,
  channelId: string,
): boolean {
  const db = getDatabase();
  const stmt = db.prepare(`
    DELETE FROM command_channel_permissions
    WHERE guild_id = ? AND command_name = ? AND channel_id = ?
  `);

  const result = stmt.run(guildId, commandName, channelId);
  return result.changes > 0;
}

/**
 * Checks if a channel is in the command's channel list.
 */
export function isChannelInCommandList(
  guildId: string,
  commandName: string,
  channelId: string,
): boolean {
  return getCommandChannelPermission(guildId, commandName, channelId) !== null;
}

/**
 * Checks if a command can be used in a specific channel.
 * Returns null if the command uses 'inherit' mode (caller should check global settings).
 *
 * @param guildId - The guild ID
 * @param commandName - The command name
 * @param channelId - The channel or thread ID
 * @param parentChannelId - The parent channel ID if this is a thread
 * @returns true if allowed, false if denied, null if should inherit from global
 */
export function canCommandUseChannel(
  guildId: string,
  commandName: string,
  channelId: string,
  parentChannelId?: string,
): boolean | null {
  const permission = getCommandPermission(guildId, commandName);

  // If no permission settings or inherit mode, return null to use default settings
  if (!permission || permission.channel_mode === "inherit") {
    return null;
  }

  // If mode is 'all', command can be used anywhere
  if (permission.channel_mode === "all") {
    return true;
  }

  // Check if the channel itself is in the list
  const channelInList = isChannelInCommandList(guildId, commandName, channelId);

  // Also check parent channel for threads
  let parentInList = false;
  if (parentChannelId) {
    parentInList = isChannelInCommandList(
      guildId,
      commandName,
      parentChannelId,
    );
  }

  if (permission.channel_mode === "whitelist") {
    // In whitelist mode, channel must be in the list (or its parent)
    return channelInList || parentInList;
  } else {
    // In blacklist mode, channel must NOT be in the list (and its parent must not be either)
    return !channelInList && !parentInList;
  }
}

/**
 * Removes channels that no longer exist from a command's channel permissions.
 *
 * @param guildId - The guild ID
 * @param commandName - The command name
 * @param existingChannelIds - Set of channel IDs that currently exist in the guild
 * @returns Number of channels removed
 */
export function cleanupDeletedCommandChannels(
  guildId: string,
  commandName: string,
  existingChannelIds: Set<string>,
): number {
  const permissions = getCommandChannelPermissions(guildId, commandName);
  let removedCount = 0;

  for (const permission of permissions) {
    if (!existingChannelIds.has(permission.channel_id)) {
      removeCommandChannelPermission(
        guildId,
        commandName,
        permission.channel_id,
      );
      removedCount++;
    }
  }

  return removedCount;
}

/**
 * Removes roles that no longer exist in the guild from the command's allowed/denied lists.
 * Call this when viewing/modifying command role settings to keep the lists clean.
 *
 * @param guildId - The guild ID
 * @param commandName - The command name
 * @param existingRoleIds - Set of role IDs that currently exist in the guild
 * @returns Number of roles removed
 */
export function cleanupDeletedCommandRoles(
  guildId: string,
  commandName: string,
  existingRoleIds: Set<string>,
): number {
  const permission = getCommandPermission(guildId, commandName);
  if (!permission) return 0;

  const originalAllowedCount = permission.allowed_roles.length;
  const originalDeniedCount = permission.denied_roles.length;

  const allowedRoles = permission.allowed_roles.filter((roleId) =>
    existingRoleIds.has(roleId),
  );
  const deniedRoles = permission.denied_roles.filter((roleId) =>
    existingRoleIds.has(roleId),
  );

  const removedCount =
    originalAllowedCount -
    allowedRoles.length +
    (originalDeniedCount - deniedRoles.length);

  if (removedCount > 0) {
    const db = getDatabase();
    const stmt = db.prepare(`
      UPDATE command_permissions
      SET allowed_roles = ?, denied_roles = ?
      WHERE guild_id = ? AND command_name = ?
    `);
    stmt.run(
      JSON.stringify(allowedRoles),
      JSON.stringify(deniedRoles),
      guildId,
      commandName,
    );
  }

  return removedCount;
}
