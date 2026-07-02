import { MessageFlags } from "discord.js";
import type {
  ActionRowBuilder,
  AttachmentBuilder,
  ChatInputCommandInteraction,
  Message,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { DiscordAPIError } from "@discordjs/rest";
import { RESTJSONErrorCodes } from "discord-api-types/v10";
import { getResponseMessage } from "../locales/index.js";

/**
 * Delete the original deferred reply and send an ephemeral follow-up instead.
 * This allows error messages to be visible only to the invoking user,
 * even when the original deferReply was non-ephemeral.
 */
export async function replyWithEphemeralError(
  interaction: ChatInputCommandInteraction,
  content: string,
): Promise<void> {
  try {
    await interaction.deleteReply();
  } catch {
    // Ignore: the deferred reply may already be gone or we may lack permission
  }

  await interaction.followUp({
    content,
    flags: MessageFlags.Ephemeral,
  });
}

/**
 * Try to edit the deferred reply with file attachments.
 * If it fails with Missing Permissions (50013), fall back to an ephemeral
 * followUp with the files and a notice, then clean up the original deferred reply.
 * Components are only attached to the public reply, not the ephemeral fallback
 * (ephemeral messages can be dismissed natively).
 * Returns the public message, or null when it fell back to the ephemeral path.
 */
export async function editReplyWithFiles(
  interaction: ChatInputCommandInteraction,
  files: AttachmentBuilder[],
  locale: string,
  components?: ActionRowBuilder<MessageActionRowComponentBuilder>[],
): Promise<Message | null> {
  try {
    return await interaction.editReply(
      components ? { files, components } : { files },
    );
  } catch (error) {
    if (
      !(error instanceof DiscordAPIError) ||
      error.code !== RESTJSONErrorCodes.MissingPermissions
    ) {
      throw error;
    }

    // Clean up the original deferred reply (the "thinking..." message)
    try {
      await interaction.deleteReply();
    } catch {
      // Ignore: the deferred reply may already be gone or we may lack permission
    }

    // Fall back to an ephemeral followUp with a notice
    await interaction.followUp({
      content: getResponseMessage("missingPermissions", locale),
      files,
      flags: MessageFlags.Ephemeral,
    });
    return null;
  }
}
