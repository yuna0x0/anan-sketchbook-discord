/**
 * Manosaba Discord Bot
 * Main entry point for the Discord user application.
 *
 * This bot allows users to:
 * - Generate images with text and/or images on Anan's sketchbook (/sketchbook)
 * - Generate in-game style dialogue images with characters (/dialogue)
 */

import {
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
} from "discord.js";
import { config } from "dotenv";
import { commands } from "./commands/index.js";

// Load environment variables from .env file
config();

const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error("Error: DISCORD_TOKEN is not set in environment variables.");
  console.error("Please create a .env file with your Discord bot token.");
  console.error("See .env.example for reference.");
  process.exit(1);
}

// Create Discord client with necessary intents
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

/**
 * Handle the client ready event
 * This is fired when the bot successfully connects to Discord
 */
client.once(Events.ClientReady, (readyClient) => {
  console.log("----------------------------------------");
  console.log("Manosaba Discord Bot");
  console.log("----------------------------------------");
  console.log(`Logged in as: ${readyClient.user.tag}`);
  console.log(`Bot ID: ${readyClient.user.id}`);
  console.log(`Connected to ${readyClient.guilds.cache.size} guild(s)`);
  console.log("----------------------------------------");
  console.log("Available commands:");
  console.log("  /sketchbook - Generate sketchbook images");
  console.log("  /dialogue   - Generate dialogue images");
  console.log("----------------------------------------");
  console.log("Bot is ready and listening for commands!");
  console.log("");
});

/**
 * Handle autocomplete interactions
 */
async function handleAutocomplete(
  interaction: AutocompleteInteraction,
): Promise<void> {
  const commandName = interaction.commandName;
  const command = commands[commandName as keyof typeof commands];

  if (!command || !("autocomplete" in command) || !command.autocomplete) {
    return;
  }

  try {
    await command.autocomplete(interaction);
  } catch (error) {
    console.error(`Error handling autocomplete for /${commandName}:`, error);
  }
}

/**
 * Handle chat input command interactions
 */
async function handleChatInputCommand(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  const commandName = interaction.commandName;

  // Find the command handler
  const command = commands[commandName as keyof typeof commands];

  if (!command) {
    console.warn(`Unknown command received: ${commandName}`);
    return;
  }

  try {
    console.log(
      `[${new Date().toISOString()}] Command: /${commandName} | User: ${interaction.user.tag} (${interaction.user.id}) | Guild: ${interaction.guild?.name ?? "DM"}`,
    );
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing command /${commandName}:`, error);

    // Try to respond with an error message
    const errorMessage = "There was an error while executing this command.";

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorMessage, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true });
      }
    } catch (replyError) {
      console.error("Failed to send error response:", replyError);
    }
  }
}

/**
 * Handle interaction events (slash commands and autocomplete)
 */
client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  // Handle autocomplete interactions
  if (interaction.isAutocomplete()) {
    await handleAutocomplete(interaction);
    return;
  }

  // Handle chat input commands (slash commands)
  if (interaction.isChatInputCommand()) {
    await handleChatInputCommand(interaction);
    return;
  }
});

/**
 * Handle errors
 */
client.on(Events.Error, (error) => {
  console.error("Discord client error:", error);
});

/**
 * Handle warnings
 */
client.on(Events.Warn, (warning) => {
  console.warn("Discord client warning:", warning);
});

/**
 * Graceful shutdown handler
 */
function shutdown(): void {
  console.log("");
  console.log("Shutting down...");
  client.destroy();
  process.exit(0);
}

// Handle process termination signals
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  shutdown();
});

// Login to Discord
console.log("Starting Manosaba Discord Bot...");
console.log("Connecting to Discord...");

client.login(token).catch((error) => {
  console.error("Failed to login to Discord:", error);
  process.exit(1);
});
