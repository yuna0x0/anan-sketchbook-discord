/**
 * Permissions Panel Index
 *
 * Re-exports all panel builder functions for permission settings.
 * Includes default permissions and per-command permissions.
 */

// Permissions overview
export { buildCommandsPanel } from "./overview.js";

// Default permissions
export {
  buildDefaultChannelsPanel,
  buildDefaultChannelsDetailPanel,
} from "./defaultChannels.js";
export { buildDefaultRolesPanel } from "./defaultRoles.js";

// Per-command permissions
export { buildCommandDetailPanel } from "./commandDetail.js";
export { buildCommandChannelsPanel } from "./commandChannels.js";
export { buildCommandRolesPanel } from "./commandRoles.js";
