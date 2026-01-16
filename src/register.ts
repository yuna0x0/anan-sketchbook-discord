/**
 * Command Registration Script
 * Registers all slash commands with Discord's API.
 * Run this script once after adding or modifying commands.
 *
 * Usage: pnpm register
 */

import { REST, Routes } from "discord.js";
import { config } from "dotenv";
import { commands } from "./commands/index.js";

// Load environment variables
config();

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.APPLICATION_ID;

if (!token) {
  console.error("Error: DISCORD_TOKEN is not set in environment variables.");
  console.error("Please create a .env file with your Discord bot token.");
  process.exit(1);
}

if (!applicationId) {
  console.error("Error: APPLICATION_ID is not set in environment variables.");
  console.error("Please create a .env file with your Discord application ID.");
  process.exit(1);
}

// Build command data array
const commandData = Object.values(commands).map((command) =>
  command.data.toJSON(),
);

// Create REST instance
const rest = new REST({ version: "10" }).setToken(token);

/**
 * Register commands globally
 */
async function registerCommands(): Promise<void> {
  try {
    console.log(
      `Started refreshing ${commandData.length} application (/) commands.`,
    );

    // Register commands globally (available in all guilds and DMs)
    const data = await rest.put(Routes.applicationCommands(applicationId!), {
      body: commandData,
    });

    const registeredCount = Array.isArray(data) ? data.length : 0;
    console.log(
      `Successfully registered ${registeredCount} application (/) commands.`,
    );
    console.log("");
    console.log("Registered commands:");
    for (const command of commandData) {
      console.log(`  - /${command.name}: ${command.description}`);
    }
    console.log("");
    console.log(
      "Note: Global commands may take up to 1 hour to appear in all servers.",
    );
    console.log(
      "For immediate testing, you can invite the bot to a server and use the commands there.",
    );
  } catch (error) {
    console.error("Error registering commands:", error);
    process.exit(1);
  }
}

// Run registration
registerCommands();
