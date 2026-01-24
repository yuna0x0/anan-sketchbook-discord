/**
 * Per-command Permissions - Channel Panel
 *
 * Part of "Command Permissions > Per-command" settings.
 * Configures channel-specific permissions for a single command.
 * This overrides the default channel settings when not set to "inherit".
 *
 * Channel Mode Options:
 * - Inherit: Use default channel settings
 * - All: Allow this command in all channels (ignore default settings)
 * - Whitelist: Only allow this command in specified channels
 * - Blacklist: Block this command in specified channels
 *
 * Permission Resolution:
 * 1. Check per-command channel settings first
 * 2. If mode is "inherit", fall back to default channel settings
 * 3. Threads inherit from their parent channel
 *
 * Interaction with role/user permissions:
 * Channel permissions are checked BEFORE role/user permissions.
 * If channel is blocked, the command is denied regardless of role/user settings.
 *
 * This panel now uses a single channel list + mode approach (like default channels)
 * instead of separate allowed/denied lists.
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
  Guild,
} from "discord.js";
import {
  getCommandPermission,
  getCommandChannelPermissions,
  cleanupDeletedCommandChannels,
} from "../../../../database/repositories/commandPermissions.js";
import {
  getSettingsMessage,
  getSettingsUILabel,
  getSettingsUIMessage,
} from "../../../../locales/index.js";
import { createCustomId } from "../../constants.js";
import {
  getChannelTypeEmoji,
  getCommandChannelModeDisplay,
  ALLOWED_CHANNEL_TYPES,
} from "../../utils.js";

/**
 * Build the command channels panel
 */
export function buildCommandChannelsPanel(
  guildId: string,
  userId: string,
  locale: Locale | string,
  commandName: string,
  guild?: Guild | null,
): {
  embeds: EmbedBuilder[];
  components: ActionRowBuilder<
    ButtonBuilder | StringSelectMenuBuilder | ChannelSelectMenuBuilder
  >[];
} {
  // Clean up deleted channels from command permissions
  if (guild) {
    const existingChannelIds = new Set(guild.channels.cache.keys());
    cleanupDeletedCommandChannels(guildId, commandName, existingChannelIds);
  }

  // Fetch permission after cleanup
  const permission = getCommandPermission(guildId, commandName);
  const channelMode = permission?.channel_mode ?? "inherit";

  // Get channels from the separate table
  const channelPermissions = getCommandChannelPermissions(guildId, commandName);
  const channels = channelPermissions.map((cp) => cp.channel_id);

  // Build mode description
  let modeDescription: string;
  switch (channelMode) {
    case "inherit":
      modeDescription = getSettingsUILabel("channelModeInheritDesc", locale);
      break;
    case "all":
      modeDescription = getSettingsUILabel("channelModeAllDesc", locale);
      break;
    case "whitelist":
      modeDescription = getSettingsUILabel("channelModeWhitelistDesc", locale);
      break;
    case "blacklist":
      modeDescription = getSettingsUILabel("channelModeBlacklistDesc", locale);
      break;
    default:
      modeDescription = "";
  }

  // Build channel list field based on mode
  let channelListLabel: string;
  let channelListValue: string;

  if (channelMode === "whitelist") {
    channelListLabel = `✅ ${getSettingsUILabel("allowedChannelsLabel", locale)}`;
    channelListValue =
      channels.length > 0
        ? channels.map((c) => channelMention(c)).join(", ")
        : getSettingsMessage("noneEveryoneAllowed", locale);
  } else if (channelMode === "blacklist") {
    channelListLabel = `🚫 ${getSettingsUILabel("deniedChannelsLabel", locale)}`;
    channelListValue =
      channels.length > 0
        ? channels.map((c) => channelMention(c)).join(", ")
        : getSettingsMessage("none", locale);
  } else {
    // For inherit and all modes, show the channel list as informational
    channelListLabel = `📋 ${getSettingsUILabel("channelListLabel", locale)}`;
    channelListValue =
      channels.length > 0
        ? channels.map((c) => channelMention(c)).join(", ")
        : getSettingsMessage("none", locale);
  }

  const embed = new EmbedBuilder()
    .setTitle(
      getSettingsUIMessage("channelPermissionsTitle", locale, {
        command: commandName,
      }),
    )
    .setDescription(getSettingsUIMessage("commandChannelDescription", locale))
    .setColor(0x5865f2)
    .addFields(
      {
        name: getSettingsUILabel("channelModeLabel", locale),
        value: `**${getCommandChannelModeDisplay(channelMode, locale)}**\n_${modeDescription}_`,
        inline: false,
      },
      {
        name: channelListLabel,
        value: channelListValue,
        inline: false,
      },
    );

  // Add thread inheritance note
  if (channelMode === "whitelist" || channelMode === "blacklist") {
    embed.addFields({
      name: `💡 ${getSettingsUILabel("threadInheritanceNote", locale)}`,
      value: getSettingsUILabel("threadInheritanceDesc", locale),
      inline: false,
    });
  }

  // Channel mode selector
  const modeRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(
        createCustomId("set_command_channel_mode", userId, commandName),
      )
      .setPlaceholder(getSettingsUILabel("selectChannelMode", locale))
      .addOptions([
        {
          label: getSettingsUILabel("channelModeInherit", locale),
          description: getSettingsUILabel("channelModeInheritDesc", locale),
          value: "inherit",
          default: channelMode === "inherit",
          emoji: "📥",
        },
        {
          label: getSettingsUILabel("channelModeAll", locale),
          description: getSettingsUILabel("channelModeAllDesc", locale),
          value: "all",
          default: channelMode === "all",
          emoji: "🌐",
        },
        {
          label: getSettingsUILabel("channelModeWhitelist", locale),
          description: getSettingsUILabel("channelModeWhitelistDesc", locale),
          value: "whitelist",
          default: channelMode === "whitelist",
          emoji: "✅",
        },
        {
          label: getSettingsUILabel("channelModeBlacklist", locale),
          description: getSettingsUILabel("channelModeBlacklistDesc", locale),
          value: "blacklist",
          default: channelMode === "blacklist",
          emoji: "🚫",
        },
      ]),
  );

  const components: ActionRowBuilder<
    ButtonBuilder | StringSelectMenuBuilder | ChannelSelectMenuBuilder
  >[] = [modeRow];

  // Only show channel selector if mode is whitelist or blacklist
  if (channelMode === "whitelist" || channelMode === "blacklist") {
    const addChannelRow =
      new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId(
            createCustomId("add_command_channel", userId, commandName),
          )
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
          .setCustomId(
            createCustomId("remove_command_channel", userId, commandName),
          )
          .setPlaceholder(getSettingsUILabel("selectChannelToRemove", locale))
          .addOptions(
            channels.slice(0, 25).map((channelId) => {
              const channel = guild?.channels.cache.get(channelId);
              return {
                label: channel ? channel.name : channelId,
                description:
                  channelMode === "whitelist"
                    ? getSettingsUILabel("allowedLabel", locale)
                    : getSettingsUILabel("deniedLabel", locale),
                value: channelId,
                emoji: channel ? getChannelTypeEmoji(channel.type) : "#️⃣",
              };
            }),
          ),
      );
    components.push(removeChannelRow);
  }

  // Enable clear button if mode is not default (inherit) or has channels configured
  const hasChanges = channelMode !== "inherit" || channels.length > 0;

  const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(
        createCustomId("clear_command_channels", userId, commandName),
      )
      .setEmoji("🗑️")
      .setLabel(getSettingsUILabel("clearAllChannels", locale))
      .setStyle(ButtonStyle.Danger)
      .setDisabled(!hasChanges),
    new ButtonBuilder()
      .setCustomId(createCustomId("back_to_command", userId, commandName))
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
