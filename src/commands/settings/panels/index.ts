/**
 * Panel Builders Index
 *
 * Re-exports all panel builder functions for the settings command.
 *
 * Panel hierarchy:
 * - Dashboard: Main settings overview
 *   - General Bot Settings: Bot enable/disable, language
 *   - Command Permissions: Default and per-command permissions
 *     - Default Permissions: Channel mode, channel list, roles
 *     - Per-command Permissions: Enable/disable, channels, roles
 *   - Rate Limits: Default and per-command rate limits
 */

// Dashboard
export { buildDashboard } from "./dashboard.js";

// General Bot Settings
export { buildGeneralPanel } from "./general/index.js";

// Command Permissions - main panel and all permission-related panels
export {
  buildCommandsPanel,
  buildDefaultChannelsPanel,
  buildDefaultChannelsDetailPanel,
  buildDefaultRolesPanel,
  buildCommandDetailPanel,
  buildCommandChannelsPanel,
  buildCommandRolesPanel,
} from "./permissions/index.js";

// Rate Limits
export { buildRateLimitsPanel } from "./ratelimits/index.js";
