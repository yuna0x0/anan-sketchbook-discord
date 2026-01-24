/**
 * Permission Service
 * Provides a unified interface for checking all permissions before command execution.
 * Combines guild settings, channel permissions, command permissions, and rate limits.
 */

import type { APIInteractionGuildMember } from "discord-api-types/v10";
import { PermissionFlagsBits } from "discord-api-types/v10";
import type { GuildMember } from "discord.js";
import { Locale } from "discord.js";
import {
  isGuildEnabled,
  canUserUseBot,
} from "../database/repositories/guildSettings.js";
import { canUseInChannel } from "../database/repositories/channelPermissions.js";
import {
  isCommandEnabled,
  canUserUseCommand,
  canCommandUseChannel,
} from "../database/repositories/commandPermissions.js";
import {
  consumeRateLimit,
  checkRateLimit,
} from "../database/repositories/rateLimits.js";
import {
  getPermissionDeniedMessage as getLocalizedPermissionMessage,
  PERMISSION_DENIED_MESSAGES,
} from "../locales/index.js";

/**
 * Result of a permission check.
 */
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: PermissionDeniedReason;
  details?: string;
  retryAfter?: number;
}

/**
 * Reasons why permission might be denied.
 */
export enum PermissionDeniedReason {
  BOT_DISABLED = "botDisabled",
  CHANNEL_NOT_ALLOWED = "channelNotAllowed",
  COMMAND_DISABLED = "commandDisabled",
  USER_DENIED = "userDenied",
  ROLE_DENIED = "roleDenied",
  NO_ALLOWED_ROLE = "noAllowedRole",
  RATE_LIMITED = "rateLimited",
  NOT_IN_GUILD = "notInGuild",
  GLOBAL_USER_DENIED = "globalUserDenied",
}

/**
 * Channel type that can be checked for permissions.
 * Uses a structural type to support any channel with an id, including future Discord channel types.
 */
type PermissionCheckChannel = {
  id: string;
  isThread: () => boolean;
  parentId?: string | null;
};

/**
 * Checks if a channel is a thread.
 */
function isThread(channel: PermissionCheckChannel): boolean {
  return channel.isThread();
}

/**
 * Gets the parent channel ID for a channel (returns the channel ID itself if not a thread).
 */
function getParentChannelId(
  channel: PermissionCheckChannel,
): string | undefined {
  if (isThread(channel)) {
    return channel.parentId ?? undefined;
  }
  return undefined;
}

/**
 * Extracts role IDs from a member object.
 * Handles both GuildMember (with roles.cache Collection) and APIInteractionGuildMember (with roles array).
 */
function getMemberRoleIds(
  member: GuildMember | APIInteractionGuildMember,
): string[] {
  // Check if it's a GuildMember with roles.cache (Collection)
  if (
    "cache" in member.roles &&
    typeof member.roles.cache?.map === "function"
  ) {
    return member.roles.cache.map((role) => role.id);
  }
  // Otherwise it's an APIInteractionGuildMember with roles as string[]
  if (Array.isArray(member.roles)) {
    return member.roles;
  }
  // Fallback to empty array if neither
  return [];
}

/**
 * Gets the member ID from either GuildMember or APIInteractionGuildMember.
 */
function getMemberId(member: GuildMember | APIInteractionGuildMember): string {
  // GuildMember has .id directly
  if ("id" in member && typeof member.id === "string") {
    return member.id;
  }
  // APIInteractionGuildMember has .user.id
  if ("user" in member && member.user && typeof member.user.id === "string") {
    return member.user.id;
  }
  return "";
}

/**
 * Performs a complete permission check for a command execution.
 * This is the main function to use before executing any command.
 *
 * @param guildId - The guild ID (null if not in a guild)
 * @param channel - The channel where the command was executed
 * @param member - The guild member executing the command
 * @param commandName - The name of the command being executed
 * @param consumeRate - Whether to consume a rate limit use (set to false for dry-run checks)
 */
export function checkPermissions(
  guildId: string | null,
  channel: PermissionCheckChannel | null,
  member: GuildMember | APIInteractionGuildMember | null,
  commandName: string,
  consumeRate: boolean = true,
): PermissionCheckResult {
  // If not in a guild, allow (DM or user-installed apps)
  // The bot can be used as a user-installed app in DMs
  if (!guildId) {
    return { allowed: true };
  }

  // Check if bot is enabled for the guild
  if (!isGuildEnabled(guildId)) {
    return {
      allowed: false,
      reason: PermissionDeniedReason.BOT_DISABLED,
    };
  }

  // Check channel permissions if we have channel info
  if (channel) {
    const channelId = channel.id;
    const parentChannelId = getParentChannelId(channel);

    // First check per-command channel permissions
    const commandChannelResult = canCommandUseChannel(
      guildId,
      commandName,
      channelId,
      parentChannelId,
    );

    if (commandChannelResult !== null) {
      // Command has its own channel settings
      if (!commandChannelResult) {
        return {
          allowed: false,
          reason: PermissionDeniedReason.CHANNEL_NOT_ALLOWED,
        };
      }
      // If commandChannelResult is true, skip default check
    } else {
      // Fall back to default channel settings
      if (!canUseInChannel(guildId, channelId, parentChannelId)) {
        return {
          allowed: false,
          reason: PermissionDeniedReason.CHANNEL_NOT_ALLOWED,
        };
      }
    }
  }

  // Check if the command is enabled
  if (!isCommandEnabled(guildId, commandName)) {
    return {
      allowed: false,
      reason: PermissionDeniedReason.COMMAND_DISABLED,
    };
  }

  // Check role permissions if we have member info
  if (member) {
    const userRoleIds = getMemberRoleIds(member);

    // First check default role permissions
    if (!canUserUseBot(guildId, userRoleIds)) {
      return {
        allowed: false,
        reason: PermissionDeniedReason.GLOBAL_USER_DENIED,
      };
    }

    // Then check per-command role permissions
    if (!canUserUseCommand(guildId, commandName, userRoleIds)) {
      return {
        allowed: false,
        reason: PermissionDeniedReason.USER_DENIED,
      };
    }
  }

  // Check rate limits
  if (member) {
    const memberId = getMemberId(member);
    if (consumeRate) {
      const rateLimitResult = consumeRateLimit(guildId, memberId, commandName);

      if (!rateLimitResult.allowed) {
        return {
          allowed: false,
          reason: PermissionDeniedReason.RATE_LIMITED,
          retryAfter: rateLimitResult.retryAfter,
        };
      }
    } else {
      // Dry-run check without consuming
      const rateLimitCheck = checkRateLimit(guildId, memberId, commandName);

      if (rateLimitCheck.limited) {
        return {
          allowed: false,
          reason: PermissionDeniedReason.RATE_LIMITED,
          retryAfter: rateLimitCheck.retryAfter,
        };
      }
    }
  }

  // All checks passed
  return { allowed: true };
}

/**
 * Checks if a permission bitfield string has a specific permission.
 * Used for APIInteractionGuildMember which has permissions as a string.
 */
function hasPermissionBit(permissions: string, permissionBit: bigint): boolean {
  try {
    const permissionsBigInt = BigInt(permissions);
    return (permissionsBigInt & permissionBit) === permissionBit;
  } catch {
    return false;
  }
}

/**
 * Checks if a user has admin privileges in a guild.
 * Admins can bypass most permission checks and configure bot settings.
 *
 * Handles both GuildMember (with permissions.has method) and
 * APIInteractionGuildMember (with permissions as string bitfield).
 *
 * @param member - The guild member to check
 * @param guildOwnerId - The guild owner ID (required for API member type)
 */
export function isAdmin(
  member: GuildMember | APIInteractionGuildMember | null,
  guildOwnerId?: string,
): boolean {
  if (!member) {
    return false;
  }

  // Get member ID - handles both types
  const memberId = getMemberId(member);

  // Check if it's a GuildMember with .guild property
  if ("guild" in member && member.guild && "ownerId" in member.guild) {
    // GuildMember type
    if (member.guild.ownerId === memberId) {
      return true;
    }
  } else if (guildOwnerId && memberId === guildOwnerId) {
    // APIInteractionGuildMember type - use provided guildOwnerId
    return true;
  }

  // Check permissions - handle both types
  // Check type first to avoid using 'in' operator on primitives
  if (typeof member.permissions === "string") {
    // APIInteractionGuildMember with permissions as string bitfield
    if (
      hasPermissionBit(member.permissions, PermissionFlagsBits.Administrator)
    ) {
      return true;
    }
    if (hasPermissionBit(member.permissions, PermissionFlagsBits.ManageGuild)) {
      return true;
    }
  } else if (
    member.permissions &&
    typeof member.permissions === "object" &&
    "has" in member.permissions &&
    typeof member.permissions.has === "function"
  ) {
    // GuildMember with Permissions object
    if (member.permissions.has("Administrator")) {
      return true;
    }
    if (member.permissions.has("ManageGuild")) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if a user can manage bot settings.
 * This is used for the /settings command.
 *
 * @param member - The guild member to check
 * @param guildOwnerId - The guild owner ID (required for API member type)
 */
export function canManageBot(
  member: GuildMember | APIInteractionGuildMember | null,
  guildOwnerId?: string,
): boolean {
  return isAdmin(member, guildOwnerId);
}

/**
 * Maps PermissionDeniedReason enum to PERMISSION_DENIED_MESSAGES keys
 */
const REASON_TO_MESSAGE_KEY: Record<
  PermissionDeniedReason,
  keyof typeof PERMISSION_DENIED_MESSAGES
> = {
  [PermissionDeniedReason.BOT_DISABLED]: "botDisabled",
  [PermissionDeniedReason.CHANNEL_NOT_ALLOWED]: "channelNotAllowed",
  [PermissionDeniedReason.COMMAND_DISABLED]: "commandDisabled",
  [PermissionDeniedReason.USER_DENIED]: "userDenied",
  [PermissionDeniedReason.ROLE_DENIED]: "roleDenied",
  [PermissionDeniedReason.NO_ALLOWED_ROLE]: "noAllowedRole",
  [PermissionDeniedReason.RATE_LIMITED]: "rateLimited",
  [PermissionDeniedReason.NOT_IN_GUILD]: "notInGuild",
  [PermissionDeniedReason.GLOBAL_USER_DENIED]: "globalUserDenied",
};

/**
 * Gets a user-friendly error message for a permission denial.
 * Uses centralized localization from locales.ts.
 *
 * @param result - The permission check result
 * @param locale - The user's locale for localization
 */
export function getPermissionDeniedMessageForResult(
  result: PermissionCheckResult,
  locale: Locale | string = Locale.EnglishUS,
): string {
  if (result.allowed) {
    return "";
  }

  // Special handling for rate limit with retry time
  if (
    result.reason === PermissionDeniedReason.RATE_LIMITED &&
    result.retryAfter
  ) {
    return getLocalizedPermissionMessage("rateLimitedWithTime", locale, {
      seconds: String(result.retryAfter),
    });
  }

  // Get localized message for the reason
  if (result.reason) {
    const messageKey = REASON_TO_MESSAGE_KEY[result.reason];
    if (messageKey) {
      return getLocalizedPermissionMessage(messageKey, locale);
    }
  }

  // Fallback to default denied message
  return getLocalizedPermissionMessage("defaultDenied", locale);
}

/**
 * Quick check to see if all basic permissions pass (without rate limit consumption).
 * Useful for pre-checks before expensive operations.
 */
export function quickPermissionCheck(
  guildId: string | null,
  channel: PermissionCheckChannel | null,
  member: GuildMember | APIInteractionGuildMember | null,
  commandName: string,
): boolean {
  const result = checkPermissions(guildId, channel, member, commandName, false);
  return result.allowed;
}
