/**
 * Shared utilities for settings command UI
 */

import { ChannelType, Locale } from "discord.js";
import { CommandChannelMode } from "../../database/repositories/commandPermissions.js";
import { getSettingsUILabel } from "../../locales/index.js";

// ============================================================================
// Display Helpers
// ============================================================================

/**
 * Get emoji for channel type (for select menu emoji property)
 */
export function getChannelTypeEmoji(channelType: ChannelType): string {
  switch (channelType) {
    case ChannelType.GuildVoice:
      return "🔊";
    case ChannelType.GuildStageVoice:
      return "🎭";
    case ChannelType.GuildForum:
      return "💬";
    case ChannelType.GuildAnnouncement:
      return "📢";
    case ChannelType.PublicThread:
    case ChannelType.PrivateThread:
    case ChannelType.AnnouncementThread:
      return "🧵";
    default:
      return "#️⃣";
  }
}

/**
 * Get display text for command channel mode
 */
export function getCommandChannelModeDisplay(
  mode: CommandChannelMode,
  locale: Locale | string,
): string {
  switch (mode) {
    case "inherit":
      return getSettingsUILabel("channelModeInherit", locale);
    case "all":
      return getSettingsUILabel("channelModeAll", locale);
    case "whitelist":
      return getSettingsUILabel("channelModeWhitelist", locale);
    case "blacklist":
      return getSettingsUILabel("channelModeBlacklist", locale);
    default:
      return getSettingsUILabel("channelModeInherit", locale);
  }
}

/**
 * Allowed parent channel types for selection
 * Threads are automatically included with their parent channel
 */
export const ALLOWED_CHANNEL_TYPES = [
  ChannelType.GuildText,
  ChannelType.GuildAnnouncement,
  ChannelType.GuildForum,
  ChannelType.GuildVoice,
  ChannelType.GuildStageVoice,
] as const;
