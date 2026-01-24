/**
 * Migration CLI Script
 * Provides command-line interface for database migrations.
 *
 * Usage:
 *   pnpm migrate          - Run all pending migrations
 *   pnpm migrate status   - Show migration status
 *   pnpm migrate rollback - Rollback last migration
 */

import {
  runMigrations,
  rollbackMigration,
  getMigrationStatus,
} from "./database/migrate.js";
import { closeDatabase } from "./database/index.js";

const command = process.argv[2] || "up";

function printStatus(): void {
  const status = getMigrationStatus();

  console.log("========================================");
  console.log("        Database Migration Status       ");
  console.log("========================================");
  console.log(`Current Version: ${status.currentVersion}`);
  console.log(`Latest Version:  ${status.latestVersion}`);
  console.log(`Pending:         ${status.pendingCount}`);
  console.log("----------------------------------------");

  if (status.appliedMigrations.length > 0) {
    console.log("\nApplied Migrations:");
    for (const migration of status.appliedMigrations) {
      console.log(`  ✓ ${migration.version}: ${migration.name}`);
      console.log(`    Applied at: ${migration.applied_at}`);
    }
  } else {
    console.log("\nNo migrations have been applied yet.");
  }

  if (status.pendingCount > 0) {
    console.log(`\n⚠️  ${status.pendingCount} migration(s) pending.`);
    console.log('   Run "pnpm migrate" to apply them.');
  } else {
    console.log("\n✓ Database is up to date.");
  }

  console.log("========================================");
}

async function main(): Promise<void> {
  try {
    switch (command) {
      case "up":
      case "migrate":
        console.log("Running migrations...\n");
        const applied = runMigrations();
        if (applied > 0) {
          console.log(`\n✓ Applied ${applied} migration(s).`);
        }
        break;

      case "status":
        printStatus();
        break;

      case "rollback":
      case "down":
        console.log("Rolling back last migration...\n");
        const rolledBack = rollbackMigration();
        if (rolledBack) {
          console.log("\n✓ Rollback complete.");
        }
        break;

      case "help":
      case "--help":
      case "-h":
        console.log("Database Migration CLI");
        console.log("");
        console.log("Usage:");
        console.log("  pnpm migrate [command]");
        console.log("");
        console.log("Commands:");
        console.log("  up, migrate   Run all pending migrations (default)");
        console.log("  status        Show migration status");
        console.log("  rollback      Rollback the last migration");
        console.log("  help          Show this help message");
        break;

      default:
        console.error(`Unknown command: ${command}`);
        console.log('Run "pnpm migrate help" for usage information.');
        process.exit(1);
    }
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    closeDatabase();
  }
}

main();
