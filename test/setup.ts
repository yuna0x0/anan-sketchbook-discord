/**
 * Test Setup Utilities
 * Provides test database setup, teardown, and helper functions
 */

import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test data directory - uses a temp directory for tests
const TEST_DATA_DIR = path.join(__dirname, ".test-data");

// Store original env value
let originalDataDir: string | undefined;

// Unique ID for this test run to avoid conflicts
let testRunId: string | null = null;

/**
 * Gets a unique test data directory for this test suite
 */
function getUniqueTestDir(): string {
  if (!testRunId) {
    testRunId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
  return path.join(TEST_DATA_DIR, testRunId);
}

/**
 * Gets the test database path for this test suite
 */
function getTestDbPath(): string {
  return path.join(getUniqueTestDir(), "test.db");
}

/**
 * Sets up the test environment before running tests.
 * Creates a temporary data directory and configures the database.
 */
export function setupTestEnvironment(): void {
  // Store original DATA_DIR
  originalDataDir = process.env.DATA_DIR;

  // Create unique test data directory for this suite
  const uniqueDir = getUniqueTestDir();
  if (!fs.existsSync(uniqueDir)) {
    fs.mkdirSync(uniqueDir, { recursive: true });
  }

  // Set DATA_DIR to unique test directory
  process.env.DATA_DIR = uniqueDir;
}

/**
 * Tears down the test environment after running tests.
 * Removes the temporary data directory and restores original env.
 */
export function teardownTestEnvironment(): void {
  // Restore original DATA_DIR
  if (originalDataDir !== undefined) {
    process.env.DATA_DIR = originalDataDir;
  } else {
    delete process.env.DATA_DIR;
  }

  // Clean up unique test data directory
  const uniqueDir = getUniqueTestDir();
  if (fs.existsSync(uniqueDir)) {
    fs.rmSync(uniqueDir, { recursive: true, force: true });
  }

  // Reset the test run ID
  testRunId = null;
}

/**
 * Creates a fresh test database with migrations applied.
 */
export async function createTestDatabase(): Promise<void> {
  // Ensure test environment is set up
  setupTestEnvironment();

  // Remove existing test database if present
  const dbPath = getTestDbPath();
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  // Also remove WAL and SHM files if they exist
  const walPath = dbPath + "-wal";
  const shmPath = dbPath + "-shm";
  if (fs.existsSync(walPath)) fs.unlinkSync(walPath);
  if (fs.existsSync(shmPath)) fs.unlinkSync(shmPath);

  // Import and run migrations
  const { initializeDatabase } = await import("../src/database/migrate.js");
  initializeDatabase();
}

/**
 * Closes the test database connection.
 */
export async function closeTestDatabase(): Promise<void> {
  const { closeDatabase } = await import("../src/database/index.js");
  closeDatabase();
}

/**
 * Gets the test database path.
 */
export function getTestDatabasePath(): string {
  return getTestDbPath();
}

/**
 * Gets the test data directory path.
 */
export function getTestDataDir(): string {
  return getUniqueTestDir();
}

/**
 * Test helper to generate a random guild ID.
 */
export function randomGuildId(): string {
  return `guild_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Test helper to generate a random user ID.
 */
export function randomUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Test helper to generate a random channel ID.
 */
export function randomChannelId(): string {
  return `channel_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Test helper to generate a random role ID.
 */
export function randomRoleId(): string {
  return `role_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Waits for a specified number of milliseconds.
 * Useful for testing time-based functionality.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a mock GuildMember-like object for permission testing.
 */
export function createMockMember(
  userId: string,
  roleIds: string[],
  options: {
    isOwner?: boolean;
    hasAdmin?: boolean;
    hasManageGuild?: boolean;
  } = {},
): {
  id: string;
  guild: { ownerId: string };
  roles: { cache: { map: <T>(fn: (role: { id: string }) => T) => T[] } };
  permissions: { has: (perm: string) => boolean };
} {
  const { isOwner = false, hasAdmin = false, hasManageGuild = false } = options;

  const roleObjects = roleIds.map((id) => ({ id }));

  return {
    id: userId,
    guild: {
      ownerId: isOwner ? userId : "other_owner_id",
    },
    roles: {
      cache: {
        map: <T>(fn: (role: { id: string }) => T): T[] => roleObjects.map(fn),
      },
    },
    permissions: {
      has: (perm: string) => {
        if (perm === "Administrator") return hasAdmin;
        if (perm === "ManageGuild") return hasManageGuild;
        return false;
      },
    },
  };
}

/**
 * Creates a mock APIInteractionGuildMember-like object for permission testing.
 * This simulates the raw API response where roles is a string[] instead of a Collection.
 */
export function createMockAPIMember(
  userId: string,
  roleIds: string[],
): {
  user: { id: string };
  roles: string[];
  permissions: string;
  joined_at: string;
  deaf: boolean;
  mute: boolean;
} {
  return {
    user: { id: userId },
    roles: roleIds,
    permissions: "0",
    joined_at: new Date().toISOString(),
    deaf: false,
    mute: false,
  };
}

/**
 * Creates a mock channel-like object for permission testing.
 */
export function createMockChannel(
  channelId: string,
  options: {
    isThread?: boolean;
    parentId?: string | null;
  } = {},
): {
  id: string;
  isThread: () => boolean;
  parentId: string | null;
} {
  const { isThread = false, parentId = null } = options;

  return {
    id: channelId,
    isThread: () => isThread,
    parentId,
  };
}
