/**
 * Delete Button Component Tests
 * Tests for custom ID handling and the button click handler
 */

import { describe, it, mock } from "node:test";
import assert from "node:assert/strict";

import { ButtonStyle, ComponentType, MessageFlags } from "discord.js";
import type { ButtonInteraction } from "discord.js";
import {
  createDeleteButtonCustomId,
  isDeleteButtonCustomId,
  parseDeleteButtonCustomId,
  buildDeleteButton,
  handleDeleteButton,
} from "../../src/components/deleteButton.js";

// Placeholder Discord snowflake IDs (not real IDs)
const INVOKER_ID = "111111111111111111";
const OTHER_USER_ID = "222222222222222222";

/**
 * Creates a mock ButtonInteraction with spy-able methods.
 */
function createMockButtonInteraction(
  clickerId: string,
  customId: string,
  options: { inGuild?: boolean; canManageMessages?: boolean } = {},
) {
  const reply = mock.fn<(opts: unknown) => Promise<unknown>>(async () => ({}));
  const deferUpdate = mock.fn<() => Promise<unknown>>(async () => ({}));
  const deleteReply = mock.fn<() => Promise<void>>(async () => {});
  const followUp = mock.fn<(opts: unknown) => Promise<unknown>>(async () => ({}));
  const messageDelete = mock.fn<() => Promise<unknown>>(async () => ({}));

  const inGuild = options.inGuild ?? false;
  const interaction = {
    customId,
    locale: "en-US",
    user: { id: clickerId },
    message: { delete: messageDelete },
    inGuild: () => inGuild,
    memberPermissions: inGuild
      ? { has: () => options.canManageMessages ?? false }
      : null,
    reply,
    deferUpdate,
    deleteReply,
    followUp,
  } as unknown as ButtonInteraction;

  return {
    interaction,
    reply,
    deferUpdate,
    deleteReply,
    followUp,
    messageDelete,
  };
}

describe("delete button custom IDs", () => {
  it("should create and parse a custom ID round-trip", () => {
    const customId = createDeleteButtonCustomId(INVOKER_ID);
    assert.ok(isDeleteButtonCustomId(customId));
    assert.equal(parseDeleteButtonCustomId(customId), INVOKER_ID);
  });

  it("should not match settings custom IDs", () => {
    assert.equal(isDeleteButtonCustomId(`settings:delete:${INVOKER_ID}`), false);
    assert.equal(parseDeleteButtonCustomId("settings:toggle:123"), null);
  });

  it("should not match unrelated custom IDs", () => {
    assert.equal(isDeleteButtonCustomId("delete_msgfoo"), false);
    assert.equal(isDeleteButtonCustomId("other:button"), false);
  });
});

describe("buildDeleteButton", () => {
  it("should build a secondary button carrying the invoker ID", () => {
    const button = buildDeleteButton(INVOKER_ID).toJSON();

    assert.equal(button.type, ComponentType.Button);
    assert.ok("custom_id" in button);
    assert.equal(button.custom_id, createDeleteButtonCustomId(INVOKER_ID));
    assert.equal(button.style, ButtonStyle.Secondary);
  });
});

describe("handleDeleteButton", () => {
  it("should delete via the interaction webhook for the invoker", async () => {
    const { interaction, reply, deferUpdate, deleteReply, messageDelete } =
      createMockButtonInteraction(
        INVOKER_ID,
        createDeleteButtonCustomId(INVOKER_ID),
      );

    await handleDeleteButton(interaction);

    assert.equal(deferUpdate.mock.callCount(), 1);
    assert.equal(deleteReply.mock.callCount(), 1);
    assert.equal(reply.mock.callCount(), 0);
    assert.equal(messageDelete.mock.callCount(), 0);
  });

  it("should allow guild members with Manage Messages", async () => {
    const { interaction, reply, deleteReply } = createMockButtonInteraction(
      OTHER_USER_ID,
      createDeleteButtonCustomId(INVOKER_ID),
      { inGuild: true, canManageMessages: true },
    );

    await handleDeleteButton(interaction);

    assert.equal(deleteReply.mock.callCount(), 1);
    assert.equal(reply.mock.callCount(), 0);
  });

  it("should reject guild members without Manage Messages", async () => {
    const { interaction, reply, deleteReply } = createMockButtonInteraction(
      OTHER_USER_ID,
      createDeleteButtonCustomId(INVOKER_ID),
      { inGuild: true, canManageMessages: false },
    );

    await handleDeleteButton(interaction);

    assert.equal(deleteReply.mock.callCount(), 0);
    assert.equal(reply.mock.callCount(), 1);

    const replyArgs = reply.mock.calls[0].arguments[0] as {
      content: string;
      flags: number;
    };
    assert.equal(replyArgs.flags, MessageFlags.Ephemeral);
    assert.ok(replyArgs.content.length > 0);
  });

  it("should reject other users outside guilds", async () => {
    const { interaction, reply, deferUpdate, deleteReply } =
      createMockButtonInteraction(
        OTHER_USER_ID,
        createDeleteButtonCustomId(INVOKER_ID),
      );

    await handleDeleteButton(interaction);

    assert.equal(deferUpdate.mock.callCount(), 0);
    assert.equal(deleteReply.mock.callCount(), 0);
    assert.equal(reply.mock.callCount(), 1);
  });

  it("should reject malformed custom IDs without deleting", async () => {
    const { interaction, reply, deleteReply } = createMockButtonInteraction(
      INVOKER_ID,
      "delete_msg:",
      { inGuild: true, canManageMessages: true },
    );

    await handleDeleteButton(interaction);

    assert.equal(deleteReply.mock.callCount(), 0);
    assert.equal(reply.mock.callCount(), 1);
  });

  it("should fall back to message.delete when the webhook delete fails", async () => {
    const { interaction, deleteReply, messageDelete, followUp } =
      createMockButtonInteraction(
        INVOKER_ID,
        createDeleteButtonCustomId(INVOKER_ID),
      );
    deleteReply.mock.mockImplementation(async () => {
      throw new Error("Unknown Message");
    });

    await handleDeleteButton(interaction);

    assert.equal(deleteReply.mock.callCount(), 1);
    assert.equal(messageDelete.mock.callCount(), 1);
    assert.equal(followUp.mock.callCount(), 0);
  });

  it("should notify the user when both delete attempts fail", async () => {
    const { interaction, deleteReply, messageDelete, followUp } =
      createMockButtonInteraction(
        INVOKER_ID,
        createDeleteButtonCustomId(INVOKER_ID),
      );
    deleteReply.mock.mockImplementation(async () => {
      throw new Error("Unknown Message");
    });
    messageDelete.mock.mockImplementation(async () => {
      throw new Error("Missing Permissions");
    });

    await handleDeleteButton(interaction);

    assert.equal(followUp.mock.callCount(), 1);
    const followUpArgs = followUp.mock.calls[0].arguments[0] as {
      content: string;
      flags: number;
    };
    assert.equal(followUpArgs.flags, MessageFlags.Ephemeral);
    assert.ok(followUpArgs.content.length > 0);
  });
});
