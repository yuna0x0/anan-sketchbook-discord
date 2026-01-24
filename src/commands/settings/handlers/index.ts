/**
 * Handlers Index
 *
 * Re-exports all handler functions for the settings command.
 *
 * Handler categories:
 * - General Bot Settings: Bot enable/disable, language
 * - Command Permissions (Default Permissions): Channel mode, channel list, roles
 * - Command Permissions (Per-command Permissions): Enable/disable, channels, roles
 * - Rate Limits: Default and per-command rate limits
 */

// General Bot Settings handlers
export {
  handleToggleBot,
  handleSetLanguage,
  handleResetGeneralSettings,
  handleConfirmResetGeneralSettings,
  handleFactoryReset,
  handleConfirmFactoryReset,
} from "./general.js";

// Command Permissions - Default Permissions handlers
export {
  // Channel handlers
  handleSetChannelMode,
  handleAddChannel,
  handleRemoveChannel,
  handleClearChannels,
  handleConfirmClearChannels,
  // Role handlers
  handleAllowDefaultRole,
  handleDenyDefaultRole,
  handleRemoveDefaultRole,
  handleClearDefaultRoles,
  handleConfirmClearDefaultRoles,
  // Reset default permissions
  handleResetDefaultPermissions,
  handleConfirmResetDefaultPermissions,
} from "./channels.js";

// Command Permissions - Per-command handlers
export {
  handleSelectCommand,
  handleToggleCommand,
  // Role permissions
  handleAllowRole,
  handleDenyRole,
  handleRemoveRole,
  // Channel permissions
  handleSetCommandChannelMode,
  handleAddCommandChannel,
  handleRemoveCommandChannel,
  // Reset command permissions
  handleResetCommand,
  handleConfirmResetCommand,
  // Clear command permissions
  handleClearCommandChannels,
  handleConfirmClearCommandChannels,
  handleClearCommandRoles,
  handleConfirmClearCommandRoles,
  // Reset all command permissions
  handleResetAllCommandSettings,
  handleConfirmResetAllCommandSettings,
} from "./commands.js";

// Rate Limits handlers
export {
  handleSelectRateLimitTarget,
  handleRemoveRateLimit,
  handleRateLimitModalSubmit,
  handleClearRateLimits,
  handleConfirmClearRateLimits,
} from "./rateLimits.js";
