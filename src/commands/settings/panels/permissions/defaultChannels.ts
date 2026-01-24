/**
 * Default Permissions - Channel Panel
 *
 * Part of "Command Permissions > Default Permissions".
 * Configures default channel mode (all/whitelist/blacklist) that applies
 * to all commands by default. Per-command settings can override this.
 *
 * Channel permission logic:
 * - All: Bot can be used in any channel
 * - Whitelist: Bot can only be used in listed channels (and their threads)
 * - Blacklist: Bot cannot be used in listed channels (and their threads)
 *
 * Threads automatically inherit from their parent channel.
 */

import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ChannelSelectMenuBuilder,
  Locale,
  channelMention,
  roleMention,
} from "discord.js";
import type { Guild } from "discord.js";
import { getOrCreateGuildSettings } from "../../../../database/repositories/guildSettings.js";
import {
  getChannelPermissions,
  cleanupDeletedChannels,
} from "../../../../database/repositories/channelPermissions.js";
import {
  getSettingsMessage,
  getChannelModeDisplay,
  getSettingsUILabel,
  getSettingsUIMessage,
  SETTINGS_COMMAND_LOCALIZATIONS,
} from "../../../../locales/index.js";
import { createCustomId } from "../../constants.js";
import { getChannelTypeEmoji, ALLOWED_CHANNEL_TYPES } from "../../utils.js";

/**
 * Build the default permissions overview panel (like commandDetail)
 */
export function buildDefaultChannelsPanel(
  guildId: string,
  userId: string,
  locale: Locale | string,
  guild?: Guild | null,
): {
  embeds: EmbedBuilder[];
  components: ActionRowBuilder<ButtonBuilder>[];
} {
  const settings = getOrCreateGuildSettings(guildId);

  // Clean up deleted channels if we have guild info
  if (guild) {
    const existingChannelIds = new Set(guild.channels.cache.keys());
    cleanupDeletedChannels(guildId, existingChannelIds);
  }

  // Re-fetch channels after cleanup
  const channels = getChannelPermissions(guildId);

  // Build channel settings display
  const channelModeDisplay = getChannelModeDisplay(
    settings.channel_mode,
    locale,
  );
  let channelSettingsValue = `**${channelModeDisplay}**`;
  if (
    settings.channel_mode === "whitelist" ||
    settings.channel_mode === "blacklist"
  ) {
    if (channels.length > 0) {
      channelSettingsValue += `\n${channels
        .slice(0, 5)
        .map((c) => channelMention(c.channel_id))
        .join(", ")}`;
      if (channels.length > 5) {
        channelSettingsValue += ` (+${channels.length - 5})`;
      }
    }
  }

  // Build role settings display
  const allowedRoles = settings.allowed_roles;
  const deniedRoles = settings.denied_roles;
  let roleSettingsValue = "";
  if (allowedRoles.length > 0) {
    roleSettingsValue += `✅ ${getSettingsMessage("allowedRoles", locale)}: ${allowedRoles
      .slice(0, 3)
      .map((r) => roleMention(r))
      .join(", ")}`;
    if (allowedRoles.length > 3) {
      roleSettingsValue += ` (+${allowedRoles.length - 3})`;
    }
  }
  if (deniedRoles.length > 0) {
    if (roleSettingsValue) roleSettingsValue += "\n";
    roleSettingsValue += `🚫 ${getSettingsMessage("deniedRoles", locale)}: ${deniedRoles
      .slice(0, 3)
      .map((r) => roleMention(r))
      .join(", ")}`;
    if (deniedRoles.length > 3) {
      roleSettingsValue += ` (+${deniedRoles.length - 3})`;
    }
  }
  if (!roleSettingsValue) {
    roleSettingsValue = getSettingsMessage("noneEveryoneAllowed", locale);
  }

  const embed = new EmbedBuilder()
    .setTitle(getSettingsUIMessage("defaultPermissionsTitle", locale))
    .setDescription(
      getSettingsUIMessage("defaultPermissionsDescription", locale),
    )
    .setColor(0x5865f2)
    .addFields(
      {
        name: `📢 ${getSettingsUILabel("channelSettingsLabel", locale)}`,
        value: channelSettingsValue,
        inline: false,
      },
      {
        name: `👥 ${getSettingsUILabel("roleSettingsLabel", locale)}`,
        value: roleSettingsValue,
        inline: false,
      },
    );

  // Add permission logic explanation
  embed.addFields({
    name: `💡 ${getSettingsUILabel("permissionLogicTitle", locale)}`,
    value: getSettingsUILabel("permissionLogicDesc", locale),
    inline: false,
  });

  const manageRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(createCustomId("default_channels_detail", userId))
      .setEmoji("📢")
      .setLabel(getSettingsUILabel("manageChannels", locale))
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(createCustomId("default_roles", userId))
      .setEmoji("👥")
      .setLabel(getSettingsUILabel("manageRoles", locale))
      .setStyle(ButtonStyle.Primary),
  );

  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(createCustomId("reset_default_permissions", userId))
      .setEmoji("🔄")
      .setLabel(getSettingsUILabel("resetPermissions", locale))
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(createCustomId("commands", userId))
      .setEmoji("◀️")
      .setLabel(getSettingsUILabel("backButton", locale))
      .setStyle(ButtonStyle.Secondary),
  );

  return {
    embeds: [embed],
    components: [manageRow, actionRow],
  };
}

/**
 * Build the default channels detail panel (for managing channels)
 */
export function buildDefaultChannelsDetailPanel(
  guildId: string,
  userId: string,
  locale: Locale | string,
  guild?: Guild | null,
): {
  embeds: EmbedBuilder[];
  components: ActionRowBuilder<
    ButtonBuilder | StringSelectMenuBuilder | ChannelSelectMenuBuilder
  >[];
} {
  const settings = getOrCreateGuildSettings(guildId);

  // Clean up deleted channels if we have guild info
  if (guild) {
    const existingChannelIds = new Set(guild.channels.cache.keys());
    cleanupDeletedChannels(guildId, existingChannelIds);
  }

  // Re-fetch channels after cleanup
  const channels = getChannelPermissions(guildId);

  // Build mode description based on current mode
  let modeDescription: string;
  switch (settings.channel_mode) {
    case "all":
      modeDescription = getSettingsUIMessage("channelModeAllDesc", locale);
      break;
    case "whitelist":
      modeDescription = getSettingsUIMessage(
        "channelModeWhitelistDesc",
        locale,
      );
      break;
    case "blacklist":
      modeDescription = getSettingsUIMessage(
        "channelModeBlacklistDesc",
        locale,
      );
      break;
    default:
      modeDescription = "";
  }

  const embed = new EmbedBuilder()
    .setTitle(`📢 ${getSettingsUIMessage("defaultChannelTitle", locale)}`)
    .setDescription(getSettingsUIMessage("defaultChannelDescription", locale))
    .setColor(0x5865f2)
    .addFields(
      {
        name: getSettingsUIMessage("currentMode", locale),
        value: `**${getChannelModeDisplay(settings.channel_mode, locale)}**\n_${modeDescription}_`,
        inline: false,
      },
      {
        name: getSettingsUIMessage("configuredChannels", locale),
        value:
          channels.length > 0
            ? channels.map((c) => channelMention(c.channel_id)).join("\n")
            : getSettingsMessage("none", locale),
        inline: false,
      },
    );

  // Add helpful notes based on mode
  if (settings.channel_mode !== "all") {
    embed.addFields({
      name: "💡 " + getSettingsUILabel("threadInheritanceNote", locale),
      value: getSettingsUILabel("threadInheritanceDesc", locale),
      inline: false,
    });
  }

  // Channel mode selector
  const modeRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(createCustomId("set_channel_mode", userId))
      .setPlaceholder(getSettingsUILabel("selectChannelMode", locale))
      .addOptions([
        {
          label:
            SETTINGS_COMMAND_LOCALIZATIONS.channelModeChoices.all[
              locale as Locale
            ] ||
            SETTINGS_COMMAND_LOCALIZATIONS.channelModeChoices.all[
              Locale.EnglishUS
            ]!,
          value: "all",
          default: settings.channel_mode === "all",
          emoji: "🌐",
        },
        {
          label:
            SETTINGS_COMMAND_LOCALIZATIONS.channelModeChoices.whitelist[
              locale as Locale
            ] ||
            SETTINGS_COMMAND_LOCALIZATIONS.channelModeChoices.whitelist[
              Locale.EnglishUS
            ]!,
          value: "whitelist",
          default: settings.channel_mode === "whitelist",
          emoji: "✅",
        },
        {
          label:
            SETTINGS_COMMAND_LOCALIZATIONS.channelModeChoices.blacklist[
              locale as Locale
            ] ||
            SETTINGS_COMMAND_LOCALIZATIONS.channelModeChoices.blacklist[
              Locale.EnglishUS
            ]!,
          value: "blacklist",
          default: settings.channel_mode === "blacklist",
          emoji: "🚫",
        },
      ]),
  );

  const components: ActionRowBuilder<
    ButtonBuilder | StringSelectMenuBuilder | ChannelSelectMenuBuilder
  >[] = [modeRow];

  // Only show channel selector if mode is whitelist or blacklist (not "all")
  // "All" mode means all channels are already allowed, so no need to add channels
  if (
    settings.channel_mode === "whitelist" ||
    settings.channel_mode === "blacklist"
  ) {
    const addChannelRow =
      new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId(createCustomId("add_channel", userId))
          .setPlaceholder(getSettingsUILabel("selectChannelToAdd", locale))
          .setChannelTypes(...ALLOWED_CHANNEL_TYPES),
      );
    components.push(addChannelRow);
  }

  // Add remove channel select if there are channels configured
  if (channels.length > 0) {
    const removeChannelRow =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(createCustomId("remove_channel", userId))
          .setPlaceholder(getSettingsUILabel("selectChannelToRemove", locale))
          .addOptions(
            channels.slice(0, 25).map((c) => {
              const channel = guild?.channels.cache.get(c.channel_id);
              return {
                label: channel ? channel.name : c.channel_id,
                value: c.channel_id,
                emoji: channel ? getChannelTypeEmoji(channel.type) : "#️⃣",
              };
            }),
          ),
      );
    components.push(removeChannelRow);
  }

  // Enable clear button if mode is not default (all) or has channels configured
  const hasChanges = settings.channel_mode !== "all" || channels.length > 0;

  const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(createCustomId("clear_channels", userId))
      .setEmoji("🗑️")
      .setLabel(getSettingsUILabel("clearAllChannels", locale))
      .setStyle(ButtonStyle.Danger)
      .setDisabled(!hasChanges),
    new ButtonBuilder()
      .setCustomId(createCustomId("channels", userId))
      .setEmoji("◀️")
      .setLabel(getSettingsUILabel("backButton", locale))
      .setStyle(ButtonStyle.Secondary),
  );
  components.push(buttonRow);

  return {
    embeds: [embed],
    components,
  };
}
