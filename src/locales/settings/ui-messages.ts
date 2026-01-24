/**
 * Settings UI Messages
 * Contains localized messages for settings UI panels and dialogs
 */

import { Locale, LocalizationMap } from "discord.js";

/**
 * Settings UI message content
 */
export const SETTINGS_UI_MESSAGES = {
  // Dashboard
  dashboardTitle: {
    [Locale.EnglishUS]: "⚙️ Server Settings",
    [Locale.EnglishGB]: "⚙️ Server Settings",
    [Locale.ChineseTW]: "⚙️ 伺服器設定",
    [Locale.ChineseCN]: "⚙️ 服务器设置",
    [Locale.Japanese]: "⚙️ サーバー設定",
  } as LocalizationMap,
  dashboardDescription: {
    [Locale.EnglishUS]:
      "Configure bot settings for this server. Select a category below.",
    [Locale.EnglishGB]:
      "Configure bot settings for this server. Select a category below.",
    [Locale.ChineseTW]: "設定此伺服器的機器人設定。請選擇下方的類別。",
    [Locale.ChineseCN]: "配置此服务器的机器人设置。请选择下方的类别。",
    [Locale.Japanese]:
      "このサーバーのボット設定を構成します。以下のカテゴリを選択してください。",
  } as LocalizationMap,

  // General Bot Settings panel
  generalTitle: {
    [Locale.EnglishUS]: "🤖 General Bot Settings",
    [Locale.EnglishGB]: "🤖 General Bot Settings",
    [Locale.ChineseTW]: "🤖 一般機器人設定",
    [Locale.ChineseCN]: "🤖 常规机器人设置",
    [Locale.Japanese]: "🤖 一般ボット設定",
  } as LocalizationMap,
  generalDescription: {
    [Locale.EnglishUS]:
      "Enable or disable the bot, and set the language for public messages.\n\n*Response Language only affects public replies, not private responses.*",
    [Locale.EnglishGB]:
      "Enable or disable the bot, and set the language for public messages.\n\n*Response Language only affects public replies, not private responses.*",
    [Locale.ChineseTW]:
      "啟用或停用機器人，並設定公開訊息的語言。\n\n*回應語言僅影響公開回覆，不影響私人訊息。*",
    [Locale.ChineseCN]:
      "启用或禁用机器人，并设置公开消息的语言。\n\n*回复语言仅影响公开回复，不影响私人消息。*",
    [Locale.Japanese]:
      "ボットの有効化/無効化と、公開メッセージの言語を設定します。\n\n*返信言語は公開返信のみに適用され、プライベート返信には影響しません。*",
  } as LocalizationMap,
  currentStatus: {
    [Locale.EnglishUS]: "Current Status",
    [Locale.EnglishGB]: "Current Status",
    [Locale.ChineseTW]: "目前狀態",
    [Locale.ChineseCN]: "当前状态",
    [Locale.Japanese]: "現在の状態",
  } as LocalizationMap,
  currentLanguage: {
    [Locale.EnglishUS]: "Response Language",
    [Locale.EnglishGB]: "Response Language",
    [Locale.ChineseTW]: "回應語言",
    [Locale.ChineseCN]: "回复语言",
    [Locale.Japanese]: "返信言語",
  } as LocalizationMap,

  // Default channel settings panel
  defaultChannelTitle: {
    [Locale.EnglishUS]: "Default Channel Settings",
    [Locale.EnglishGB]: "Default Channel Settings",
    [Locale.ChineseTW]: "預設頻道設定",
    [Locale.ChineseCN]: "默认频道设置",
    [Locale.Japanese]: "デフォルトチャンネル設定",
  } as LocalizationMap,
  defaultChannelDescription: {
    [Locale.EnglishUS]:
      "Configure which channels all commands can be used in. Per-command settings can override these.",
    [Locale.EnglishGB]:
      "Configure which channels all commands can be used in. Per-command settings can override these.",
    [Locale.ChineseTW]:
      "設定所有指令可以使用的頻道。個別指令設定可以覆蓋這些設定。",
    [Locale.ChineseCN]:
      "配置所有命令可以使用的频道。单个命令设置可以覆盖这些设置。",
    [Locale.Japanese]:
      "すべてのコマンドが使用できるチャンネルを設定します。コマンドごとの設定で上書きできます。",
  } as LocalizationMap,
  currentMode: {
    [Locale.EnglishUS]: "Current Mode",
    [Locale.EnglishGB]: "Current Mode",
    [Locale.ChineseTW]: "目前模式",
    [Locale.ChineseCN]: "当前模式",
    [Locale.Japanese]: "現在のモード",
  } as LocalizationMap,
  configuredChannels: {
    [Locale.EnglishUS]: "Configured Channels",
    [Locale.EnglishGB]: "Configured Channels",
    [Locale.ChineseTW]: "已設定的頻道",
    [Locale.ChineseCN]: "已配置的频道",
    [Locale.Japanese]: "設定済みチャンネル",
  } as LocalizationMap,
  channelModeAllDesc: {
    [Locale.EnglishUS]: "Bot works in all channels",
    [Locale.EnglishGB]: "Bot works in all channels",
    [Locale.ChineseTW]: "機器人可在所有頻道使用",
    [Locale.ChineseCN]: "机器人可在所有频道使用",
    [Locale.Japanese]: "ボットはすべてのチャンネルで使用可能",
  } as LocalizationMap,
  channelModeWhitelistDesc: {
    [Locale.EnglishUS]: "Bot only works in listed channels",
    [Locale.EnglishGB]: "Bot only works in listed channels",
    [Locale.ChineseTW]: "機器人僅在列出的頻道中使用",
    [Locale.ChineseCN]: "机器人仅在列出的频道中使用",
    [Locale.Japanese]: "ボットはリストされたチャンネルでのみ使用可能",
  } as LocalizationMap,
  channelModeBlacklistDesc: {
    [Locale.EnglishUS]: "Bot is blocked in listed channels",
    [Locale.EnglishGB]: "Bot is blocked in listed channels",
    [Locale.ChineseTW]: "機器人在列出的頻道中被封鎖",
    [Locale.ChineseCN]: "机器人在列出的频道中被屏蔽",
    [Locale.Japanese]: "ボットはリストされたチャンネルでブロック",
  } as LocalizationMap,

  // Default permissions panel
  defaultPermissionsTitle: {
    [Locale.EnglishUS]: "🌸 Default Permissions",
    [Locale.EnglishGB]: "🌸 Default Permissions",
    [Locale.ChineseTW]: "🌸 預設權限",
    [Locale.ChineseCN]: "🌸 默认权限",
    [Locale.Japanese]: "🌸 デフォルト権限",
  } as LocalizationMap,
  defaultPermissionsDescription: {
    [Locale.EnglishUS]:
      "Configure default channel and role permissions. These apply to all commands unless overridden by per-command settings.",
    [Locale.EnglishGB]:
      "Configure default channel and role permissions. These apply to all commands unless overridden by per-command settings.",
    [Locale.ChineseTW]:
      "設定預設的頻道和身分組權限。除非被個別指令設定覆蓋，否則適用於所有指令。",
    [Locale.ChineseCN]:
      "配置默认的频道和角色权限。除非被单个命令设置覆盖，否则适用于所有命令。",
    [Locale.Japanese]:
      "デフォルトのチャンネルとロール権限を設定します。コマンド別設定で上書きされない限り、すべてのコマンドに適用されます。",
  } as LocalizationMap,
  defaultRolesTitle: {
    [Locale.EnglishUS]: "👥 Default Role Restrictions",
    [Locale.EnglishGB]: "👥 Default Role Restrictions",
    [Locale.ChineseTW]: "👥 預設身分組限制",
    [Locale.ChineseCN]: "👥 默认角色限制",
    [Locale.Japanese]: "👥 デフォルトロール制限",
  } as LocalizationMap,
  defaultRolesDescription: {
    [Locale.EnglishUS]:
      "Control which roles can use the bot. Denied roles take priority over allowed roles.",
    [Locale.EnglishGB]:
      "Control which roles can use the bot. Denied roles take priority over allowed roles.",
    [Locale.ChineseTW]:
      "控制哪些身分組可以使用機器人。被拒絕的身分組優先於允許的身分組。",
    [Locale.ChineseCN]:
      "控制哪些角色可以使用机器人。被拒绝的角色优先于允许的角色。",
    [Locale.Japanese]:
      "ボットを使用できるロールを制御します。拒否ロールは許可ロールより優先されます。",
  } as LocalizationMap,

  // Command Permissions panel
  commandPermissionsTitle: {
    [Locale.EnglishUS]: "🔐 Command Permissions",
    [Locale.EnglishGB]: "🔐 Command Permissions",
    [Locale.ChineseTW]: "🔐 指令權限",
    [Locale.ChineseCN]: "🔐 命令权限",
    [Locale.Japanese]: "🔐 コマンド権限",
  } as LocalizationMap,
  commandPermissionsDescription: {
    [Locale.EnglishUS]:
      "Configure default restrictions or customize settings for individual commands.",
    [Locale.EnglishGB]:
      "Configure default restrictions or customize settings for individual commands.",
    [Locale.ChineseTW]: "設定預設限制或自訂個別指令的設定。",
    [Locale.ChineseCN]: "配置默认限制或自定义单个命令的设置。",
    [Locale.Japanese]:
      "デフォルト制限を設定するか、個々のコマンドの設定をカスタマイズします。",
  } as LocalizationMap,
  commandSelectPrompt: {
    [Locale.EnglishUS]: "Per-Command Settings",
    [Locale.EnglishGB]: "Per-Command Settings",
    [Locale.ChineseTW]: "個別指令設定",
    [Locale.ChineseCN]: "单个命令设置",
    [Locale.Japanese]: "コマンド別設定",
  } as LocalizationMap,

  // Per-command permission panel
  commandPermissionTitle: {
    [Locale.EnglishUS]: "🔐 /{command} Permissions",
    [Locale.EnglishGB]: "🔐 /{command} Permissions",
    [Locale.ChineseTW]: "🔐 /{command} 權限",
    [Locale.ChineseCN]: "🔐 /{command} 权限",
    [Locale.Japanese]: "🔐 /{command} 権限",
  } as LocalizationMap,
  commandDetailDescription: {
    [Locale.EnglishUS]:
      "Configure permissions for this command. These settings override default permissions.",
    [Locale.EnglishGB]:
      "Configure permissions for this command. These settings override default permissions.",
    [Locale.ChineseTW]: "設定此指令的權限。這些設定會覆蓋預設權限。",
    [Locale.ChineseCN]: "配置此命令的权限。这些设置会覆盖默认权限。",
    [Locale.Japanese]:
      "このコマンドの権限を設定します。これらの設定はデフォルト権限を上書きします。",
  } as LocalizationMap,
  rolePermissionsTitle: {
    [Locale.EnglishUS]: "👥 /{command} Role Permissions",
    [Locale.EnglishGB]: "👥 /{command} Role Permissions",
    [Locale.ChineseTW]: "👥 /{command} 身分組權限",
    [Locale.ChineseCN]: "👥 /{command} 角色权限",
    [Locale.Japanese]: "👥 /{command} ロール権限",
  } as LocalizationMap,
  commandRolesDescription: {
    [Locale.EnglishUS]:
      "Control which roles can use this command. Denied roles take priority.",
    [Locale.EnglishGB]:
      "Control which roles can use this command. Denied roles take priority.",
    [Locale.ChineseTW]: "控制哪些身分組可以使用此指令。被拒絕的身分組優先。",
    [Locale.ChineseCN]: "控制哪些角色可以使用此命令。被拒绝的角色优先。",
    [Locale.Japanese]:
      "このコマンドを使用できるロールを制御します。拒否ロールが優先されます。",
  } as LocalizationMap,
  channelPermissionsTitle: {
    [Locale.EnglishUS]: "📢 /{command} Channel Permissions",
    [Locale.EnglishGB]: "📢 /{command} Channel Permissions",
    [Locale.ChineseTW]: "📢 /{command} 頻道權限",
    [Locale.ChineseCN]: "📢 /{command} 频道权限",
    [Locale.Japanese]: "📢 /{command} チャンネル権限",
  } as LocalizationMap,
  commandChannelDescription: {
    [Locale.EnglishUS]:
      "Configure which channels this command can be used in. Set to 'Inherit' to use default permissions.",
    [Locale.EnglishGB]:
      "Configure which channels this command can be used in. Set to 'Inherit' to use default permissions.",
    [Locale.ChineseTW]:
      "設定此指令可以使用的頻道。設定為「繼承」以使用預設權限。",
    [Locale.ChineseCN]:
      "配置此命令可以使用的频道。设置为「继承」以使用默认权限。",
    [Locale.Japanese]:
      "このコマンドが使用できるチャンネルを設定します。「継承」に設定するとデフォルト権限を使用します。",
  } as LocalizationMap,

  // Rate Limits panel
  rateLimitsTitle: {
    [Locale.EnglishUS]: "⏱️ Rate Limits",
    [Locale.EnglishGB]: "⏱️ Rate Limits",
    [Locale.ChineseTW]: "⏱️ 速率限制",
    [Locale.ChineseCN]: "⏱️ 速率限制",
    [Locale.Japanese]: "⏱️ レート制限",
  } as LocalizationMap,
  rateLimitsDescription: {
    [Locale.EnglishUS]:
      "Limit how often users can use commands. Set default or per-command limits.",
    [Locale.EnglishGB]:
      "Limit how often users can use commands. Set default or per-command limits.",
    [Locale.ChineseTW]: "限制使用者使用指令的頻率。設定預設或個別指令限制。",
    [Locale.ChineseCN]: "限制用户使用命令的频率。设置默认或单个命令限制。",
    [Locale.Japanese]:
      "ユーザーがコマンドを使用できる頻度を制限します。デフォルトまたはコマンドごとの制限を設定します。",
  } as LocalizationMap,
  currentRateLimits: {
    [Locale.EnglishUS]: "Current Rate Limits",
    [Locale.EnglishGB]: "Current Rate Limits",
    [Locale.ChineseTW]: "目前速率限制",
    [Locale.ChineseCN]: "当前速率限制",
    [Locale.Japanese]: "現在のレート制限",
  } as LocalizationMap,
  rateLimitFormat: {
    [Locale.EnglishUS]: "{uses} uses / {seconds}s",
    [Locale.EnglishGB]: "{uses} uses / {seconds}s",
    [Locale.ChineseTW]: "{uses} 次 / {seconds} 秒",
    [Locale.ChineseCN]: "{uses} 次 / {seconds} 秒",
    [Locale.Japanese]: "{uses} 回 / {seconds} 秒",
  } as LocalizationMap,

  // Confirmation dialogs
  confirmClearChannels: {
    [Locale.EnglishUS]:
      "Are you sure you want to clear all channel settings? This will reset channel mode to 'All Channels'.",
    [Locale.EnglishGB]:
      "Are you sure you want to clear all channel settings? This will reset channel mode to 'All Channels'.",
    [Locale.ChineseTW]:
      "確定要清除所有頻道設定嗎？這將把頻道模式重設為「所有頻道」。",
    [Locale.ChineseCN]:
      "确定要清除所有频道设置吗？这将把频道模式重置为「所有频道」。",
    [Locale.Japanese]:
      "すべてのチャンネル設定をクリアしますか？チャンネルモードが「すべてのチャンネル」にリセットされます。",
  } as LocalizationMap,
  confirmClearRoles: {
    [Locale.EnglishUS]: "Are you sure you want to clear all role permissions?",
    [Locale.EnglishGB]: "Are you sure you want to clear all role permissions?",
    [Locale.ChineseTW]: "確定要清除所有身分組權限嗎？",
    [Locale.ChineseCN]: "确定要清除所有角色权限吗？",
    [Locale.Japanese]: "すべてのロール権限をクリアしますか？",
  } as LocalizationMap,
  confirmResetDefaultPermissions: {
    [Locale.EnglishUS]:
      "Are you sure you want to reset all default permissions? This will clear channels, roles, and reset channel mode.",
    [Locale.EnglishGB]:
      "Are you sure you want to reset all default permissions? This will clear channels, roles, and reset channel mode.",
    [Locale.ChineseTW]:
      "確定要重設所有預設權限嗎？這將清除頻道、身分組並重設頻道模式。",
    [Locale.ChineseCN]:
      "确定要重置所有默认权限吗？这将清除频道、角色并重置频道模式。",
    [Locale.Japanese]:
      "すべてのデフォルト権限をリセットしますか？チャンネル、ロール、チャンネルモードがクリアされます。",
  } as LocalizationMap,
  confirmResetCommand: {
    [Locale.EnglishUS]:
      "Are you sure you want to reset all permissions for this command?",
    [Locale.EnglishGB]:
      "Are you sure you want to reset all permissions for this command?",
    [Locale.ChineseTW]: "確定要重設此指令的所有權限嗎？",
    [Locale.ChineseCN]: "确定要重置此命令的所有权限吗？",
    [Locale.Japanese]: "このコマンドのすべての権限をリセットしますか？",
  } as LocalizationMap,
  confirmClearRateLimits: {
    [Locale.EnglishUS]:
      "Are you sure you want to clear all rate limits? Commands will become unlimited.",
    [Locale.EnglishGB]:
      "Are you sure you want to clear all rate limits? Commands will become unlimited.",
    [Locale.ChineseTW]: "確定要清除所有速率限制嗎？指令將變為無限制。",
    [Locale.ChineseCN]: "确定要清除所有速率限制吗？命令将变为无限制。",
    [Locale.Japanese]:
      "すべてのレート制限をクリアしますか？コマンドは無制限になります。",
  } as LocalizationMap,

  // Error messages
  invalidInput: {
    [Locale.EnglishUS]:
      "Invalid input. Please enter valid numbers (uses: 1-100, seconds: 1-3600).",
    [Locale.EnglishGB]:
      "Invalid input. Please enter valid numbers (uses: 1-100, seconds: 1-3600).",
    [Locale.ChineseTW]:
      "輸入無效。請輸入有效數字（次數：1-100，秒數：1-3600）。",
    [Locale.ChineseCN]:
      "输入无效。请输入有效数字（次数：1-100，秒数：1-3600）。",
    [Locale.Japanese]:
      "入力が無効です。有効な数字を入力してください（回数：1-100、秒：1-3600）。",
  } as LocalizationMap,
  notYourSession: {
    [Locale.EnglishUS]: "This is not your settings session.",
    [Locale.EnglishGB]: "This is not your settings session.",
    [Locale.ChineseTW]: "這不是您的設定對話。",
    [Locale.ChineseCN]: "这不是您的设置会话。",
    [Locale.Japanese]: "これはあなたの設定セッションではありません。",
  } as LocalizationMap,

  // Reset confirmation messages
  confirmResetGeneralSettings: {
    [Locale.EnglishUS]:
      "Are you sure you want to reset general settings? Bot will be enabled and response language will be set to auto.",
    [Locale.EnglishGB]:
      "Are you sure you want to reset general settings? Bot will be enabled and response language will be set to auto.",
    [Locale.ChineseTW]:
      "確定要重設一般設定嗎？機器人將被啟用，回應語言將設為自動。",
    [Locale.ChineseCN]:
      "确定要重置常规设置吗？机器人将被启用，回复语言将设为自动。",
    [Locale.Japanese]:
      "一般設定をリセットしますか？ボットが有効になり、返信言語が自動に設定されます。",
  } as LocalizationMap,
  confirmResetAllCommandPermissions: {
    [Locale.EnglishUS]:
      "Are you sure you want to reset ALL command permissions? This includes default and per-command settings.",
    [Locale.EnglishGB]:
      "Are you sure you want to reset ALL command permissions? This includes default and per-command settings.",
    [Locale.ChineseTW]: "確定要重設所有指令權限嗎？這包括預設和個別指令設定。",
    [Locale.ChineseCN]: "确定要重置所有命令权限吗？这包括默认和单个命令设置。",
    [Locale.Japanese]:
      "すべてのコマンド権限をリセットしますか？デフォルト設定とコマンドごとの設定が含まれます。",
  } as LocalizationMap,
  confirmFactoryReset: {
    [Locale.EnglishUS]:
      "⚠️ **Factory Reset**\n\nThis will delete ALL settings for this server, including:\n• General settings\n• All permissions\n• Rate limits\n\nThis action cannot be undone!",
    [Locale.EnglishGB]:
      "⚠️ **Factory Reset**\n\nThis will delete ALL settings for this server, including:\n• General settings\n• All permissions\n• Rate limits\n\nThis action cannot be undone!",
    [Locale.ChineseTW]:
      "⚠️ **恢復原廠設定**\n\n這將刪除此伺服器的所有設定，包括：\n• 一般設定\n• 所有權限\n• 速率限制\n\n此操作無法復原！",
    [Locale.ChineseCN]:
      "⚠️ **恢复出厂设置**\n\n这将删除此服务器的所有设置，包括：\n• 常规设置\n• 所有权限\n• 速率限制\n\n此操作无法撤销！",
    [Locale.Japanese]:
      "⚠️ **工場出荷時リセット**\n\nこのサーバーのすべての設定が削除されます：\n• 一般設定\n• すべての権限\n• レート制限\n\nこの操作は元に戻せません！",
  } as LocalizationMap,
} as const;

/**
 * Get a localized UI message with optional placeholder replacement
 */
export function getSettingsUIMessage(
  key: keyof typeof SETTINGS_UI_MESSAGES,
  locale: Locale | string,
  replacements?: Record<string, string>,
): string {
  const messages = SETTINGS_UI_MESSAGES[key];
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
