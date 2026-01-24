/**
 * Migration 001: Initial Schema
 * Creates the initial database schema for bot settings and permissions.
 */

import { DatabaseSync } from "node:sqlite";
import type { Migration } from "../migrate.js";

export const migration: Migration = {
  version: 1,
  name: "initial_schema",

  up: (db: DatabaseSync) => {
    // Create migrations tracking table
    db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        version INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TEXT DEFAULT (datetime('now'))
      )
    `);

    // Guild settings table
    db.exec(`
      CREATE TABLE IF NOT EXISTS guild_settings (
        guild_id TEXT PRIMARY KEY,
        enabled INTEGER DEFAULT 1,
        channel_mode TEXT DEFAULT 'all' CHECK(channel_mode IN ('all', 'whitelist', 'blacklist')),
        default_language TEXT DEFAULT NULL,
        allowed_roles TEXT DEFAULT '[]',
        denied_roles TEXT DEFAULT '[]',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);

    // Allowed/blocked channels for bot usage
    db.exec(`
      CREATE TABLE IF NOT EXISTS channel_permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        channel_id TEXT NOT NULL,
        include_threads INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        UNIQUE(guild_id, channel_id),
        FOREIGN KEY (guild_id) REFERENCES guild_settings(guild_id) ON DELETE CASCADE
      )
    `);

    // Create index for faster lookups
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_channel_permissions_guild
      ON channel_permissions(guild_id)
    `);

    // Command-specific permissions
    db.exec(`
      CREATE TABLE IF NOT EXISTS command_permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        command_name TEXT NOT NULL,
        enabled INTEGER DEFAULT 1,
        allowed_roles TEXT DEFAULT '[]',
        denied_roles TEXT DEFAULT '[]',
        channel_mode TEXT DEFAULT 'inherit' CHECK(channel_mode IN ('inherit', 'all', 'whitelist', 'blacklist')),
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        UNIQUE(guild_id, command_name),
        FOREIGN KEY (guild_id) REFERENCES guild_settings(guild_id) ON DELETE CASCADE
      )
    `);

    // Create index for command permissions
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_command_permissions_guild
      ON command_permissions(guild_id)
    `);

    // Command-specific channel permissions (like channel_permissions but per-command)
    db.exec(`
      CREATE TABLE IF NOT EXISTS command_channel_permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        command_name TEXT NOT NULL,
        channel_id TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        UNIQUE(guild_id, command_name, channel_id),
        FOREIGN KEY (guild_id, command_name) REFERENCES command_permissions(guild_id, command_name) ON DELETE CASCADE
      )
    `);

    // Create index for command channel permissions
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_command_channel_permissions_lookup
      ON command_channel_permissions(guild_id, command_name)
    `);

    // Rate limit settings per guild
    db.exec(`
      CREATE TABLE IF NOT EXISTS rate_limit_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        command_name TEXT,
        max_uses INTEGER DEFAULT 5,
        window_seconds INTEGER DEFAULT 60,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        UNIQUE(guild_id, command_name),
        FOREIGN KEY (guild_id) REFERENCES guild_settings(guild_id) ON DELETE CASCADE
      )
    `);

    // Create index for rate limit settings
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_rate_limit_settings_guild
      ON rate_limit_settings(guild_id)
    `);

    // Rate limit usage tracking (for persistent tracking across restarts)
    db.exec(`
      CREATE TABLE IF NOT EXISTS rate_limit_usage (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        command_name TEXT,
        used_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (guild_id) REFERENCES guild_settings(guild_id) ON DELETE CASCADE
      )
    `);

    // Create indexes for rate limit usage
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_rate_limit_usage_lookup
      ON rate_limit_usage(guild_id, user_id, command_name, used_at)
    `);

    // Create trigger to automatically clean old rate limit entries (older than 1 hour)
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS cleanup_old_rate_limits
      AFTER INSERT ON rate_limit_usage
      BEGIN
        DELETE FROM rate_limit_usage
        WHERE datetime(used_at) < datetime('now', '-1 hour');
      END
    `);

    // Create trigger to update updated_at on guild_settings
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS update_guild_settings_timestamp
      AFTER UPDATE ON guild_settings
      BEGIN
        UPDATE guild_settings SET updated_at = datetime('now')
        WHERE guild_id = NEW.guild_id;
      END
    `);

    // Create trigger to update updated_at on command_permissions
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS update_command_permissions_timestamp
      AFTER UPDATE ON command_permissions
      BEGIN
        UPDATE command_permissions SET updated_at = datetime('now')
        WHERE id = NEW.id;
      END
    `);

    // Create trigger to update updated_at on rate_limit_settings
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS update_rate_limit_settings_timestamp
      AFTER UPDATE ON rate_limit_settings
      BEGIN
        UPDATE rate_limit_settings SET updated_at = datetime('now')
        WHERE id = NEW.id;
      END
    `);
  },

  down: (db: DatabaseSync) => {
    db.exec("DROP TRIGGER IF EXISTS update_rate_limit_settings_timestamp");
    db.exec("DROP TRIGGER IF EXISTS update_command_permissions_timestamp");
    db.exec("DROP TRIGGER IF EXISTS update_guild_settings_timestamp");
    db.exec("DROP TRIGGER IF EXISTS cleanup_old_rate_limits");
    db.exec("DROP INDEX IF EXISTS idx_rate_limit_usage_lookup");
    db.exec("DROP TABLE IF EXISTS rate_limit_usage");
    db.exec("DROP INDEX IF EXISTS idx_rate_limit_settings_guild");
    db.exec("DROP TABLE IF EXISTS rate_limit_settings");
    db.exec("DROP INDEX IF EXISTS idx_command_channel_permissions_lookup");
    db.exec("DROP TABLE IF EXISTS command_channel_permissions");
    db.exec("DROP INDEX IF EXISTS idx_command_permissions_guild");
    db.exec("DROP TABLE IF EXISTS command_permissions");
    db.exec("DROP INDEX IF EXISTS idx_channel_permissions_guild");
    db.exec("DROP TABLE IF EXISTS channel_permissions");
    db.exec("DROP TABLE IF EXISTS guild_settings");
    db.exec("DROP TABLE IF EXISTS migrations");
  },
};
