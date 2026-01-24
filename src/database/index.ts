/**
 * Database Module
 * Handles SQLite database connection and initialization using node:sqlite.
 * Provides a singleton database instance for the application.
 */

import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolves the data directory path.
 * Priority:
 * 1. DATA_DIR environment variable (if set)
 * 2. Default: project root's data directory
 */
function resolveDataDir(): string {
  // Check for environment variable first
  if (process.env.DATA_DIR) {
    return path.resolve(process.env.DATA_DIR);
  }

  // Default to project root's data directory
  return path.resolve(__dirname, "../../data");
}

// Database file location - stored in data directory
const DATA_DIR = resolveDataDir();
const DB_PATH = path.join(DATA_DIR, "bot.db");

// Singleton database instance
let db: DatabaseSync | null = null;

/**
 * Ensures the data directory exists
 */
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log(`Created data directory: ${DATA_DIR}`);
  }
}

/**
 * Gets the singleton database instance.
 * Creates and initializes the database if it doesn't exist.
 */
export function getDatabase(): DatabaseSync {
  if (db && db.isOpen) {
    return db;
  }

  ensureDataDir();

  db = new DatabaseSync(DB_PATH, {
    enableForeignKeyConstraints: true,
  });

  // Enable WAL mode for better concurrent access performance
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA synchronous = NORMAL");

  console.log(`Database connected: ${DB_PATH}`);

  return db;
}

/**
 * Closes the database connection.
 * Should be called during graceful shutdown.
 */
export function closeDatabase(): void {
  if (db && db.isOpen) {
    db.close();
    db = null;
    console.log("Database connection closed.");
  }
}

/**
 * Gets the database file path.
 * Useful for backup operations or debugging.
 */
export function getDatabasePath(): string {
  return DB_PATH;
}

/**
 * Checks if the database is currently open.
 */
export function isDatabaseOpen(): boolean {
  return db !== null && db.isOpen;
}

// Export the database path for external use
export { DB_PATH, DATA_DIR };
