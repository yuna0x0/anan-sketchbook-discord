/**
 * Settings Response Messages
 * Contains localized messages for settings command responses
 */

import { Locale } from "discord.js";

/**
 * Settings response messages
 */
export const SETTINGS_MESSAGES = {
  // Permission errors
  noPermission: {
    [Locale.EnglishUS]:
      "You need Administrator or Manage Server permissions to use this command.",
    [Locale.EnglishGB]:
      "You need Administrator or Manage Server permissions to use this command.",
    [Locale.ChineseTW]: "您需要管理員或管理伺服器權限才能使用此指令。",
    [Locale.ChineseCN]: "您需要管理员或管理服务器权限才能使用此命令。",
    [Locale.Japanese]:
      "このコマンドを使用するには、管理者またはサーバー管理権限が必要です。",
  },
  guildOnly: {
    [Locale.EnglishUS]: "This command can only be used in a server.",
    [Locale.EnglishGB]: "This command can only be used in a server.",
    [Locale.ChineseTW]: "此指令只能在伺服器中使用。",
    [Locale.ChineseCN]: "此命令只能在服务器中使用。",
    [Locale.Japanese]: "このコマンドはサーバー内でのみ使用できます。",
  },

  // Rate limits
  noRateLimitsConfigured: {
    [Locale.EnglishUS]: "No rate limits configured (unlimited).",
    [Locale.EnglishGB]: "No rate limits configured (unlimited).",
    [Locale.ChineseTW]: "未設定速率限制（無限制）。",
    [Locale.ChineseCN]: "未配置速率限制（无限制）。",
    [Locale.Japanese]: "レート制限は設定されていません（無制限）。",
  },

  // View embed
  embedBotStatus: {
    [Locale.EnglishUS]: "Bot Status",
    [Locale.EnglishGB]: "Bot Status",
    [Locale.ChineseTW]: "機器人狀態",
    [Locale.ChineseCN]: "机器人状态",
    [Locale.Japanese]: "ボットステータス",
  },
  embedBotLanguage: {
    [Locale.EnglishUS]: "Response Language",
    [Locale.EnglishGB]: "Response Language",
    [Locale.ChineseTW]: "回應語言",
    [Locale.ChineseCN]: "回复语言",
    [Locale.Japanese]: "応答言語",
  },
  embedCommandPermissions: {
    [Locale.EnglishUS]: "Command Permissions",
    [Locale.EnglishGB]: "Command Permissions",
    [Locale.ChineseTW]: "指令權限",
    [Locale.ChineseCN]: "命令权限",
    [Locale.Japanese]: "コマンド権限",
  },
  embedRateLimits: {
    [Locale.EnglishUS]: "Rate Limits",
    [Locale.EnglishGB]: "Rate Limits",
    [Locale.ChineseTW]: "速率限制",
    [Locale.ChineseCN]: "速率限制",
    [Locale.Japanese]: "レート制限",
  },
  embedFooter: {
    [Locale.EnglishUS]: "Use the buttons below to navigate settings",
    [Locale.EnglishGB]: "Use the buttons below to navigate settings",
    [Locale.ChineseTW]: "使用下方按鈕瀏覽設定",
    [Locale.ChineseCN]: "使用下方按钮浏览设置",
    [Locale.Japanese]: "下のボタンで設定を操作してください",
  },
  enabled: {
    [Locale.EnglishUS]: "Enabled",
    [Locale.EnglishGB]: "Enabled",
    [Locale.ChineseTW]: "已啟用",
    [Locale.ChineseCN]: "已启用",
    [Locale.Japanese]: "有効",
  },
  disabled: {
    [Locale.EnglishUS]: "Disabled",
    [Locale.EnglishGB]: "Disabled",
    [Locale.ChineseTW]: "已停用",
    [Locale.ChineseCN]: "已禁用",
    [Locale.Japanese]: "無効",
  },
  none: {
    [Locale.EnglishUS]: "None",
    [Locale.EnglishGB]: "None",
    [Locale.ChineseTW]: "無",
    [Locale.ChineseCN]: "无",
    [Locale.Japanese]: "なし",
  },
  auto: {
    [Locale.EnglishUS]: "Auto (user's language)",
    [Locale.EnglishGB]: "Auto (user's language)",
    [Locale.ChineseTW]: "自動（使用者語言）",
    [Locale.ChineseCN]: "自动（用户语言）",
    [Locale.Japanese]: "自動（ユーザー言語）",
  },
  defaultAllEnabled: {
    [Locale.EnglishUS]: "Default (all enabled)",
    [Locale.EnglishGB]: "Default (all enabled)",
    [Locale.ChineseTW]: "預設（全部啟用）",
    [Locale.ChineseCN]: "默认（全部启用）",
    [Locale.Japanese]: "デフォルト（すべて有効）",
  },
  defaultRateLimit: {
    [Locale.EnglishUS]: "No limit (unlimited)",
    [Locale.EnglishGB]: "No limit (unlimited)",
    [Locale.ChineseTW]: "無限制",
    [Locale.ChineseCN]: "无限制",
    [Locale.Japanese]: "制限なし（無制限）",
  },
  global: {
    [Locale.EnglishUS]: "Global",
    [Locale.EnglishGB]: "Global",
    [Locale.ChineseTW]: "全域",
    [Locale.ChineseCN]: "全局",
    [Locale.Japanese]: "グローバル",
  },

  // Command view embed
  status: {
    [Locale.EnglishUS]: "Status",
    [Locale.EnglishGB]: "Status",
    [Locale.ChineseTW]: "狀態",
    [Locale.ChineseCN]: "状态",
    [Locale.Japanese]: "ステータス",
  },
  allowedRoles: {
    [Locale.EnglishUS]: "Allowed Roles",
    [Locale.EnglishGB]: "Allowed Roles",
    [Locale.ChineseTW]: "允許的身分組",
    [Locale.ChineseCN]: "允许的角色",
    [Locale.Japanese]: "許可されたロール",
  },
  deniedRoles: {
    [Locale.EnglishUS]: "Denied Roles",
    [Locale.EnglishGB]: "Denied Roles",
    [Locale.ChineseTW]: "禁止的身分組",
    [Locale.ChineseCN]: "禁止的角色",
    [Locale.Japanese]: "禁止されたロール",
  },
  noneEveryoneAllowed: {
    [Locale.EnglishUS]: "None (everyone allowed)",
    [Locale.EnglishGB]: "None (everyone allowed)",
    [Locale.ChineseTW]: "無（允許所有人）",
    [Locale.ChineseCN]: "无（允许所有人）",
    [Locale.Japanese]: "なし（全員許可）",
  },
  rolesConfigured: {
    [Locale.EnglishUS]: "roles",
    [Locale.EnglishGB]: "roles",
    [Locale.ChineseTW]: "個身分組",
    [Locale.ChineseCN]: "个角色",
    [Locale.Japanese]: "ロール",
  },

  // Generic
  error: {
    [Locale.EnglishUS]: "An error occurred while executing this command.",
    [Locale.EnglishGB]: "An error occurred while executing this command.",
    [Locale.ChineseTW]: "執行此指令時發生錯誤。",
    [Locale.ChineseCN]: "执行此命令时发生错误。",
    [Locale.Japanese]: "このコマンドの実行中にエラーが発生しました。",
  },
  unknownSubcommand: {
    [Locale.EnglishUS]: "Unknown subcommand.",
    [Locale.EnglishGB]: "Unknown subcommand.",
    [Locale.ChineseTW]: "未知的子指令。",
    [Locale.ChineseCN]: "未知的子命令。",
    [Locale.Japanese]: "不明なサブコマンド。",
  },
} as const;

/**
 * Get a localized settings message with placeholder replacement
 */
export function getSettingsMessage(
  key: keyof typeof SETTINGS_MESSAGES,
  locale: Locale | string,
  replacements?: Record<string, string>,
): string {
  const messages = SETTINGS_MESSAGES[key];
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
