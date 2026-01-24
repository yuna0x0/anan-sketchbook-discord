/**
 * Channel Permissions Repository
 * Handles CRUD operations for channel-level permissions (whitelist/blacklist).
 */

import { getDatabase } from "../index.js";
import {
  getOrCreateGuildSettings,
  getChannelModeForGuild,
} from "./guildSettings.js";

export interface ChannelPermission {
  id: number;
  guild_id: string;
  channel_id: string;
  include_threads: boolean;
  created_at: string;
}

interface ChannelPermissionRow {
  id: number;
  guild_id: string;
  channel_id: string;
  include_threads: number;
  created_at: string;
}

/**
 * Converts a database row to a ChannelPermission object.
 */
function rowToChannelPermission(row: ChannelPermissionRow): ChannelPermission {
  return {
    id: row.id,
    guild_id: row.guild_id,
    channel_id: row.channel_id,
    include_threads: row.include_threads === 1,
    created_at: row.created_at,
  };
}

/**
 * Adds a channel to the permissions list for a guild.
 * If the channel already exists, updates the include_threads setting.
 */
export function addChannelPermission(
  guildId: string,
  channelId: string,
  includeThreads: boolean = false,
): ChannelPermission {
  // Ensure guild settings exist
  getOrCreateGuildSettings(guildId);

  const db = getDatabase();

  // Use INSERT OR REPLACE to handle duplicates
  const stmt = db.prepare(`
    INSERT INTO channel_permissions (guild_id, channel_id, include_threads)
    VALUES (?, ?, ?)
    ON CONFLICT(guild_id, channel_id) DO UPDATE SET
      include_threads = excluded.include_threads
  `);

  stmt.run(guildId, channelId, includeThreads ? 1 : 0);

  return getChannelPermission(guildId, channelId)!;
}

/**
 * Gets a specific channel permission.
 */
export function getChannelPermission(
  guildId: string,
  channelId: string,
): ChannelPermission | null {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM channel_permissions
    WHERE guild_id = ? AND channel_id = ?
  `);

  const row = stmt.get(guildId, channelId) as ChannelPermissionRow | undefined;

  if (!row) {
    return null;
  }

  return rowToChannelPermission(row);
}

/**
 * Gets all channel permissions for a guild.
 */
export function getChannelPermissions(guildId: string): ChannelPermission[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM channel_permissions
    WHERE guild_id = ?
    ORDER BY created_at ASC
  `);

  const rows = stmt.all(guildId) as unknown as ChannelPermissionRow[];
  return rows.map(rowToChannelPermission);
}

/**
 * Removes a channel from the permissions list.
 */
export function removeChannelPermission(
  guildId: string,
  channelId: string,
): boolean {
  const db = getDatabase();
  const stmt = db.prepare(`
    DELETE FROM channel_permissions
    WHERE guild_id = ? AND channel_id = ?
  `);

  const result = stmt.run(guildId, channelId);
  return result.changes > 0;
}

/**
 * Removes all channel permissions for a guild (channel list only, preserves mode).
 * Use clearChannelPermissionsAndMode() to also reset the mode to "all".
 */
export function clearChannelPermissions(guildId: string): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    DELETE FROM channel_permissions WHERE guild_id = ?
  `);

  const result = stmt.run(guildId);
  return result.changes as number;
}

/**
 * Removes all channel permissions for a guild and resets channel mode to "all".
 * Used by the "Clear All" button to fully reset channel settings.
 */
export function clearChannelPermissionsAndMode(guildId: string): number {
  const count = clearChannelPermissions(guildId);

  // Reset channel mode to "all" (default)
  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE guild_settings
    SET channel_mode = 'all'
    WHERE guild_id = ?
  `);
  stmt.run(guildId);

  return count;
}

/**
 * Checks if a channel is in the permissions list for a guild.
 */
export function isChannelInList(guildId: string, channelId: string): boolean {
  return getChannelPermission(guildId, channelId) !== null;
}

/**
 * Checks if the bot can be used in a specific channel.
 * Takes into account the channel mode (all, whitelist, blacklist) and thread settings.
 *
 * @param guildId - The guild ID
 * @param channelId - The channel or thread ID
 * @param parentChannelId - The parent channel ID if this is a thread
 */
export function canUseInChannel(
  guildId: string,
  channelId: string,
  parentChannelId?: string,
): boolean {
  const channelMode = getChannelModeForGuild(guildId);

  // If mode is 'all', bot can be used anywhere
  if (channelMode === "all") {
    return true;
  }

  // Check if the channel itself is in the list
  const channelInList = isChannelInList(guildId, channelId);

  // If this is a thread, also check if the parent channel is in the list
  // Threads always inherit from their parent channel
  let parentInList = false;
  if (parentChannelId) {
    parentInList = isChannelInList(guildId, parentChannelId);
  }

  if (channelMode === "whitelist") {
    // In whitelist mode, channel is allowed if:
    // - The channel itself is in the whitelist, OR
    // - The parent channel is in the whitelist (threads inherit from parent)
    return channelInList || parentInList;
  } else {
    // In blacklist mode, channel is blocked if:
    // - The channel itself is in the blacklist, OR
    // - The parent channel is in the blacklist (threads inherit from parent)
    const isBlocked = channelInList || parentInList;
    return !isBlocked;
  }
}

/**
 * Removes channels that no longer exist in the guild from the database.
 * Call this when viewing/modifying channel settings to keep the list clean.
 *
 * @param guildId - The guild ID
 * @param existingChannelIds - Set of channel IDs that currently exist in the guild
 * @returns Number of channels removed
 */
export function cleanupDeletedChannels(
  guildId: string,
  existingChannelIds: Set<string>,
): number {
  const permissions = getChannelPermissions(guildId);
  let removedCount = 0;

  for (const permission of permissions) {
    if (!existingChannelIds.has(permission.channel_id)) {
      removeChannelPermission(guildId, permission.channel_id);
      removedCount++;
    }
  }

  return removedCount;
}
