/**
 * Guild Settings Repository
 * Handles CRUD operations for guild-level settings.
 */

import { getDatabase } from "../index.js";

export type ChannelMode = "all" | "whitelist" | "blacklist";

export interface GuildSettings {
  guild_id: string;
  enabled: boolean;
  channel_mode: ChannelMode;
  default_language: string | null;
  allowed_roles: string[];
  denied_roles: string[];
  created_at: string;
  updated_at: string;
}

interface GuildSettingsRow {
  guild_id: string;
  enabled: number;
  channel_mode: string;
  default_language: string | null;
  allowed_roles: string;
  denied_roles: string;
  created_at: string;
  updated_at: string;
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
 * Converts a database row to a GuildSettings object.
 */
function rowToGuildSettings(row: GuildSettingsRow): GuildSettings {
  return {
    guild_id: row.guild_id,
    enabled: row.enabled === 1,
    channel_mode: row.channel_mode as ChannelMode,
    default_language: row.default_language,
    allowed_roles: parseJsonArray(row.allowed_roles),
    denied_roles: parseJsonArray(row.denied_roles),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * Gets guild settings by guild ID.
 * Returns null if no settings exist for the guild.
 */
export function getGuildSettings(guildId: string): GuildSettings | null {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM guild_settings WHERE guild_id = ?
  `);

  const row = stmt.get(guildId) as GuildSettingsRow | undefined;

  if (!row) {
    return null;
  }

  return rowToGuildSettings(row);
}

/**
 * Gets or creates guild settings.
 * If settings don't exist, creates them with default values.
 */
export function getOrCreateGuildSettings(guildId: string): GuildSettings {
  const existing = getGuildSettings(guildId);

  if (existing) {
    return existing;
  }

  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO guild_settings (guild_id) VALUES (?)
  `);

  stmt.run(guildId);

  return getGuildSettings(guildId)!;
}

/**
 * Updates guild settings.
 * Only updates the fields that are provided.
 */
export function updateGuildSettings(
  guildId: string,
  updates: Partial<
    Pick<GuildSettings, "enabled" | "channel_mode" | "default_language">
  >,
): GuildSettings | null {
  // Ensure guild exists
  getOrCreateGuildSettings(guildId);

  const db = getDatabase();
  const setClauses: string[] = [];
  const values: (string | number | null)[] = [];

  if (updates.enabled !== undefined) {
    setClauses.push("enabled = ?");
    values.push(updates.enabled ? 1 : 0);
  }

  if (updates.channel_mode !== undefined) {
    setClauses.push("channel_mode = ?");
    values.push(updates.channel_mode);
  }

  if (updates.default_language !== undefined) {
    setClauses.push("default_language = ?");
    values.push(updates.default_language);
  }

  if (setClauses.length === 0) {
    return getGuildSettings(guildId);
  }

  values.push(guildId);

  const stmt = db.prepare(`
    UPDATE guild_settings
    SET ${setClauses.join(", ")}
    WHERE guild_id = ?
  `);

  stmt.run(...values);

  return getGuildSettings(guildId);
}

/**
 * Sets the bot enabled/disabled state for a guild.
 */
export function setGuildEnabled(
  guildId: string,
  enabled: boolean,
): GuildSettings | null {
  return updateGuildSettings(guildId, { enabled });
}

/**
 * Sets the channel mode for a guild.
 */
export function setChannelMode(
  guildId: string,
  mode: ChannelMode,
): GuildSettings | null {
  return updateGuildSettings(guildId, { channel_mode: mode });
}

/**
 * Sets the default language for a guild.
 * Pass null to clear the default language (use user's locale).
 */
export function setDefaultLanguage(
  guildId: string,
  language: string | null,
): GuildSettings | null {
  return updateGuildSettings(guildId, { default_language: language });
}

/**
 * Gets the default language for a guild.
 * Returns null if no default language is set.
 */
export function getGuildDefaultLanguage(guildId: string): string | null {
  const settings = getGuildSettings(guildId);
  return settings?.default_language ?? null;
}

/**
 * Checks if the bot is enabled for a guild.
 * Returns true if no settings exist (enabled by default).
 */
export function isGuildEnabled(guildId: string): boolean {
  const settings = getGuildSettings(guildId);
  return settings?.enabled ?? true;
}

/**
 * Gets the channel mode for a guild.
 * Returns 'all' if no settings exist (default).
 */
export function getChannelModeForGuild(guildId: string): ChannelMode {
  const settings = getGuildSettings(guildId);
  return settings?.channel_mode ?? "all";
}

// ============================================================================
// Default Role Permission Functions
// ============================================================================

/**
 * Adds a role to the default allowed roles list.
 */
export function addDefaultAllowedRole(guildId: string, roleId: string): void {
  const settings = getOrCreateGuildSettings(guildId);
  const allowedRoles = [...settings.allowed_roles];

  if (!allowedRoles.includes(roleId)) {
    allowedRoles.push(roleId);
  }

  // Remove from denied if present
  const deniedRoles = settings.denied_roles.filter((r) => r !== roleId);

  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE guild_settings
    SET allowed_roles = ?, denied_roles = ?
    WHERE guild_id = ?
  `);
  stmt.run(JSON.stringify(allowedRoles), JSON.stringify(deniedRoles), guildId);
}

/**
 * Removes a role from the default allowed roles list.
 */
export function removeDefaultAllowedRole(
  guildId: string,
  roleId: string,
): void {
  const settings = getGuildSettings(guildId);
  if (!settings) return;

  const allowedRoles = settings.allowed_roles.filter((r) => r !== roleId);

  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE guild_settings
    SET allowed_roles = ?
    WHERE guild_id = ?
  `);
  stmt.run(JSON.stringify(allowedRoles), guildId);
}

/**
 * Adds a role to the default denied roles list.
 */
export function addDefaultDeniedRole(guildId: string, roleId: string): void {
  const settings = getOrCreateGuildSettings(guildId);
  const deniedRoles = [...settings.denied_roles];

  if (!deniedRoles.includes(roleId)) {
    deniedRoles.push(roleId);
  }

  // Remove from allowed if present
  const allowedRoles = settings.allowed_roles.filter((r) => r !== roleId);

  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE guild_settings
    SET allowed_roles = ?, denied_roles = ?
    WHERE guild_id = ?
  `);
  stmt.run(JSON.stringify(allowedRoles), JSON.stringify(deniedRoles), guildId);
}

/**
 * Removes a role from the default denied roles list.
 */
export function removeDefaultDeniedRole(guildId: string, roleId: string): void {
  const settings = getGuildSettings(guildId);
  if (!settings) return;

  const deniedRoles = settings.denied_roles.filter((r) => r !== roleId);

  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE guild_settings
    SET denied_roles = ?
    WHERE guild_id = ?
  `);
  stmt.run(JSON.stringify(deniedRoles), guildId);
}

/**
 * Removes a role from both allowed and denied lists.
 */
export function removeDefaultRole(guildId: string, roleId: string): void {
  const settings = getGuildSettings(guildId);
  if (!settings) return;

  const allowedRoles = settings.allowed_roles.filter((r) => r !== roleId);
  const deniedRoles = settings.denied_roles.filter((r) => r !== roleId);

  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE guild_settings
    SET allowed_roles = ?, denied_roles = ?
    WHERE guild_id = ?
  `);
  stmt.run(JSON.stringify(allowedRoles), JSON.stringify(deniedRoles), guildId);
}

/**
 * Clears all default role permissions.
 */
export function clearDefaultRoles(guildId: string): void {
  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE guild_settings
    SET allowed_roles = '[]', denied_roles = '[]'
    WHERE guild_id = ?
  `);
  stmt.run(guildId);
}

/**
 * Clears all default settings (channels and roles).
 * Resets channel mode to 'all' and clears all role lists.
 */
export function clearDefaultSettings(guildId: string): void {
  // Clear channel permissions from channel_permissions table
  const db = getDatabase();
  const clearChannelsStmt = db.prepare(`
    DELETE FROM channel_permissions WHERE guild_id = ?
  `);
  clearChannelsStmt.run(guildId);

  // Reset channel mode and clear roles in guild_settings
  const resetSettingsStmt = db.prepare(`
    UPDATE guild_settings
    SET channel_mode = 'all',
        allowed_roles = '[]', denied_roles = '[]'
    WHERE guild_id = ?
  `);
  resetSettingsStmt.run(guildId);
}

/**
 * Checks if a user can use the bot based on default role permissions.
 * Resolution order:
 * 1. User has any denied role → DENY
 * 2. If allowed roles exist and user has one → ALLOW
 * 3. If allowed roles exist but user has none → DENY
 * 4. Otherwise → ALLOW (default)
 */
export function canUserUseBot(guildId: string, userRoleIds: string[]): boolean {
  const settings = getGuildSettings(guildId);
  if (!settings) return true;

  // 1. User has any denied role
  const hasDeniedRole = userRoleIds.some((roleId) =>
    settings.denied_roles.includes(roleId),
  );
  if (hasDeniedRole) {
    return false;
  }

  // 2 & 3. Check allowed roles
  if (settings.allowed_roles.length > 0) {
    const hasAllowedRole = userRoleIds.some((roleId) =>
      settings.allowed_roles.includes(roleId),
    );
    return hasAllowedRole;
  }

  // 4. Default: allow
  return true;
}

/**
 * Removes roles that no longer exist in the guild from the default allowed/denied lists.
 * Call this when viewing/modifying role settings to keep the lists clean.
 *
 * @param guildId - The guild ID
 * @param existingRoleIds - Set of role IDs that currently exist in the guild
 * @returns Number of roles removed
 */
export function cleanupDeletedDefaultRoles(
  guildId: string,
  existingRoleIds: Set<string>,
): number {
  const settings = getGuildSettings(guildId);
  if (!settings) return 0;

  const originalAllowedCount = settings.allowed_roles.length;
  const originalDeniedCount = settings.denied_roles.length;

  const allowedRoles = settings.allowed_roles.filter((roleId) =>
    existingRoleIds.has(roleId),
  );
  const deniedRoles = settings.denied_roles.filter((roleId) =>
    existingRoleIds.has(roleId),
  );

  const removedCount =
    originalAllowedCount -
    allowedRoles.length +
    (originalDeniedCount - deniedRoles.length);

  if (removedCount > 0) {
    const db = getDatabase();
    const stmt = db.prepare(`
      UPDATE guild_settings
      SET allowed_roles = ?, denied_roles = ?
      WHERE guild_id = ?
    `);
    stmt.run(
      JSON.stringify(allowedRoles),
      JSON.stringify(deniedRoles),
      guildId,
    );
  }

  return removedCount;
}

/**
 * Resets general settings (enabled and default_language) to defaults.
 * Does not affect permissions.
 */
export function resetGeneralSettings(guildId: string): void {
  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE guild_settings
    SET enabled = 1, default_language = NULL
    WHERE guild_id = ?
  `);
  stmt.run(guildId);
}

/**
 * Resets all command settings including:
 * - All per-command permissions (command_permissions table)
 * - All per-command channel permissions (command_channel_permissions table)
 * - Default channel permissions (channel_permissions table)
 * - Default channel mode and roles in guild_settings
 */
export function resetAllCommandSettings(guildId: string): void {
  const db = getDatabase();

  // Delete all command channel permissions
  const clearCommandChannelsStmt = db.prepare(`
    DELETE FROM command_channel_permissions WHERE guild_id = ?
  `);
  clearCommandChannelsStmt.run(guildId);

  // Delete all command permissions
  const clearCommandsStmt = db.prepare(`
    DELETE FROM command_permissions WHERE guild_id = ?
  `);
  clearCommandsStmt.run(guildId);

  // Clear default channel permissions
  const clearChannelsStmt = db.prepare(`
    DELETE FROM channel_permissions WHERE guild_id = ?
  `);
  clearChannelsStmt.run(guildId);

  // Reset channel mode and clear roles in guild_settings
  const resetSettingsStmt = db.prepare(`
    UPDATE guild_settings
    SET channel_mode = 'all',
        allowed_roles = '[]', denied_roles = '[]'
    WHERE guild_id = ?
  `);
  resetSettingsStmt.run(guildId);
}

/**
 * Deletes all guild data (factory reset).
 * This removes the guild_settings row and cascades to all related tables:
 * - channel_permissions
 * - command_permissions
 * - command_channel_permissions
 * - rate_limit_settings
 * - rate_limit_usage
 */
export function deleteGuildData(guildId: string): void {
  const db = getDatabase();
  const stmt = db.prepare(`
    DELETE FROM guild_settings WHERE guild_id = ?
  `);
  stmt.run(guildId);
}
