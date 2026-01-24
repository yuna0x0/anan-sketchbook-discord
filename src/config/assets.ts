/**
 * Assets Configuration
 * Provides the base assets directory path resolution
 * Supports ASSETS_DIR environment variable for custom location
 */

import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";
import { existsSync } from "fs";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Find the assets directory by checking multiple possible locations
function findAssetsDir(): string {
  // Check for environment variable override first
  if (process.env.ASSETS_DIR) {
    const envPath = resolve(process.env.ASSETS_DIR);
    if (existsSync(envPath)) {
      return envPath;
    }
    console.warn(
      `ASSETS_DIR environment variable set to "${process.env.ASSETS_DIR}" but directory does not exist.`,
    );
    console.warn("Falling back to default asset discovery...");
  }

  // Possible locations for the assets directory
  const possiblePaths = [
    // When running from dist/config/ (production build)
    join(__dirname, "..", "..", "..", "assets"),
    // When running from src/config/ (development with tsx)
    join(__dirname, "..", "..", "assets"),
    // Relative to current working directory
    join(process.cwd(), "assets"),
  ];

  for (const path of possiblePaths) {
    const resolvedPath = resolve(path);
    if (existsSync(resolvedPath)) {
      return resolvedPath;
    }
  }

  // Default fallback (will likely fail, but provides a clear error)
  console.error("Could not find assets directory. Searched paths:");
  if (process.env.ASSETS_DIR) {
    console.error(`  - ${resolve(process.env.ASSETS_DIR)} (from ASSETS_DIR)`);
  }
  for (const path of possiblePaths) {
    console.error(`  - ${resolve(path)}`);
  }
  return resolve(possiblePaths[0]);
}

// Assets directory path
export const ASSETS_DIR = findAssetsDir();
