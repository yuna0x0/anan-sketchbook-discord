/**
 * Delete Button Component
 * A button attached to generated image messages that lets the command invoker
 * delete the bot's message.
 *
 * Deleting goes through the button interaction's own webhook
 * (deferUpdate + deleteReply), which works even in user-install contexts where
 * the bot has no channel permissions and the original interaction token has
 * expired. The invoker's user ID is carried in the custom ID so authorization
 * is stateless and survives bot restarts.
 */

import {
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  PermissionFlagsBits,
} from "discord.js";
import type { ButtonInteraction } from "discord.js";
import { getResponseMessage } from "../locales/index.js";

// Component custom ID prefix (must not collide with the "settings" prefix)
export const DELETE_BUTTON_PREFIX = "delete_msg";
const SEPARATOR = ":";

/**
 * Create the delete button custom ID for a given invoker
 */
export function createDeleteButtonCustomId(userId: string): string {
  return `${DELETE_BUTTON_PREFIX}${SEPARATOR}${userId}`;
}

/**
 * Check if a custom ID belongs to the delete button
 */
export function isDeleteButtonCustomId(customId: string): boolean {
  return customId.startsWith(`${DELETE_BUTTON_PREFIX}${SEPARATOR}`);
}

/**
 * Extract the invoker's user ID from a delete button custom ID
 */
export function parseDeleteButtonCustomId(customId: string): string | null {
  if (!isDeleteButtonCustomId(customId)) {
    return null;
  }
  const userId = customId.split(SEPARATOR)[1];
  return userId || null;
}

/**
 * Build the delete button
 */
export function buildDeleteButton(userId: string): ButtonBuilder {
  return new ButtonBuilder()
    .setCustomId(createDeleteButtonCustomId(userId))
    .setEmoji("🗑️")
    .setStyle(ButtonStyle.Secondary);
}

/**
 * Handle a delete button click.
 * The original command invoker may always delete. In guilds, members with
 * Manage Messages may too, mirroring who can already delete the message
 * through Discord's native moderation. Anyone else gets an ephemeral notice.
 */
export async function handleDeleteButton(
  interaction: ButtonInteraction,
): Promise<void> {
  const locale = interaction.locale;
  const invokerId = parseDeleteButtonCustomId(interaction.customId);

  const isInvoker = invokerId !== null && interaction.user.id === invokerId;
  const isModerator =
    interaction.inGuild() &&
    (interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages) ??
      false);

  if (!invokerId || (!isInvoker && !isModerator)) {
    await interaction.reply({
      content: getResponseMessage("deleteDenied", locale),
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await interaction.deferUpdate();

  try {
    // Delete via the interaction webhook: no channel permissions needed,
    // works in user-install contexts where the bot is not a member
    await interaction.deleteReply();
  } catch {
    try {
      // Fall back to the channel API (bot DMs, guilds where the bot has
      // Manage Messages or owns the message)
      await interaction.message.delete();
    } catch {
      await interaction.followUp({
        content: getResponseMessage("deleteFailed", locale),
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}
