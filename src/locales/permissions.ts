/**
 * Permission Denied Localizations
 * Messages shown when users lack permission to use commands
 */

import { Locale } from "discord.js";

// =============================================================================
// Permission Denied Messages
// =============================================================================

export const PERMISSION_DENIED_MESSAGES = {
  botDisabled: {
    [Locale.EnglishUS]: "❌ The bot is currently disabled in this server.",
    [Locale.EnglishGB]: "❌ The bot is currently disabled in this server.",
    [Locale.ChineseTW]: "❌ 機器人目前在此伺服器中已停用。",
    [Locale.ChineseCN]: "❌ 机器人目前在此服务器中已禁用。",
    [Locale.Japanese]: "❌ このサーバーではボットが無効になっています。",
  },
  channelNotAllowed: {
    [Locale.EnglishUS]: "❌ This command is not allowed in this channel.",
    [Locale.EnglishGB]: "❌ This command is not allowed in this channel.",
    [Locale.ChineseTW]: "❌ 此頻道不允許使用此指令。",
    [Locale.ChineseCN]: "❌ 此频道不允许使用此命令。",
    [Locale.Japanese]:
      "❌ このチャンネルではこのコマンドは許可されていません。",
  },
  commandDisabled: {
    [Locale.EnglishUS]: "❌ This command is disabled in this server.",
    [Locale.EnglishGB]: "❌ This command is disabled in this server.",
    [Locale.ChineseTW]: "❌ 此指令在此伺服器中已停用。",
    [Locale.ChineseCN]: "❌ 此命令在此服务器中已禁用。",
    [Locale.Japanese]: "❌ このコマンドはこのサーバーで無効になっています。",
  },
  userDenied: {
    [Locale.EnglishUS]: "❌ You don't have permission to use this command.",
    [Locale.EnglishGB]: "❌ You don't have permission to use this command.",
    [Locale.ChineseTW]: "❌ 您沒有權限使用此指令。",
    [Locale.ChineseCN]: "❌ 您没有权限使用此命令。",
    [Locale.Japanese]: "❌ このコマンドを使用する権限がありません。",
  },
  roleDenied: {
    [Locale.EnglishUS]: "❌ Your role is not allowed to use this command.",
    [Locale.EnglishGB]: "❌ Your role is not allowed to use this command.",
    [Locale.ChineseTW]: "❌ 您的身分組無權使用此指令。",
    [Locale.ChineseCN]: "❌ 您的角色无权使用此命令。",
    [Locale.Japanese]:
      "❌ あなたのロールにはこのコマンドを使用する権限がありません。",
  },
  noAllowedRole: {
    [Locale.EnglishUS]: "❌ You need a specific role to use this command.",
    [Locale.EnglishGB]: "❌ You need a specific role to use this command.",
    [Locale.ChineseTW]: "❌ 您需要特定身分組才能使用此指令。",
    [Locale.ChineseCN]: "❌ 您需要特定角色才能使用此命令。",
    [Locale.Japanese]: "❌ このコマンドを使用するには特定のロールが必要です。",
  },
  rateLimited: {
    [Locale.EnglishUS]: "⏳ You're being rate limited. Please try again later.",
    [Locale.EnglishGB]: "⏳ You're being rate limited. Please try again later.",
    [Locale.ChineseTW]: "⏳ 您的操作太頻繁了。請稍後再試。",
    [Locale.ChineseCN]: "⏳ 您的操作太频繁了。请稍后再试。",
    [Locale.Japanese]:
      "⏳ レート制限中です。しばらくしてからもう一度お試しください。",
  },
  rateLimitedWithTime: {
    [Locale.EnglishUS]:
      "⏳ You're being rate limited. Please try again in {seconds} seconds.",
    [Locale.EnglishGB]:
      "⏳ You're being rate limited. Please try again in {seconds} seconds.",
    [Locale.ChineseTW]: "⏳ 您的操作太頻繁了。請在 {seconds} 秒後再試。",
    [Locale.ChineseCN]: "⏳ 您的操作太频繁了。请在 {seconds} 秒后再试。",
    [Locale.Japanese]:
      "⏳ レート制限中です。{seconds} 秒後にもう一度お試しください。",
  },
  notInGuild: {
    [Locale.EnglishUS]: "❌ This command can only be used in a server.",
    [Locale.EnglishGB]: "❌ This command can only be used in a server.",
    [Locale.ChineseTW]: "❌ 此指令只能在伺服器中使用。",
    [Locale.ChineseCN]: "❌ 此命令只能在服务器中使用。",
    [Locale.Japanese]: "❌ このコマンドはサーバー内でのみ使用できます。",
  },
  globalUserDenied: {
    [Locale.EnglishUS]: "❌ You don't have permission to use this bot.",
    [Locale.EnglishGB]: "❌ You don't have permission to use this bot.",
    [Locale.ChineseTW]: "❌ 您沒有權限使用此機器人。",
    [Locale.ChineseCN]: "❌ 您没有权限使用此机器人。",
    [Locale.Japanese]: "❌ このボットを使用する権限がありません。",
  },
  defaultDenied: {
    [Locale.EnglishUS]: "❌ You don't have permission to use this command.",
    [Locale.EnglishGB]: "❌ You don't have permission to use this command.",
    [Locale.ChineseTW]: "❌ 您沒有權限使用此指令。",
    [Locale.ChineseCN]: "❌ 您没有权限使用此命令。",
    [Locale.Japanese]: "❌ このコマンドを使用する権限がありません。",
  },
} as const;

/**
 * Get a localized permission denied message
 */
export function getPermissionDeniedMessage(
  key: keyof typeof PERMISSION_DENIED_MESSAGES,
  locale: Locale | string,
  replacements?: Record<string, string>,
): string {
  const messages = PERMISSION_DENIED_MESSAGES[key];
  let message: string =
    (messages[locale as keyof typeof messages] as string) ||
    (messages[Locale.EnglishUS] as string) ||
    "";

  if (replacements) {
    for (const [placeholder, value] of Object.entries(replacements)) {
      message = message.replace(new RegExp(`\\{${placeholder}\\}`, "g"), value);
    }
  }

  return message;
}
