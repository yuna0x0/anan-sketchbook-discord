/**
 * Settings Slash Command (Interactive UI Version)
 *
 * Allows guild administrators to manage bot settings through an interactive
 * dashboard with buttons, select menus, and modals for a better UX.
 *
 * Features:
 * - Main dashboard with navigation buttons
 * - General settings: enable/disable bot, set default language
 * - Command settings:
 *   - Global channel settings (all/whitelist/blacklist)
 *   - Per-command settings (enable/disable, channel/role permissions)
 * - Rate limit settings: set limits
 *
 * Only users with Administrator or Manage Guild permissions can use this command.
 *
 * File Structure:
 * - index.ts (this file) - Main command definition and interaction routing
 * - constants.ts - Shared constants, types, and custom ID helpers
 * - utils.ts - Shared utility functions
 * - panels/ - Panel builder functions for each UI view
 * - handlers/ - Action handler functions for each interaction type
 */

import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  Locale,
  MessageFlags,
  Message,
} from "discord.js";
import type {
  ChatInputCommandInteraction,
  ButtonInteraction,
  StringSelectMenuInteraction,
  ChannelSelectMenuInteraction,
  RoleSelectMenuInteraction,
  ModalSubmitInteraction,
  InteractionResponse,
  GuildMember,
} from "discord.js";
import type { APIInteractionGuildMember } from "discord-api-types/v10";
import { canManageBot } from "../../services/permissionService.js";
import {
  SETTINGS_COMMAND_LOCALIZATIONS,
  getSettingsMessage,
  getSettingsUIMessage,
} from "../../locales/index.js";
import {
  parseCustomId,
  SESSION_TIMEOUT,
  PREFIX,
  isSettingsCustomId,
} from "./constants.js";

// Panel builders
import {
  buildDashboard,
  buildGeneralPanel,
  buildCommandsPanel,
  buildDefaultChannelsPanel,
  buildDefaultChannelsDetailPanel,
  buildDefaultRolesPanel,
  buildCommandDetailPanel,
  buildCommandChannelsPanel,
  buildCommandRolesPanel,
  buildRateLimitsPanel,
} from "./panels/index.js";

// Handlers
import {
  handleToggleBot,
  handleSetLanguage,
  handleResetGeneralSettings,
  handleConfirmResetGeneralSettings,
  handleFactoryReset,
  handleConfirmFactoryReset,
  // Default settings handlers
  handleSetChannelMode,
  handleAddChannel,
  handleRemoveChannel,
  handleClearChannels,
  handleConfirmClearChannels,
  handleAllowDefaultRole,
  handleDenyDefaultRole,
  handleRemoveDefaultRole,
  handleClearDefaultRoles,
  handleConfirmClearDefaultRoles,
  handleResetDefaultPermissions,
  handleConfirmResetDefaultPermissions,
  // Command permission handlers
  handleSelectCommand,
  handleToggleCommand,
  handleAllowRole,
  handleDenyRole,
  handleRemoveRole,
  handleSetCommandChannelMode,
  handleAddCommandChannel,
  handleRemoveCommandChannel,
  handleResetCommand,
  handleConfirmResetCommand,
  handleClearCommandChannels,
  handleConfirmClearCommandChannels,
  handleClearCommandRoles,
  handleConfirmClearCommandRoles,
  // Reset all command settings
  handleResetAllCommandSettings,
  handleConfirmResetAllCommandSettings,
  // Rate limit handlers
  handleSelectRateLimitTarget,
  handleRemoveRateLimit,
  handleRateLimitModalSubmit,
  handleClearRateLimits,
  handleConfirmClearRateLimits,
} from "./handlers/index.js";

// ============================================================================
// Slash Command Definition
// ============================================================================

export const data = new SlashCommandBuilder()
  .setName("settings")
  .setDescription(SETTINGS_COMMAND_LOCALIZATIONS.description[Locale.EnglishUS]!)
  .setDescriptionLocalizations(SETTINGS_COMMAND_LOCALIZATIONS.description)
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .setDMPermission(false);

// ============================================================================
// Main Execute Function
// ============================================================================

/**
 * Execute the settings command - shows the main dashboard
 */
export async function execute(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  const locale = interaction.locale || Locale.EnglishUS;
  const userId = interaction.user.id;
  const guildId = interaction.guildId;

  // Check permissions
  // Pass guild owner ID for API member type support
  const guildOwnerId = interaction.guild?.ownerId;
  const member = interaction.member as
    | GuildMember
    | APIInteractionGuildMember
    | null;
  if (!canManageBot(member, guildOwnerId)) {
    await interaction.reply({
      content: "❌ " + getSettingsMessage("noPermission", locale),
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  if (!guildId) {
    await interaction.reply({
      content: "❌ " + getSettingsMessage("guildOnly", locale),
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  // Show the main dashboard
  const result = await interaction.reply({
    ...buildDashboard(guildId, userId, locale),
    flags: MessageFlags.Ephemeral,
    withResponse: true,
  });
  const response = result.resource?.message ?? (await interaction.fetchReply());

  // Set up collector for component interactions
  setupCollector(response, guildId, userId, locale);
}

// ============================================================================
// Component Interaction Collector
// ============================================================================

/**
 * Set up a collector to handle component interactions
 */
function setupCollector(
  message: Message | InteractionResponse,
  guildId: string,
  userId: string,
  locale: Locale | string,
): void {
  const collector = message.createMessageComponentCollector({
    time: SESSION_TIMEOUT,
    filter: (i) => {
      const parsed = parseCustomId(i.customId);
      return parsed !== null && parsed.userId === userId;
    },
  });

  collector.on("collect", async (interaction) => {
    try {
      await handleComponentInteraction(
        interaction as ComponentInteraction,
        guildId,
        userId,
        locale,
      );
    } catch (error) {
      console.error("Error handling settings component interaction:", error);
      try {
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({
            content: "❌ " + getSettingsMessage("error", locale),
            flags: MessageFlags.Ephemeral,
          });
        }
      } catch {
        // Ignore errors when trying to send error response
      }
    }
  });

  collector.on("end", async (_collected, reason) => {
    if (reason === "time") {
      try {
        // Disable all components when session expires
        const msg =
          message instanceof Message ? message : await message.fetch();
        // Clear the components since session has expired
        await msg.edit({ components: [] });
      } catch {
        // Message may have been deleted
      }
    }
  });
}

// ============================================================================
// Component Interaction Handler
// ============================================================================

type ComponentInteraction =
  | ButtonInteraction
  | StringSelectMenuInteraction
  | ChannelSelectMenuInteraction
  | RoleSelectMenuInteraction;

/**
 * Handle a component interaction
 */
async function handleComponentInteraction(
  interaction: ComponentInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  const parsed = parseCustomId(interaction.customId);
  if (!parsed) return;

  const { action, args } = parsed;

  // Verify user ownership
  if (parsed.userId !== interaction.user.id) {
    await interaction.reply({
      content: getSettingsUIMessage("notYourSession", locale),
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  // Route to appropriate handler
  switch (action) {
    // ========================================================================
    // Navigation
    // ========================================================================
    case "dashboard":
      await interaction.update(buildDashboard(guildId, userId, locale));
      break;

    case "general":
      await interaction.update(buildGeneralPanel(guildId, userId, locale));
      break;

    case "commands":
      await interaction.update(
        buildCommandsPanel(
          guildId,
          userId,
          locale,
          interaction.guild
            ? new Set(interaction.guild.channels.cache.keys())
            : undefined,
        ),
      );
      break;

    case "channels":
      await interaction.update(
        buildDefaultChannelsPanel(guildId, userId, locale, interaction.guild),
      );
      break;

    case "default_channels_detail":
      await interaction.update(
        buildDefaultChannelsDetailPanel(
          guildId,
          userId,
          locale,
          interaction.guild,
        ),
      );
      break;

    case "default_roles":
      await interaction.update(
        buildDefaultRolesPanel(guildId, userId, locale, interaction.guild),
      );
      break;

    case "ratelimits":
      await interaction.update(buildRateLimitsPanel(guildId, userId, locale));
      break;

    case "back_to_command":
      await interaction.update(
        buildCommandDetailPanel(guildId, userId, locale, args[0]),
      );
      break;

    case "command_roles":
      await interaction.update(
        buildCommandRolesPanel(
          guildId,
          userId,
          locale,
          args[0],
          interaction.guild,
        ),
      );
      break;

    case "command_channels":
      await interaction.update(
        buildCommandChannelsPanel(
          guildId,
          userId,
          locale,
          args[0],
          interaction.guild,
        ),
      );
      break;

    // ========================================================================
    // General Settings Actions
    // ========================================================================
    case "toggle_bot":
      await handleToggleBot(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    case "set_language":
      await handleSetLanguage(
        interaction as StringSelectMenuInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    case "reset_general":
      await handleResetGeneralSettings(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    case "confirm_reset_general":
      await handleConfirmResetGeneralSettings(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    case "factory_reset":
      await handleFactoryReset(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    case "confirm_factory_reset":
      await handleConfirmFactoryReset(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    // ========================================================================
    // Default Permissions Actions
    // ========================================================================
    case "set_channel_mode":
      await handleSetChannelMode(
        interaction as StringSelectMenuInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    case "add_channel":
      await handleAddChannel(
        interaction as ChannelSelectMenuInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    case "remove_channel":
      await handleRemoveChannel(
        interaction as StringSelectMenuInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    case "clear_channels":
      await handleClearChannels(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    case "confirm_clear_channels":
      await handleConfirmClearChannels(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    // Default role permissions
    case "allow_default_role":
      await handleAllowDefaultRole(
        interaction as RoleSelectMenuInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    case "deny_default_role":
      await handleDenyDefaultRole(
        interaction as RoleSelectMenuInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    case "remove_default_role":
      await handleRemoveDefaultRole(
        interaction as StringSelectMenuInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    case "clear_default_roles":
      await handleClearDefaultRoles(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    case "confirm_clear_default_roles":
      await handleConfirmClearDefaultRoles(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    // Reset default permissions
    case "reset_default_permissions":
      await handleResetDefaultPermissions(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    case "confirm_reset_default":
      await handleConfirmResetDefaultPermissions(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    // ========================================================================
    // Command Settings Actions
    // ========================================================================
    case "select_command":
      await handleSelectCommand(
        interaction as StringSelectMenuInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    case "toggle_command":
      await handleToggleCommand(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
        args[0],
      );
      break;

    // Role permissions
    case "allow_role":
      await handleAllowRole(
        interaction as RoleSelectMenuInteraction,
        guildId,
        userId,
        locale,
        args[0],
      );
      break;

    case "deny_role":
      await handleDenyRole(
        interaction as RoleSelectMenuInteraction,
        guildId,
        userId,
        locale,
        args[0],
      );
      break;

    case "remove_role":
      await handleRemoveRole(
        interaction as StringSelectMenuInteraction,
        guildId,
        userId,
        locale,
        args[0],
      );
      break;

    // Command channel permissions
    case "set_command_channel_mode":
      await handleSetCommandChannelMode(
        interaction as StringSelectMenuInteraction,
        guildId,
        userId,
        locale,
        args[0],
      );
      break;

    case "add_command_channel":
      await handleAddCommandChannel(
        interaction as ChannelSelectMenuInteraction,
        guildId,
        userId,
        locale,
        args[0],
      );
      break;

    case "remove_command_channel":
      await handleRemoveCommandChannel(
        interaction as StringSelectMenuInteraction,
        guildId,
        userId,
        locale,
        args[0],
      );
      break;

    // Reset command
    case "reset_command":
      await handleResetCommand(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
        args[0],
      );
      break;

    case "confirm_reset_command":
      await handleConfirmResetCommand(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
        args[0],
      );
      break;

    // Clear command channel permissions
    case "clear_command_channels":
      await handleClearCommandChannels(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
        args[0],
      );
      break;

    case "confirm_clear_cmd_channels":
      await handleConfirmClearCommandChannels(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
        args[0],
      );
      break;

    // Clear command role permissions
    case "clear_command_roles":
      await handleClearCommandRoles(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
        args[0],
      );
      break;

    case "confirm_clear_cmd_roles":
      await handleConfirmClearCommandRoles(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
        args[0],
      );
      break;

    // Reset all command settings
    case "reset_all_commands":
      await handleResetAllCommandSettings(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    case "confirm_reset_all_commands":
      await handleConfirmResetAllCommandSettings(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    // ========================================================================
    // Rate Limit Actions
    // ========================================================================
    case "select_ratelimit_target":
      await handleSelectRateLimitTarget(
        interaction as StringSelectMenuInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    case "remove_ratelimit":
      await handleRemoveRateLimit(
        interaction as StringSelectMenuInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    case "clear_ratelimits":
      await handleClearRateLimits(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    case "confirm_clear_ratelimits":
      await handleConfirmClearRateLimits(
        interaction as ButtonInteraction,
        guildId,
        userId,
        locale,
      );
      break;

    // ========================================================================
    // Unknown Action
    // ========================================================================
    default:
      await interaction.reply({
        content: "❌ " + getSettingsMessage("unknownSubcommand", locale),
        flags: MessageFlags.Ephemeral,
      });
  }
}

// ============================================================================
// Modal Submit Handler
// ============================================================================

/**
 * Handle modal submissions for the settings command
 */
export async function handleModalSubmit(
  interaction: ModalSubmitInteraction,
): Promise<void> {
  const parsed = parseCustomId(interaction.customId);
  if (!parsed) return;

  const { action, userId, args } = parsed;
  const locale = interaction.locale || Locale.EnglishUS;
  const guildId = interaction.guildId;

  if (!guildId) {
    await interaction.reply({
      content: "❌ " + getSettingsMessage("guildOnly", locale),
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  // Verify user ownership
  if (userId !== interaction.user.id) {
    await interaction.reply({
      content: getSettingsUIMessage("notYourSession", locale),
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  switch (action) {
    case "modal_ratelimit": {
      const target = args[0];
      const usesStr = interaction.fields.getTextInputValue("uses");
      const secondsStr = interaction.fields.getTextInputValue("seconds");

      const result = handleRateLimitModalSubmit(
        guildId,
        target,
        usesStr,
        secondsStr,
      );

      if (!result.success) {
        await interaction.reply({
          content: "❌ " + getSettingsUIMessage("invalidInput", locale),
          ephemeral: true,
        });
        return;
      }

      // Modal submissions need to use deferUpdate and editReply
      await interaction.deferUpdate();
      await interaction.editReply(
        buildRateLimitsPanel(guildId, userId, locale),
      );
      break;
    }

    default:
      await interaction.reply({
        content: "❌ " + getSettingsMessage("unknownSubcommand", locale),
        flags: MessageFlags.Ephemeral,
      });
  }
}

// Re-export constants and utilities for external use
export {
  createCustomId,
  parseCustomId,
  isSettingsCustomId,
} from "./constants.js";
