/**
 * Command Handlers - Per-command permission actions
 *
 * Handlers for:
 * - Select command (navigate to detail or global channels)
 * - Toggle command enable/disable
 * - Role permissions (allow/deny/remove/clear)
 * - Channel permissions (mode/allow/deny/remove/clear)
 * - Reset command permissions
 * - Reset all command settings (global + per-command)
 */

import {
  ButtonInteraction,
  StringSelectMenuInteraction,
  ChannelSelectMenuInteraction,
  RoleSelectMenuInteraction,
  Locale,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import {
  setCommandEnabled,
  getCommandPermission,
  addAllowedRole,
  addDeniedRole,
  removeAllowedRole,
  removeDeniedRole,
  setCommandChannelMode,
  addCommandChannelPermission,
  removeCommandChannelPermission,
  clearCommandPermissions,
  clearCommandChannels,
  clearCommandChannelsAndMode,
  clearCommandRoles,
  CommandChannelMode,
} from "../../../database/repositories/commandPermissions.js";
import { resetAllCommandSettings } from "../../../database/repositories/guildSettings.js";
import {
  getSettingsUILabel,
  getSettingsUIMessage,
} from "../../../locales/index.js";
import { buildDefaultChannelsPanel } from "../panels/permissions/defaultChannels.js";
import { buildCommandsPanel } from "../panels/permissions/overview.js";
import { buildCommandDetailPanel } from "../panels/permissions/commandDetail.js";
import { buildCommandChannelsPanel } from "../panels/permissions/commandChannels.js";
import { buildCommandRolesPanel } from "../panels/permissions/commandRoles.js";
import { createCustomId } from "../constants.js";

/**
 * Handle command selection (from commands panel)
 */
export async function handleSelectCommand(
  interaction: StringSelectMenuInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  const selection = interaction.values[0];

  if (selection === "__default__") {
    // Navigate to default permissions settings
    await interaction.update(
      buildDefaultChannelsPanel(guildId, userId, locale, interaction.guild),
    );
  } else {
    // Navigate to command detail panel
    await interaction.update(
      buildCommandDetailPanel(guildId, userId, locale, selection),
    );
  }
}

/**
 * Handle command enable/disable toggle
 */
export async function handleToggleCommand(
  interaction: ButtonInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
  commandName: string,
): Promise<void> {
  const permission = getCommandPermission(guildId, commandName);
  const newState = permission?.enabled === false;
  setCommandEnabled(guildId, commandName, newState);

  await interaction.update(
    buildCommandDetailPanel(guildId, userId, locale, commandName),
  );
}

// ============================================================================
// Role Permission Handlers
// ============================================================================

/**
 * Handle allowing a role for a command
 */
export async function handleAllowRole(
  interaction: RoleSelectMenuInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
  commandName: string,
): Promise<void> {
  const roleId = interaction.values[0];
  addAllowedRole(guildId, commandName, roleId);

  await interaction.update(
    buildCommandRolesPanel(
      guildId,
      userId,
      locale,
      commandName,
      interaction.guild,
    ),
  );
}

/**
 * Handle denying a role for a command
 */
export async function handleDenyRole(
  interaction: RoleSelectMenuInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
  commandName: string,
): Promise<void> {
  const roleId = interaction.values[0];
  addDeniedRole(guildId, commandName, roleId);

  await interaction.update(
    buildCommandRolesPanel(
      guildId,
      userId,
      locale,
      commandName,
      interaction.guild,
    ),
  );
}

/**
 * Handle removing a role from command permissions
 */
export async function handleRemoveRole(
  interaction: StringSelectMenuInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
  commandName: string,
): Promise<void> {
  const roleId = interaction.values[0];
  removeAllowedRole(guildId, commandName, roleId);
  removeDeniedRole(guildId, commandName, roleId);

  await interaction.update(
    buildCommandRolesPanel(
      guildId,
      userId,
      locale,
      commandName,
      interaction.guild,
    ),
  );
}

// ============================================================================
// Channel Permission Handlers
// ============================================================================

/**
 * Handle setting command channel mode
 */
export async function handleSetCommandChannelMode(
  interaction: StringSelectMenuInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
  commandName: string,
): Promise<void> {
  const mode = interaction.values[0] as CommandChannelMode;
  setCommandChannelMode(guildId, commandName, mode);

  // Clear stored channels when switching modes to ensure clean state
  // (only clears channel list, preserves the selected mode)
  clearCommandChannels(guildId, commandName);

  await interaction.update(
    buildCommandChannelsPanel(
      guildId,
      userId,
      locale,
      commandName,
      interaction.guild,
    ),
  );
}

/**
 * Handle adding a channel to a command's channel list
 */
export async function handleAddCommandChannel(
  interaction: ChannelSelectMenuInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
  commandName: string,
): Promise<void> {
  const channelId = interaction.values[0];
  addCommandChannelPermission(guildId, commandName, channelId);

  await interaction.update(
    buildCommandChannelsPanel(
      guildId,
      userId,
      locale,
      commandName,
      interaction.guild,
    ),
  );
}

/**
 * Handle removing a channel from command's channel list
 */
export async function handleRemoveCommandChannel(
  interaction: StringSelectMenuInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
  commandName: string,
): Promise<void> {
  const channelId = interaction.values[0];
  removeCommandChannelPermission(guildId, commandName, channelId);

  await interaction.update(
    buildCommandChannelsPanel(
      guildId,
      userId,
      locale,
      commandName,
      interaction.guild,
    ),
  );
}

// ============================================================================
// Reset Command Handlers
// ============================================================================

/**
 * Handle showing reset command confirmation
 */
export async function handleResetCommand(
  interaction: ButtonInteraction,
  _guildId: string,
  userId: string,
  locale: Locale | string,
  commandName: string,
): Promise<void> {
  const embed = new EmbedBuilder()
    .setTitle(
      getSettingsUIMessage("confirmResetCommand", locale, {
        command: commandName,
      }),
    )
    .setColor(0xed4245);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(createCustomId("confirm_reset_command", userId, commandName))
      .setEmoji("🔄")
      .setLabel(getSettingsUILabel("confirmReset", locale))
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(createCustomId("back_to_command", userId, commandName))
      .setEmoji("❌")
      .setLabel(getSettingsUILabel("cancel", locale))
      .setStyle(ButtonStyle.Secondary),
  );

  await interaction.update({
    embeds: [embed],
    components: [row],
  });
}

/**
 * Handle confirming reset command permissions
 */
export async function handleConfirmResetCommand(
  interaction: ButtonInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
  commandName: string,
): Promise<void> {
  clearCommandPermissions(guildId, commandName);

  await interaction.update(
    buildCommandDetailPanel(guildId, userId, locale, commandName),
  );
}

// ============================================================================
// Reset All Command Settings Handlers
// ============================================================================

/**
 * Handle showing reset all command settings confirmation
 */
export async function handleResetAllCommandSettings(
  interaction: ButtonInteraction,
  _guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  const embed = new EmbedBuilder()
    .setTitle(getSettingsUIMessage("confirmResetAllCommandPermissions", locale))
    .setColor(0xed4245);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(createCustomId("confirm_reset_all_commands", userId))
      .setEmoji("🔄")
      .setLabel(getSettingsUILabel("confirmReset", locale))
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(createCustomId("commands", userId))
      .setEmoji("❌")
      .setLabel(getSettingsUILabel("cancel", locale))
      .setStyle(ButtonStyle.Secondary),
  );

  await interaction.update({
    embeds: [embed],
    components: [row],
  });
}

/**
 * Handle confirming reset all command settings
 */
export async function handleConfirmResetAllCommandSettings(
  interaction: ButtonInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  resetAllCommandSettings(guildId);

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
}

// ============================================================================
// Clear Command Permission Handlers
// ============================================================================

/**
 * Handle showing clear command channels confirmation
 */
export async function handleClearCommandChannels(
  interaction: ButtonInteraction,
  _guildId: string,
  userId: string,
  locale: Locale | string,
  commandName: string,
): Promise<void> {
  const embed = new EmbedBuilder()
    .setTitle(getSettingsUIMessage("confirmClearChannels", locale))
    .setColor(0xed4245);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(
        createCustomId("confirm_clear_cmd_channels", userId, commandName),
      )
      .setEmoji("🗑️")
      .setLabel(getSettingsUILabel("confirmClear", locale))
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(createCustomId("command_channels", userId, commandName))
      .setEmoji("❌")
      .setLabel(getSettingsUILabel("cancel", locale))
      .setStyle(ButtonStyle.Secondary),
  );

  await interaction.update({
    embeds: [embed],
    components: [row],
  });
}

/**
 * Handle confirming clear command channels
 */
export async function handleConfirmClearCommandChannels(
  interaction: ButtonInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
  commandName: string,
): Promise<void> {
  clearCommandChannelsAndMode(guildId, commandName);

  await interaction.update(
    buildCommandChannelsPanel(
      guildId,
      userId,
      locale,
      commandName,
      interaction.guild,
    ),
  );
}

/**
 * Handle showing clear command roles confirmation
 */
export async function handleClearCommandRoles(
  interaction: ButtonInteraction,
  _guildId: string,
  userId: string,
  locale: Locale | string,
  commandName: string,
): Promise<void> {
  const embed = new EmbedBuilder()
    .setTitle(getSettingsUIMessage("confirmClearRoles", locale))
    .setColor(0xed4245);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(
        createCustomId("confirm_clear_cmd_roles", userId, commandName),
      )
      .setEmoji("🗑️")
      .setLabel(getSettingsUILabel("confirmClear", locale))
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(createCustomId("command_roles", userId, commandName))
      .setEmoji("❌")
      .setLabel(getSettingsUILabel("cancel", locale))
      .setStyle(ButtonStyle.Secondary),
  );

  await interaction.update({
    embeds: [embed],
    components: [row],
  });
}

/**
 * Handle confirming clear command roles
 */
export async function handleConfirmClearCommandRoles(
  interaction: ButtonInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
  commandName: string,
): Promise<void> {
  clearCommandRoles(guildId, commandName);

  await interaction.update(
    buildCommandRolesPanel(
      guildId,
      userId,
      locale,
      commandName,
      interaction.guild,
    ),
  );
}
