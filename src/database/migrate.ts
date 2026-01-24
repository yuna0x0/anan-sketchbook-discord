/**
 * Database Migration Runner
 * Handles schema migrations with version tracking.
 * Migrations are loaded from separate files in the migrations directory.
 */

import { DatabaseSync } from "node:sqlite";
import { getDatabase } from "./index.js";

// Import migrations from separate files
import { migration as migration001 } from "./migrations/001_initial_schema.js";

/**
 * Migration interface defining the structure of a migration.
 */
export interface Migration {
  version: number;
  name: string;
  up: (db: DatabaseSync) => void;
  down?: (db: DatabaseSync) => void;
}

/**
 * List of all migrations in order.
 * New migrations should be imported and added to the end of this array.
 */
const migrations: Migration[] = [
  migration001,
  // Add new migrations here:
  // migration002,
  // migration003,
];

/**
 * Gets the current database schema version.
 */
function getCurrentVersion(db: DatabaseSync): number {
  try {
    // Check if migrations table exists
    const tableExists = db
      .prepare(
        `
      SELECT name FROM sqlite_master
      WHERE type='table' AND name='migrations'
    `,
      )
      .get();

    if (!tableExists) {
      return 0;
    }

    const result = db
      .prepare(
        `
      SELECT MAX(version) as version FROM migrations
    `,
      )
      .get() as { version: number | null } | undefined;

    return result?.version ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Records a migration as applied.
 */
function recordMigration(db: DatabaseSync, migration: Migration): void {
  const stmt = db.prepare(`
    INSERT INTO migrations (version, name) VALUES (?, ?)
  `);
  stmt.run(migration.version, migration.name);
}

/**
 * Removes a migration record.
 */
function removeMigrationRecord(db: DatabaseSync, version: number): void {
  const stmt = db.prepare(`
    DELETE FROM migrations WHERE version = ?
  `);
  stmt.run(version);
}

/**
 * Runs all pending migrations.
 * @returns The number of migrations applied.
 */
export function runMigrations(): number {
  const db = getDatabase();
  const currentVersion = getCurrentVersion(db);

  const pendingMigrations = migrations.filter(
    (m) => m.version > currentVersion,
  );

  if (pendingMigrations.length === 0) {
    console.log("Database is up to date. No migrations to run.");
    return 0;
  }

  console.log(
    `Running ${pendingMigrations.length} migration(s) from version ${currentVersion}...`,
  );

  let appliedCount = 0;

  for (const migration of pendingMigrations) {
    console.log(`  Applying migration ${migration.version}: ${migration.name}`);

    try {
      // Run migration in a transaction
      db.exec("BEGIN TRANSACTION");

      migration.up(db);

      // Record migration (skip for version 1 as it creates the table)
      if (migration.version > 1 || currentVersion === 0) {
        recordMigration(db, migration);
      } else {
        recordMigration(db, migration);
      }

      db.exec("COMMIT");
      appliedCount++;
      console.log(`  ✓ Migration ${migration.version} applied successfully`);
    } catch (error) {
      db.exec("ROLLBACK");
      console.error(`  ✗ Migration ${migration.version} failed:`, error);
      throw error;
    }
  }

  console.log(
    `Successfully applied ${appliedCount} migration(s). Current version: ${getCurrentVersion(db)}`,
  );

  return appliedCount;
}

/**
 * Rolls back the last migration.
 * @returns true if a migration was rolled back, false if none to rollback.
 */
export function rollbackMigration(): boolean {
  const db = getDatabase();
  const currentVersion = getCurrentVersion(db);

  if (currentVersion === 0) {
    console.log("No migrations to rollback.");
    return false;
  }

  const migration = migrations.find((m) => m.version === currentVersion);

  if (!migration) {
    console.error(`Migration version ${currentVersion} not found in code.`);
    return false;
  }

  if (!migration.down) {
    console.error(
      `Migration ${migration.version} (${migration.name}) does not have a rollback function.`,
    );
    return false;
  }

  console.log(`Rolling back migration ${migration.version}: ${migration.name}`);

  try {
    db.exec("BEGIN TRANSACTION");

    migration.down(db);
    removeMigrationRecord(db, migration.version);

    db.exec("COMMIT");
    console.log(`✓ Migration ${migration.version} rolled back successfully`);
    return true;
  } catch (error) {
    db.exec("ROLLBACK");
    console.error(
      `✗ Rollback of migration ${migration.version} failed:`,
      error,
    );
    throw error;
  }
}

/**
 * Gets migration status information.
 */
export function getMigrationStatus(): {
  currentVersion: number;
  latestVersion: number;
  pendingCount: number;
  appliedMigrations: Array<{
    version: number;
    name: string;
    applied_at: string;
  }>;
} {
  const db = getDatabase();
  const currentVersion = getCurrentVersion(db);
  const latestVersion =
    migrations.length > 0 ? migrations[migrations.length - 1].version : 0;

  let appliedMigrations: Array<{
    version: number;
    name: string;
    applied_at: string;
  }> = [];

  try {
    const tableExists = db
      .prepare(
        `
      SELECT name FROM sqlite_master
      WHERE type='table' AND name='migrations'
    `,
      )
      .get();

    if (tableExists) {
      appliedMigrations = db
        .prepare(
          `
        SELECT version, name, applied_at FROM migrations ORDER BY version
      `,
        )
        .all() as Array<{ version: number; name: string; applied_at: string }>;
    }
  } catch {
    // Table doesn't exist yet
  }

  return {
    currentVersion,
    latestVersion,
    pendingCount: migrations.filter((m) => m.version > currentVersion).length,
    appliedMigrations,
  };
}

/**
 * Initializes the database with all migrations.
 * This should be called at application startup.
 */
export function initializeDatabase(): void {
  console.log("Initializing database...");
  runMigrations();
}

// Export migrations for testing purposes
export { migrations };
