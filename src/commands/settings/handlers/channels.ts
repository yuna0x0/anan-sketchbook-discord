/**
 * Default Permissions Handlers - Default channel and role permission actions
 *
 * Handlers for:
 * - Set channel mode (all/whitelist/blacklist)
 * - Add/remove channel to list
 * - Clear all channels
 * - Add/remove default roles (allow/deny)
 * - Clear all default roles
 * - Reset all default permissions
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
  setChannelMode,
  ChannelMode,
  addDefaultAllowedRole,
  addDefaultDeniedRole,
  removeDefaultRole,
  clearDefaultRoles,
  clearDefaultSettings,
} from "../../../database/repositories/guildSettings.js";
import {
  addChannelPermission,
  removeChannelPermission,
  clearChannelPermissions,
  clearChannelPermissionsAndMode,
} from "../../../database/repositories/channelPermissions.js";
import {
  getSettingsUILabel,
  getSettingsUIMessage,
} from "../../../locales/index.js";
import {
  buildDefaultChannelsPanel,
  buildDefaultChannelsDetailPanel,
} from "../panels/permissions/defaultChannels.js";
import { buildDefaultRolesPanel } from "../panels/permissions/defaultRoles.js";
import { createCustomId } from "../constants.js";

// ============================================================================
// Default Channel Handlers
// ============================================================================

/**
 * Handle channel mode selection
 */
export async function handleSetChannelMode(
  interaction: StringSelectMenuInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  const mode = interaction.values[0] as ChannelMode;
  setChannelMode(guildId, mode);

  // Clear stored channels when switching modes to ensure clean state
  clearChannelPermissions(guildId);

  await interaction.update(
    buildDefaultChannelsDetailPanel(guildId, userId, locale, interaction.guild),
  );
}

/**
 * Handle adding a channel to the permissions list
 */
export async function handleAddChannel(
  interaction: ChannelSelectMenuInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  const channelId = interaction.values[0];
  addChannelPermission(guildId, channelId, true);

  await interaction.update(
    buildDefaultChannelsDetailPanel(guildId, userId, locale, interaction.guild),
  );
}

/**
 * Handle removing a channel from the permissions list
 */
export async function handleRemoveChannel(
  interaction: StringSelectMenuInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  const channelId = interaction.values[0];
  removeChannelPermission(guildId, channelId);

  await interaction.update(
    buildDefaultChannelsDetailPanel(guildId, userId, locale, interaction.guild),
  );
}

/**
 * Handle showing clear channels confirmation
 */
export async function handleClearChannels(
  interaction: ButtonInteraction,
  _guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  const embed = new EmbedBuilder()
    .setTitle(getSettingsUIMessage("confirmClearChannels", locale))
    .setColor(0xed4245);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(createCustomId("confirm_clear_channels", userId))
      .setEmoji("🗑️")
      .setLabel(getSettingsUILabel("confirmClear", locale))
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(createCustomId("default_channels_detail", userId))
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
 * Handle confirming clear all channels
 */
export async function handleConfirmClearChannels(
  interaction: ButtonInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  // Clear all channel permissions and reset mode to default (all)
  clearChannelPermissionsAndMode(guildId);

  await interaction.update(
    buildDefaultChannelsDetailPanel(guildId, userId, locale, interaction.guild),
  );
}

// ============================================================================
// Default Role Handlers
// ============================================================================

/**
 * Handle allowing a role in default settings
 */
export async function handleAllowDefaultRole(
  interaction: RoleSelectMenuInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  const roleId = interaction.values[0];
  addDefaultAllowedRole(guildId, roleId);

  await interaction.update(
    buildDefaultRolesPanel(guildId, userId, locale, interaction.guild),
  );
}

/**
 * Handle denying a role in default settings
 */
export async function handleDenyDefaultRole(
  interaction: RoleSelectMenuInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  const roleId = interaction.values[0];
  addDefaultDeniedRole(guildId, roleId);

  await interaction.update(
    buildDefaultRolesPanel(guildId, userId, locale, interaction.guild),
  );
}

/**
 * Handle removing a role from default settings
 */
export async function handleRemoveDefaultRole(
  interaction: StringSelectMenuInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  const roleId = interaction.values[0];
  removeDefaultRole(guildId, roleId);

  await interaction.update(
    buildDefaultRolesPanel(guildId, userId, locale, interaction.guild),
  );
}

/**
 * Handle showing clear default roles confirmation
 */
export async function handleClearDefaultRoles(
  interaction: ButtonInteraction,
  _guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  const embed = new EmbedBuilder()
    .setTitle(getSettingsUIMessage("confirmClearRoles", locale))
    .setColor(0xed4245);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(createCustomId("confirm_clear_default_roles", userId))
      .setEmoji("🗑️")
      .setLabel(getSettingsUILabel("confirmClear", locale))
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(createCustomId("default_roles", userId))
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
 * Handle confirming clear all default roles
 */
export async function handleConfirmClearDefaultRoles(
  interaction: ButtonInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  clearDefaultRoles(guildId);

  await interaction.update(
    buildDefaultRolesPanel(guildId, userId, locale, interaction.guild),
  );
}

// ============================================================================
// Reset Default Permissions Handlers
// ============================================================================

/**
 * Handle showing reset default permissions confirmation
 */
export async function handleResetDefaultPermissions(
  interaction: ButtonInteraction,
  _guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  const embed = new EmbedBuilder()
    .setTitle(getSettingsUIMessage("confirmResetDefaultPermissions", locale))
    .setColor(0xed4245);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(createCustomId("confirm_reset_default", userId))
      .setEmoji("🔄")
      .setLabel(getSettingsUILabel("confirmReset", locale))
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(createCustomId("channels", userId))
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
 * Handle confirming reset all default permissions
 */
export async function handleConfirmResetDefaultPermissions(
  interaction: ButtonInteraction,
  guildId: string,
  userId: string,
  locale: Locale | string,
): Promise<void> {
  clearDefaultSettings(guildId);

  await interaction.update(
    buildDefaultChannelsPanel(guildId, userId, locale, interaction.guild),
  );
}
