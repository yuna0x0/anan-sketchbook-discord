/**
 * Manosaba Discord Bot
 * Main entry point for the Discord user application.
 *
 * This bot allows users to:
 * - Generate images with text and/or images on Anan's sketchbook (/sketchbook)
 * - Generate in-game style dialogue images with characters (/dialogue)
 * - Manage bot settings for guild administrators (/settings)
 */

import {
  Client,
  Events,
  GatewayIntentBits,
  Locale,
  MessageFlags,
} from "discord.js";
import type {
  Interaction,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  GuildMember,
} from "discord.js";
import type { APIInteractionGuildMember } from "discord-api-types/v10";
import { config } from "dotenv";
import { commands } from "./commands/index.js";
import { getResponseMessage } from "./locales/index.js";
import { closeDatabase } from "./database/index.js";
import { initializeDatabase } from "./database/migrate.js";
import { deleteGuildData } from "./database/repositories/guildSettings.js";
import {
  checkPermissions,
  getPermissionDeniedMessageForResult,
} from "./services/permissionService.js";
import { DiscordAPIError, HTTPError } from "discord.js";
import { RESTJSONErrorCodes } from "discord-api-types/v10";

/**
 * Check if an error is a transient Discord API error (outage, timeout, expired interaction).
 * These are not actionable and can be silently ignored in fallback error handlers.
 */
function isTransientDiscordError(error: unknown): boolean {
  if (error instanceof HTTPError && (error.status === 500 || error.status === 503))
    return true;
  if (
    error instanceof DiscordAPIError &&
    error.code === RESTJSONErrorCodes.UnknownInteraction
  )
    return true;
  if (
    error instanceof Error &&
    (error.name === "AbortError" ||
      error.name === "ConnectTimeoutError" ||
      ("code" in error && error.code === "UND_ERR_CONNECT_TIMEOUT"))
  )
    return true;
  return false;
}
import {
  handleModalSubmit as handleSettingsModalSubmit,
  isSettingsCustomId,
} from "./commands/settings/index.js";

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
  console.log("  /settings   - Manage bot settings (admin only)");
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
    if (!isTransientDiscordError(error)) {
      console.error(`Error handling autocomplete for /${commandName}:`, error);
    }
  }
}

/**
 * Check if a channel can be permission checked.
 * Validates that the channel has required properties for permission checking.
 * This ensures compatibility with any Discord channel type.
 */
function isPermissionCheckChannel(channel: unknown): channel is {
  id: string;
  isThread: () => boolean;
  parentId?: string | null;
} {
  if (!channel || typeof channel !== "object") {
    return false;
  }
  const ch = channel as { id?: unknown; isThread?: unknown };
  return typeof ch.id === "string" && typeof ch.isThread === "function";
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

  // Get user's locale for ephemeral responses (permission errors are always ephemeral)
  const locale = interaction.locale || Locale.EnglishUS;

  try {
    // Check permissions before executing command (skip for settings command as it has its own checks)
    if (commandName !== "settings") {
      const guildId = interaction.guildId;
      const channel = isPermissionCheckChannel(interaction.channel)
        ? interaction.channel
        : null;
      const member = interaction.member as
        | GuildMember
        | APIInteractionGuildMember
        | null;

      const permissionResult = checkPermissions(
        guildId,
        channel,
        member,
        commandName,
        true, // Consume rate limit
      );

      if (!permissionResult.allowed) {
        const errorMessage = getPermissionDeniedMessageForResult(
          permissionResult,
          locale,
        );

        // Permission errors are always ephemeral
        await interaction.reply({
          content: errorMessage,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
    }

    console.log(
      `[${new Date().toISOString()}] Command: /${commandName} | User: ${interaction.user.tag} (${interaction.user.id}) | Guild: ${interaction.guild?.name ?? "DM"}`,
    );
    await command.execute(interaction);
  } catch (error) {
    if (!isTransientDiscordError(error)) {
      console.error(`Error executing command /${commandName}:`, error);
    }

    // Try to respond with a localized error message
    const errorMessage = getResponseMessage("genericError", locale);

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: errorMessage,
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: errorMessage,
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch (replyError) {
      if (!isTransientDiscordError(replyError)) {
        console.error("Failed to send error response:", replyError);
      }
    }
  }
}

/**
 * Handle modal submit interactions
 */
async function handleModalSubmit(
  interaction: ModalSubmitInteraction,
): Promise<void> {
  try {
    // Check if this is a settings modal
    if (isSettingsCustomId(interaction.customId)) {
      await handleSettingsModalSubmit(interaction);
      return;
    }

    // Add other modal handlers here as needed
  } catch (error) {
    if (!isTransientDiscordError(error)) {
      console.error("Error handling modal submit:", error);
    }
    const locale = interaction.locale || Locale.EnglishUS;
    const errorMessage = getResponseMessage("genericError", locale);

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: errorMessage,
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: errorMessage,
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch (replyError) {
      if (!isTransientDiscordError(replyError)) {
        console.error("Failed to send error response:", replyError);
      }
    }
  }
}

/**
 * Handle interaction events (slash commands, autocomplete, and modals)
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

  // Handle modal submit interactions
  if (interaction.isModalSubmit()) {
    await handleModalSubmit(interaction);
    return;
  }
});

/**
 * Handle guild delete event (bot removed from server)
 * Cleans up all guild data from the database when the bot is removed
 */
client.on(Events.GuildDelete, (guild) => {
  console.log(
    `[${new Date().toISOString()}] Bot removed from guild: ${guild.name} (${guild.id})`,
  );

  try {
    deleteGuildData(guild.id);
    console.log(
      `[${new Date().toISOString()}] Deleted all data for guild: ${guild.id}`,
    );
  } catch (error) {
    console.error(`Failed to delete data for guild ${guild.id}:`, error);
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

  // Close database connection
  closeDatabase();

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

// Initialize database and start bot
console.log("Starting Manosaba Discord Bot...");

// Initialize database with migrations
initializeDatabase();

// Connect to Discord
console.log("Connecting to Discord...");

client.login(token).catch((error) => {
  console.error("Failed to login to Discord:", error);
  process.exit(1);
});
