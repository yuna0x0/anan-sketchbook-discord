/**
 * Image Message Action Row
 * Builds the [Adjust] [Effects] [🗑️] button row attached to generated image
 * messages. Authorization is stateless: the invoker's user ID is carried in
 * each button's custom ID.
 */

import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { getAdjustUILabel } from "../locales/index.js";
import { buildDeleteButton } from "./deleteButton.js";

const SEPARATOR = ":";
export const ADJUST_BUTTON_PREFIX = "adjust_msg";
export const EFFECTS_BUTTON_PREFIX = "effects_msg";
export const ADJUST_MODAL_PREFIX = "adjust_modal";
export const EFFECTS_MODAL_PREFIX = "effects_modal";

export function createActionCustomId(prefix: string, userId: string): string {
  return `${prefix}${SEPARATOR}${userId}`;
}

/**
 * Create a modal custom ID that is unique per open.
 * Discord clients cache modal drafts keyed by the modal custom ID; reusing an
 * ID makes the client restore the user's stale draft instead of rendering the
 * fresh pre-filled values, so every open needs a new nonce.
 */
export function createModalCustomId(
  prefix: string,
  userId: string,
  nonce: string,
): string {
  return `${prefix}${SEPARATOR}${userId}${SEPARATOR}${nonce}`;
}

function hasPrefix(customId: string, prefix: string): boolean {
  return customId.startsWith(`${prefix}${SEPARATOR}`);
}

export function isAdjustButtonCustomId(customId: string): boolean {
  return hasPrefix(customId, ADJUST_BUTTON_PREFIX);
}

export function isEffectsButtonCustomId(customId: string): boolean {
  return hasPrefix(customId, EFFECTS_BUTTON_PREFIX);
}

export function isAdjustModalCustomId(customId: string): boolean {
  return hasPrefix(customId, ADJUST_MODAL_PREFIX);
}

export function isEffectsModalCustomId(customId: string): boolean {
  return hasPrefix(customId, EFFECTS_MODAL_PREFIX);
}

/**
 * Extract the invoker's user ID from an action custom ID
 */
export function parseActionInvokerId(customId: string): string | null {
  const userId = customId.split(SEPARATOR)[1];
  return userId || null;
}

/**
 * Build the [Adjust] [Effects] [🗑️] action row for a generated image message.
 * Labels are localized with the invoker's locale at build time.
 * Pass disabled: true while a regeneration is running so the buttons show an
 * inactive state and cannot stack submissions.
 */
export function buildImageActionsRow(
  userId: string,
  locale: string,
  options: { disabled?: boolean } = {},
): ActionRowBuilder<ButtonBuilder> {
  const disabled = options.disabled ?? false;

  const adjustButton = new ButtonBuilder()
    .setCustomId(createActionCustomId(ADJUST_BUTTON_PREFIX, userId))
    .setLabel(getAdjustUILabel("adjustButton", locale))
    .setEmoji("✏️")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(disabled);

  const effectsButton = new ButtonBuilder()
    .setCustomId(createActionCustomId(EFFECTS_BUTTON_PREFIX, userId))
    .setLabel(getAdjustUILabel("effectsButton", locale))
    .setEmoji("✨")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(disabled);

  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    adjustButton,
    effectsButton,
    buildDeleteButton(userId).setDisabled(disabled),
  );
}
