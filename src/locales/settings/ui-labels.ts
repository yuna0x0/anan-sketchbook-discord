/**
 * Settings UI Labels
 * Contains localized labels for settings UI buttons and components
 */

import { Locale, LocalizationMap } from "discord.js";

/**
 * Settings UI button and component labels
 */
export const SETTINGS_UI_LABELS = {
  // Main dashboard buttons
  generalSettings: {
    [Locale.EnglishUS]: "General Bot Settings",
    [Locale.EnglishGB]: "General Bot Settings",
    [Locale.ChineseTW]: "一般機器人設定",
    [Locale.ChineseCN]: "常规机器人设置",
    [Locale.Japanese]: "一般ボット設定",
  } as LocalizationMap,
  commandPermissions: {
    [Locale.EnglishUS]: "Command Permissions",
    [Locale.EnglishGB]: "Command Permissions",
    [Locale.ChineseTW]: "指令權限",
    [Locale.ChineseCN]: "命令权限",
    [Locale.Japanese]: "コマンド権限",
  } as LocalizationMap,
  rateLimits: {
    [Locale.EnglishUS]: "Rate Limits",
    [Locale.EnglishGB]: "Rate Limits",
    [Locale.ChineseTW]: "速率限制",
    [Locale.ChineseCN]: "速率限制",
    [Locale.Japanese]: "レート制限",
  } as LocalizationMap,
  backButton: {
    [Locale.EnglishUS]: "Back",
    [Locale.EnglishGB]: "Back",
    [Locale.ChineseTW]: "返回",
    [Locale.ChineseCN]: "返回",
    [Locale.Japanese]: "戻る",
  } as LocalizationMap,

  // General settings
  enableBot: {
    [Locale.EnglishUS]: "Enable Bot",
    [Locale.EnglishGB]: "Enable Bot",
    [Locale.ChineseTW]: "啟用機器人",
    [Locale.ChineseCN]: "启用机器人",
    [Locale.Japanese]: "ボットを有効化",
  } as LocalizationMap,
  disableBot: {
    [Locale.EnglishUS]: "Disable Bot",
    [Locale.EnglishGB]: "Disable Bot",
    [Locale.ChineseTW]: "停用機器人",
    [Locale.ChineseCN]: "禁用机器人",
    [Locale.Japanese]: "ボットを無効化",
  } as LocalizationMap,
  selectLanguage: {
    [Locale.EnglishUS]: "Select response language...",
    [Locale.EnglishGB]: "Select response language...",
    [Locale.ChineseTW]: "選擇回應語言...",
    [Locale.ChineseCN]: "选择回复语言...",
    [Locale.Japanese]: "応答言語を選択...",
  } as LocalizationMap,

  // Channel settings
  selectChannelMode: {
    [Locale.EnglishUS]: "Select channel mode...",
    [Locale.EnglishGB]: "Select channel mode...",
    [Locale.ChineseTW]: "選擇頻道模式...",
    [Locale.ChineseCN]: "选择频道模式...",
    [Locale.Japanese]: "チャンネルモードを選択...",
  } as LocalizationMap,
  selectChannelToAdd: {
    [Locale.EnglishUS]: "Select channel to add...",
    [Locale.EnglishGB]: "Select channel to add...",
    [Locale.ChineseTW]: "選擇要新增的頻道...",
    [Locale.ChineseCN]: "选择要添加的频道...",
    [Locale.Japanese]: "追加するチャンネルを選択...",
  } as LocalizationMap,
  selectChannelToRemove: {
    [Locale.EnglishUS]: "Select channel to remove...",
    [Locale.EnglishGB]: "Select channel to remove...",
    [Locale.ChineseTW]: "選擇要移除的頻道...",
    [Locale.ChineseCN]: "选择要移除的频道...",
    [Locale.Japanese]: "削除するチャンネルを選択...",
  } as LocalizationMap,
  clearAllChannels: {
    [Locale.EnglishUS]: "Clear All",
    [Locale.EnglishGB]: "Clear All",
    [Locale.ChineseTW]: "全部清除",
    [Locale.ChineseCN]: "全部清除",
    [Locale.Japanese]: "すべてクリア",
  } as LocalizationMap,
  clearAllRoles: {
    [Locale.EnglishUS]: "Clear All",
    [Locale.EnglishGB]: "Clear All",
    [Locale.ChineseTW]: "全部清除",
    [Locale.ChineseCN]: "全部清除",
    [Locale.Japanese]: "すべてクリア",
  } as LocalizationMap,

  // Command permissions
  selectCommand: {
    [Locale.EnglishUS]: "Select a command...",
    [Locale.EnglishGB]: "Select a command...",
    [Locale.ChineseTW]: "選擇指令...",
    [Locale.ChineseCN]: "选择命令...",
    [Locale.Japanese]: "コマンドを選択...",
  } as LocalizationMap,
  enableCommand: {
    [Locale.EnglishUS]: "Enable",
    [Locale.EnglishGB]: "Enable",
    [Locale.ChineseTW]: "啟用",
    [Locale.ChineseCN]: "启用",
    [Locale.Japanese]: "有効化",
  } as LocalizationMap,
  disableCommand: {
    [Locale.EnglishUS]: "Disable",
    [Locale.EnglishGB]: "Disable",
    [Locale.ChineseTW]: "停用",
    [Locale.ChineseCN]: "禁用",
    [Locale.Japanese]: "無効化",
  } as LocalizationMap,
  manageRoles: {
    [Locale.EnglishUS]: "Manage Roles",
    [Locale.EnglishGB]: "Manage Roles",
    [Locale.ChineseTW]: "管理身分組",
    [Locale.ChineseCN]: "管理角色",
    [Locale.Japanese]: "ロール管理",
  } as LocalizationMap,
  manageChannels: {
    [Locale.EnglishUS]: "Manage Channels",
    [Locale.EnglishGB]: "Manage Channels",
    [Locale.ChineseTW]: "管理頻道",
    [Locale.ChineseCN]: "管理频道",
    [Locale.Japanese]: "チャンネル管理",
  } as LocalizationMap,

  // Default permissions
  defaultPermissions: {
    [Locale.EnglishUS]: "Default Permissions",
    [Locale.EnglishGB]: "Default Permissions",
    [Locale.ChineseTW]: "預設權限",
    [Locale.ChineseCN]: "默认权限",
    [Locale.Japanese]: "デフォルト権限",
  } as LocalizationMap,
  defaultPermissionsDesc: {
    [Locale.EnglishUS]: "Channel & role permissions for all commands",
    [Locale.EnglishGB]: "Channel & role permissions for all commands",
    [Locale.ChineseTW]: "所有指令的頻道與身分組權限",
    [Locale.ChineseCN]: "所有命令的频道与角色权限",
    [Locale.Japanese]: "すべてのコマンドのチャンネル・ロール権限",
  } as LocalizationMap,
  perCommandSettings: {
    [Locale.EnglishUS]: "Per-Command Settings",
    [Locale.EnglishGB]: "Per-Command Settings",
    [Locale.ChineseTW]: "個別指令設定",
    [Locale.ChineseCN]: "单个命令设置",
    [Locale.Japanese]: "コマンド別設定",
  } as LocalizationMap,
  perCommandSettingsDesc: {
    [Locale.EnglishUS]: "Configure permissions for this command",
    [Locale.EnglishGB]: "Configure permissions for this command",
    [Locale.ChineseTW]: "設定此指令的權限",
    [Locale.ChineseCN]: "配置此命令的权限",
    [Locale.Japanese]: "このコマンドの権限を設定",
  } as LocalizationMap,
  channelsConfigured: {
    [Locale.EnglishUS]: "channels configured",
    [Locale.EnglishGB]: "channels configured",
    [Locale.ChineseTW]: "個頻道已設定",
    [Locale.ChineseCN]: "个频道已配置",
    [Locale.Japanese]: "チャンネル設定済み",
  } as LocalizationMap,
  resetPermissions: {
    [Locale.EnglishUS]: "Reset All",
    [Locale.EnglishGB]: "Reset All",
    [Locale.ChineseTW]: "重設全部",
    [Locale.ChineseCN]: "重置全部",
    [Locale.Japanese]: "すべてリセット",
  } as LocalizationMap,
  selectRoleToAllow: {
    [Locale.EnglishUS]: "Select role to allow...",
    [Locale.EnglishGB]: "Select role to allow...",
    [Locale.ChineseTW]: "選擇要允許的角色...",
    [Locale.ChineseCN]: "选择要允许的角色...",
    [Locale.Japanese]: "許可するロールを選択...",
  } as LocalizationMap,
  selectRoleToDeny: {
    [Locale.EnglishUS]: "Select role to deny...",
    [Locale.EnglishGB]: "Select role to deny...",
    [Locale.ChineseTW]: "選擇要拒絕的角色...",
    [Locale.ChineseCN]: "选择要拒绝的角色...",
    [Locale.Japanese]: "拒否するロールを選択...",
  } as LocalizationMap,
  selectRoleToRemove: {
    [Locale.EnglishUS]: "Select role to remove...",
    [Locale.EnglishGB]: "Select role to remove...",
    [Locale.ChineseTW]: "選擇要移除的角色...",
    [Locale.ChineseCN]: "选择要移除的角色...",
    [Locale.Japanese]: "削除するロールを選択...",
  } as LocalizationMap,

  // Rate limits
  removeRateLimit: {
    [Locale.EnglishUS]: "Select rate limit to remove...",
    [Locale.EnglishGB]: "Select rate limit to remove...",
    [Locale.ChineseTW]: "選擇要移除的速率限制...",
    [Locale.ChineseCN]: "选择要移除的速率限制...",
    [Locale.Japanese]: "削除するレート制限を選択...",
  } as LocalizationMap,
  defaultRateLimit: {
    [Locale.EnglishUS]: "Default Rate Limit",
    [Locale.EnglishGB]: "Default Rate Limit",
    [Locale.ChineseTW]: "預設速率限制",
    [Locale.ChineseCN]: "默认速率限制",
    [Locale.Japanese]: "デフォルトレート制限",
  } as LocalizationMap,
  selectRateLimitTarget: {
    [Locale.EnglishUS]: "Select target to set rate limit...",
    [Locale.EnglishGB]: "Select target to set rate limit...",
    [Locale.ChineseTW]: "選擇要設定速率限制的目標...",
    [Locale.ChineseCN]: "选择要设置速率限制的目标...",
    [Locale.Japanese]: "レート制限を設定する対象を選択...",
  } as LocalizationMap,
  clearAllRateLimits: {
    [Locale.EnglishUS]: "Clear All",
    [Locale.EnglishGB]: "Clear All",
    [Locale.ChineseTW]: "全部清除",
    [Locale.ChineseCN]: "全部清除",
    [Locale.Japanese]: "すべてクリア",
  } as LocalizationMap,

  // Rate limit modal
  rateLimitModalTitle: {
    [Locale.EnglishUS]: "Set Rate Limit",
    [Locale.EnglishGB]: "Set Rate Limit",
    [Locale.ChineseTW]: "設定速率限制",
    [Locale.ChineseCN]: "设置速率限制",
    [Locale.Japanese]: "レート制限を設定",
  } as LocalizationMap,
  usesLabel: {
    [Locale.EnglishUS]: "uses",
    [Locale.EnglishGB]: "uses",
    [Locale.ChineseTW]: "次",
    [Locale.ChineseCN]: "次",
    [Locale.Japanese]: "回",
  } as LocalizationMap,
  usesPlaceholder: {
    [Locale.EnglishUS]: "Number of uses (e.g., 5)",
    [Locale.EnglishGB]: "Number of uses (e.g., 5)",
    [Locale.ChineseTW]: "使用次數（例如：5）",
    [Locale.ChineseCN]: "使用次数（例如：5）",
    [Locale.Japanese]: "使用回数（例：5）",
  } as LocalizationMap,
  secondsLabel: {
    [Locale.EnglishUS]: "Window (seconds)",
    [Locale.EnglishGB]: "Window (seconds)",
    [Locale.ChineseTW]: "時間窗口（秒）",
    [Locale.ChineseCN]: "时间窗口（秒）",
    [Locale.Japanese]: "ウィンドウ（秒）",
  } as LocalizationMap,
  secondsPlaceholder: {
    [Locale.EnglishUS]: "Time window in seconds (e.g., 60)",
    [Locale.EnglishGB]: "Time window in seconds (e.g., 60)",
    [Locale.ChineseTW]: "時間窗口秒數（例如：60）",
    [Locale.ChineseCN]: "时间窗口秒数（例如：60）",
    [Locale.Japanese]: "秒単位の時間ウィンドウ（例：60）",
  } as LocalizationMap,

  // Confirmation buttons
  confirmClear: {
    [Locale.EnglishUS]: "Yes, Clear All",
    [Locale.EnglishGB]: "Yes, Clear All",
    [Locale.ChineseTW]: "是，全部清除",
    [Locale.ChineseCN]: "是，全部清除",
    [Locale.Japanese]: "はい、すべてクリア",
  } as LocalizationMap,
  confirmReset: {
    [Locale.EnglishUS]: "Yes, Reset",
    [Locale.EnglishGB]: "Yes, Reset",
    [Locale.ChineseTW]: "是，重設",
    [Locale.ChineseCN]: "是，重置",
    [Locale.Japanese]: "はい、リセット",
  } as LocalizationMap,
  cancel: {
    [Locale.EnglishUS]: "Cancel",
    [Locale.EnglishGB]: "Cancel",
    [Locale.ChineseTW]: "取消",
    [Locale.ChineseCN]: "取消",
    [Locale.Japanese]: "キャンセル",
  } as LocalizationMap,

  // Language selection
  languageAutoLabel: {
    [Locale.EnglishUS]: "Auto (User's Language)",
    [Locale.EnglishGB]: "Auto (User's Language)",
    [Locale.ChineseTW]: "自動（使用者語言）",
    [Locale.ChineseCN]: "自动（用户语言）",
    [Locale.Japanese]: "自動（ユーザーの言語）",
  } as LocalizationMap,
  languageAutoDescription: {
    [Locale.EnglishUS]: "Use each user's Discord language setting",
    [Locale.EnglishGB]: "Use each user's Discord language setting",
    [Locale.ChineseTW]: "使用每位使用者的 Discord 語言設定",
    [Locale.ChineseCN]: "使用每位用户的 Discord 语言设置",
    [Locale.Japanese]: "各ユーザーのDiscord言語設定を使用",
  } as LocalizationMap,

  // Channel mode options
  channelModeInherit: {
    [Locale.EnglishUS]: "Inherit Default",
    [Locale.EnglishGB]: "Inherit Default",
    [Locale.ChineseTW]: "繼承預設",
    [Locale.ChineseCN]: "继承默认",
    [Locale.Japanese]: "デフォルトを継承",
  } as LocalizationMap,
  channelModeAll: {
    [Locale.EnglishUS]: "All Channels",
    [Locale.EnglishGB]: "All Channels",
    [Locale.ChineseTW]: "所有頻道",
    [Locale.ChineseCN]: "所有频道",
    [Locale.Japanese]: "すべてのチャンネル",
  } as LocalizationMap,
  channelModeWhitelist: {
    [Locale.EnglishUS]: "Whitelist",
    [Locale.EnglishGB]: "Whitelist",
    [Locale.ChineseTW]: "白名單",
    [Locale.ChineseCN]: "白名单",
    [Locale.Japanese]: "ホワイトリスト",
  } as LocalizationMap,
  channelModeBlacklist: {
    [Locale.EnglishUS]: "Blacklist",
    [Locale.EnglishGB]: "Blacklist",
    [Locale.ChineseTW]: "黑名單",
    [Locale.ChineseCN]: "黑名单",
    [Locale.Japanese]: "ブラックリスト",
  } as LocalizationMap,
  channelModeInheritDesc: {
    [Locale.EnglishUS]: "Use default permissions",
    [Locale.EnglishGB]: "Use default permissions",
    [Locale.ChineseTW]: "使用預設權限",
    [Locale.ChineseCN]: "使用默认权限",
    [Locale.Japanese]: "デフォルト権限を使用",
  } as LocalizationMap,
  channelModeAllDesc: {
    [Locale.EnglishUS]: "Allow in all channels",
    [Locale.EnglishGB]: "Allow in all channels",
    [Locale.ChineseTW]: "允許在所有頻道",
    [Locale.ChineseCN]: "允许在所有频道",
    [Locale.Japanese]: "すべてのチャンネルで許可",
  } as LocalizationMap,
  channelModeWhitelistDesc: {
    [Locale.EnglishUS]: "Only allow in listed channels",
    [Locale.EnglishGB]: "Only allow in listed channels",
    [Locale.ChineseTW]: "僅允許在列出的頻道",
    [Locale.ChineseCN]: "仅允许在列出的频道",
    [Locale.Japanese]: "リストされたチャンネルのみ許可",
  } as LocalizationMap,
  channelModeBlacklistDesc: {
    [Locale.EnglishUS]: "Block in listed channels",
    [Locale.EnglishGB]: "Block in listed channels",
    [Locale.ChineseTW]: "在列出的頻道中封鎖",
    [Locale.ChineseCN]: "在列出的频道中屏蔽",
    [Locale.Japanese]: "リストされたチャンネルでブロック",
  } as LocalizationMap,
  channelModeLabel: {
    [Locale.EnglishUS]: "Channel Mode",
    [Locale.EnglishGB]: "Channel Mode",
    [Locale.ChineseTW]: "頻道模式",
    [Locale.ChineseCN]: "频道模式",
    [Locale.Japanese]: "チャンネルモード",
  } as LocalizationMap,
  channelSettingsLabel: {
    [Locale.EnglishUS]: "Channel Settings",
    [Locale.EnglishGB]: "Channel Settings",
    [Locale.ChineseTW]: "頻道設定",
    [Locale.ChineseCN]: "频道设置",
    [Locale.Japanese]: "チャンネル設定",
  } as LocalizationMap,
  allowedChannelsLabel: {
    [Locale.EnglishUS]: "Allowed Channels",
    [Locale.EnglishGB]: "Allowed Channels",
    [Locale.ChineseTW]: "允許的頻道",
    [Locale.ChineseCN]: "允许的频道",
    [Locale.Japanese]: "許可されたチャンネル",
  } as LocalizationMap,
  deniedChannelsLabel: {
    [Locale.EnglishUS]: "Blocked Channels",
    [Locale.EnglishGB]: "Blocked Channels",
    [Locale.ChineseTW]: "封鎖的頻道",
    [Locale.ChineseCN]: "屏蔽的频道",
    [Locale.Japanese]: "ブロックされたチャンネル",
  } as LocalizationMap,
  channelListLabel: {
    [Locale.EnglishUS]: "Channel List",
    [Locale.EnglishGB]: "Channel List",
    [Locale.ChineseTW]: "頻道清單",
    [Locale.ChineseCN]: "频道列表",
    [Locale.Japanese]: "チャンネルリスト",
  } as LocalizationMap,
  selectChannelToAllow: {
    [Locale.EnglishUS]: "Select channel to allow...",
    [Locale.EnglishGB]: "Select channel to allow...",
    [Locale.ChineseTW]: "選擇要允許的頻道...",
    [Locale.ChineseCN]: "选择要允许的频道...",
    [Locale.Japanese]: "許可するチャンネルを選択...",
  } as LocalizationMap,
  selectChannelToDeny: {
    [Locale.EnglishUS]: "Select channel to block...",
    [Locale.EnglishGB]: "Select channel to block...",
    [Locale.ChineseTW]: "選擇要封鎖的頻道...",
    [Locale.ChineseCN]: "选择要屏蔽的频道...",
    [Locale.Japanese]: "ブロックするチャンネルを選択...",
  } as LocalizationMap,
  allowedLabel: {
    [Locale.EnglishUS]: "Allowed",
    [Locale.EnglishGB]: "Allowed",
    [Locale.ChineseTW]: "允許",
    [Locale.ChineseCN]: "允许",
    [Locale.Japanese]: "許可",
  } as LocalizationMap,
  deniedLabel: {
    [Locale.EnglishUS]: "Denied",
    [Locale.EnglishGB]: "Denied",
    [Locale.ChineseTW]: "拒絕",
    [Locale.ChineseCN]: "拒绝",
    [Locale.Japanese]: "拒否",
  } as LocalizationMap,

  // Apply to all commands
  applyToAllCommands: {
    [Locale.EnglishUS]: "Applies to all commands",
    [Locale.EnglishGB]: "Applies to all commands",
    [Locale.ChineseTW]: "適用於所有指令",
    [Locale.ChineseCN]: "适用于所有命令",
    [Locale.Japanese]: "すべてのコマンドに適用",
  } as LocalizationMap,

  // Thread inheritance
  threadInheritanceNote: {
    [Locale.EnglishUS]: "Thread Inheritance",
    [Locale.EnglishGB]: "Thread Inheritance",
    [Locale.ChineseTW]: "討論串繼承",
    [Locale.ChineseCN]: "帖子继承",
    [Locale.Japanese]: "スレッド継承",
  } as LocalizationMap,
  threadInheritanceDesc: {
    [Locale.EnglishUS]:
      "Threads automatically inherit permissions from their parent channel.",
    [Locale.EnglishGB]:
      "Threads automatically inherit permissions from their parent channel.",
    [Locale.ChineseTW]: "討論串會自動繼承其父頻道的權限。",
    [Locale.ChineseCN]: "帖子会自动继承其父频道的权限。",
    [Locale.Japanese]: "スレッドは親チャンネルの権限を自動的に継承します。",
  } as LocalizationMap,

  // Permission logic explanation
  permissionLogicTitle: {
    [Locale.EnglishUS]: "How Permissions Work",
    [Locale.EnglishGB]: "How Permissions Work",
    [Locale.ChineseTW]: "權限運作方式",
    [Locale.ChineseCN]: "权限工作方式",
    [Locale.Japanese]: "権限の仕組み",
  } as LocalizationMap,
  permissionLogicDesc: {
    [Locale.EnglishUS]:
      "Channels are checked first, then roles. Per-command settings override default settings.",
    [Locale.EnglishGB]:
      "Channels are checked first, then roles. Per-command settings override default settings.",
    [Locale.ChineseTW]:
      "先檢查頻道，再檢查身分組。個別指令設定會覆蓋預設設定。",
    [Locale.ChineseCN]: "先检查频道，再检查角色。单个命令设置会覆盖默认设置。",
    [Locale.Japanese]:
      "チャンネルが先にチェックされ、次にロール。コマンドごとの設定はデフォルト設定を上書きします。",
  } as LocalizationMap,

  // Role settings
  roleSettingsLabel: {
    [Locale.EnglishUS]: "Role Settings",
    [Locale.EnglishGB]: "Role Settings",
    [Locale.ChineseTW]: "身分組設定",
    [Locale.ChineseCN]: "角色设置",
    [Locale.Japanese]: "ロール設定",
  } as LocalizationMap,
  roleLogicTitle: {
    [Locale.EnglishUS]: "Role Permission Logic",
    [Locale.EnglishGB]: "Role Permission Logic",
    [Locale.ChineseTW]: "身分組權限邏輯",
    [Locale.ChineseCN]: "角色权限逻辑",
    [Locale.Japanese]: "ロール権限のロジック",
  } as LocalizationMap,
  roleLogicDesc: {
    [Locale.EnglishUS]:
      "Denied roles take priority. If allowed roles are set, only those roles can use the command.",
    [Locale.EnglishGB]:
      "Denied roles take priority. If allowed roles are set, only those roles can use the command.",
    [Locale.ChineseTW]:
      "被拒絕的身分組優先。如果設定了允許的身分組，則只有這些身分組可以使用指令。",
    [Locale.ChineseCN]:
      "被拒绝的角色优先。如果设置了允许的角色，则只有这些角色可以使用命令。",
    [Locale.Japanese]:
      "拒否ロールが優先されます。許可ロールが設定されている場合、それらのロールのみがコマンドを使用できます。",
  } as LocalizationMap,
  roleNoneDesc: {
    [Locale.EnglishUS]: "Everyone can use (no role restrictions)",
    [Locale.EnglishGB]: "Everyone can use (no role restrictions)",
    [Locale.ChineseTW]: "所有人都可使用（無身分組限制）",
    [Locale.ChineseCN]: "所有人都可使用（无角色限制）",
    [Locale.Japanese]: "全員が使用可能（ロール制限なし）",
  } as LocalizationMap,
  roleAllowOnlyDesc: {
    [Locale.EnglishUS]: "Only allowed roles can use",
    [Locale.EnglishGB]: "Only allowed roles can use",
    [Locale.ChineseTW]: "只有允許的身分組可以使用",
    [Locale.ChineseCN]: "只有允许的角色可以使用",
    [Locale.Japanese]: "許可されたロールのみ使用可能",
  } as LocalizationMap,
  roleDenyOnlyDesc: {
    [Locale.EnglishUS]: "Denied roles cannot use",
    [Locale.EnglishGB]: "Denied roles cannot use",
    [Locale.ChineseTW]: "被拒絕的身分組無法使用",
    [Locale.ChineseCN]: "被拒绝的角色无法使用",
    [Locale.Japanese]: "拒否されたロールは使用不可",
  } as LocalizationMap,
  roleMixedDesc: {
    [Locale.EnglishUS]: "Denied roles cannot use; others need an allowed role",
    [Locale.EnglishGB]: "Denied roles cannot use; others need an allowed role",
    [Locale.ChineseTW]: "被拒絕的身分組無法使用；其他人需要允許的身分組",
    [Locale.ChineseCN]: "被拒绝的角色无法使用；其他人需要允许的角色",
    [Locale.Japanese]: "拒否ロールは使用不可；他は許可ロールが必要",
  } as LocalizationMap,
  currentBehavior: {
    [Locale.EnglishUS]: "Current Behavior",
    [Locale.EnglishGB]: "Current Behavior",
    [Locale.ChineseTW]: "目前行為",
    [Locale.ChineseCN]: "当前行为",
    [Locale.Japanese]: "現在の動作",
  } as LocalizationMap,

  // Rate limit logic
  rateLimitLogicTitle: {
    [Locale.EnglishUS]: "Rate Limit Logic",
    [Locale.EnglishGB]: "Rate Limit Logic",
    [Locale.ChineseTW]: "速率限制邏輯",
    [Locale.ChineseCN]: "速率限制逻辑",
    [Locale.Japanese]: "レート制限のロジック",
  } as LocalizationMap,
  rateLimitLogicDesc: {
    [Locale.EnglishUS]:
      "Per-command limits override default limits. If no limit is set, commands are unlimited.",
    [Locale.EnglishGB]:
      "Per-command limits override default limits. If no limit is set, commands are unlimited.",
    [Locale.ChineseTW]:
      "個別指令限制會覆蓋預設限制。如果未設定限制，指令則無限制。",
    [Locale.ChineseCN]:
      "单个命令限制会覆盖默认限制。如果未设置限制，命令则无限制。",
    [Locale.Japanese]:
      "コマンドごとの制限はデフォルト制限を上書きします。制限が設定されていない場合、コマンドは無制限です。",
  } as LocalizationMap,

  // Reset buttons
  resetGeneralSettings: {
    [Locale.EnglishUS]: "Reset",
    [Locale.EnglishGB]: "Reset",
    [Locale.ChineseTW]: "重設",
    [Locale.ChineseCN]: "重置",
    [Locale.Japanese]: "リセット",
  } as LocalizationMap,
  resetAllCommandPermissions: {
    [Locale.EnglishUS]: "Reset All Permissions",
    [Locale.EnglishGB]: "Reset All Permissions",
    [Locale.ChineseTW]: "重設所有權限",
    [Locale.ChineseCN]: "重置所有权限",
    [Locale.Japanese]: "すべての権限をリセット",
  } as LocalizationMap,
  factoryReset: {
    [Locale.EnglishUS]: "Factory Reset",
    [Locale.EnglishGB]: "Factory Reset",
    [Locale.ChineseTW]: "恢復原廠設定",
    [Locale.ChineseCN]: "恢复出厂设置",
    [Locale.Japanese]: "工場出荷時リセット",
  } as LocalizationMap,
  confirmDelete: {
    [Locale.EnglishUS]: "Yes, Delete All",
    [Locale.EnglishGB]: "Yes, Delete All",
    [Locale.ChineseTW]: "是，全部刪除",
    [Locale.ChineseCN]: "是，全部删除",
    [Locale.Japanese]: "はい、すべて削除",
  } as LocalizationMap,
} as const;

/**
 * Get a localized UI label
 */
export function getSettingsUILabel(
  key: keyof typeof SETTINGS_UI_LABELS,
  locale: Locale | string,
): string {
  const labels = SETTINGS_UI_LABELS[key];
  return (
    (labels[locale as keyof typeof labels] as string) ||
    (labels[Locale.EnglishUS] as string) ||
    ""
  );
}
