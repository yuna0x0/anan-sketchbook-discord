/**
 * Image Message Action Handlers
 * Handles Adjust/Effects button clicks on generated image messages by opening
 * the matching modal. The modal submit then updates the image in place, the
 * only edit path that works in user-install contexts where the bot has no
 * channel permissions.
 */

import { MessageFlags } from "discord.js";
import type { ButtonInteraction } from "discord.js";
import { getResponseMessage } from "../locales/index.js";
import { adjustSessions } from "../services/adjustSessionStore.js";
import { parseActionInvokerId } from "./actionRow.js";
import { buildAdjustModal, buildEffectsModal } from "./adjustModals.js";

/**
 * Handle an Adjust or Effects button click by opening the matching modal.
 * The modal must be the first response, so no deferring here.
 */
async function handleActionButton(
  interaction: ButtonInteraction,
  kind: "adjust" | "effects",
): Promise<void> {
  const locale = interaction.locale;
  const invokerId = parseActionInvokerId(interaction.customId);

  if (!invokerId || interaction.user.id !== invokerId) {
    await interaction.reply({
      content: getResponseMessage("actionDenied", locale),
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const session = adjustSessions.get(interaction.message.id);
  if (!session) {
    await interaction.reply({
      content: getResponseMessage("sessionExpired", locale),
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  // The interaction ID as nonce makes the modal custom ID unique per open;
  // Discord clients cache modal drafts by custom ID and would otherwise
  // restore the user's stale draft instead of the fresh pre-filled values
  const modal =
    kind === "adjust"
      ? buildAdjustModal(session, locale, interaction.id)
      : buildEffectsModal(session, locale, interaction.id);
  await interaction.showModal(modal);
}

export async function handleAdjustButton(
  interaction: ButtonInteraction,
): Promise<void> {
  await handleActionButton(interaction, "adjust");
}

export async function handleEffectsButton(
  interaction: ButtonInteraction,
): Promise<void> {
  await handleActionButton(interaction, "effects");
}
