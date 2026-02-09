/**
 * Interaction Utils Tests
 * Tests for editReplyWithFiles fallback behavior on Missing Permissions
 */

import { describe, it, mock } from "node:test";
import assert from "node:assert/strict";

import { MessageFlags } from "discord.js";
import { DiscordAPIError } from "@discordjs/rest";
import { RESTJSONErrorCodes } from "discord-api-types/v10";
import { editReplyWithFiles } from "../../src/utils/interactionUtils.js";
import type { AttachmentBuilder, ChatInputCommandInteraction } from "discord.js";

/**
 * Creates a DiscordAPIError instance with the given error code.
 */
function createDiscordAPIError(code: number): DiscordAPIError {
  return new DiscordAPIError(
    { code, message: "Missing Permissions", errors: undefined },
    code,
    403,
    "PATCH",
    "https://discord.com/api/v10/webhooks/test/messages/@original",
    { body: undefined, files: undefined },
  );
}

/**
 * Creates a mock ChatInputCommandInteraction with spy-able methods.
 */
function createMockInteraction() {
  const editReply = mock.fn<(options: unknown) => Promise<unknown>>();
  const deleteReply = mock.fn<() => Promise<void>>();
  const followUp = mock.fn<(options: unknown) => Promise<unknown>>();

  const interaction = {
    editReply,
    deleteReply,
    followUp,
  } as unknown as ChatInputCommandInteraction;

  return { interaction, editReply, deleteReply, followUp };
}

describe("editReplyWithFiles", () => {
  const fakeFiles = [{ name: "test.png" }] as unknown as AttachmentBuilder[];
  const locale = "en-US";

  it("should call editReply with files on success", async () => {
    const { interaction, editReply, deleteReply, followUp } =
      createMockInteraction();
    editReply.mock.mockImplementation(async () => ({}));

    await editReplyWithFiles(interaction, fakeFiles, locale);

    assert.equal(editReply.mock.callCount(), 1);
    assert.deepEqual(editReply.mock.calls[0].arguments[0], {
      files: fakeFiles,
    });
    assert.equal(deleteReply.mock.callCount(), 0);
    assert.equal(followUp.mock.callCount(), 0);
  });

  it("should fall back to ephemeral followUp on MissingPermissions error", async () => {
    const { interaction, editReply, deleteReply, followUp } =
      createMockInteraction();

    editReply.mock.mockImplementation(async () => {
      throw createDiscordAPIError(RESTJSONErrorCodes.MissingPermissions);
    });
    deleteReply.mock.mockImplementation(async () => {});
    followUp.mock.mockImplementation(async () => ({}));

    await editReplyWithFiles(interaction, fakeFiles, locale);

    assert.equal(editReply.mock.callCount(), 1);
    assert.equal(deleteReply.mock.callCount(), 1);
    assert.equal(followUp.mock.callCount(), 1);

    const followUpArgs = followUp.mock.calls[0].arguments[0] as {
      content: string;
      files: AttachmentBuilder[];
      flags: number;
    };
    assert.equal(followUpArgs.files, fakeFiles);
    assert.equal(followUpArgs.flags, MessageFlags.Ephemeral);
    assert.ok(followUpArgs.content.length > 0);
  });

  it("should still followUp even if deleteReply fails", async () => {
    const { interaction, editReply, deleteReply, followUp } =
      createMockInteraction();

    editReply.mock.mockImplementation(async () => {
      throw createDiscordAPIError(RESTJSONErrorCodes.MissingPermissions);
    });
    deleteReply.mock.mockImplementation(async () => {
      throw new Error("Cannot delete");
    });
    followUp.mock.mockImplementation(async () => ({}));

    await editReplyWithFiles(interaction, fakeFiles, locale);

    assert.equal(deleteReply.mock.callCount(), 1);
    assert.equal(followUp.mock.callCount(), 1);
  });

  it("should re-throw non-MissingPermissions DiscordAPIError", async () => {
    const { interaction, editReply, deleteReply, followUp } =
      createMockInteraction();

    editReply.mock.mockImplementation(async () => {
      throw createDiscordAPIError(RESTJSONErrorCodes.UnknownChannel);
    });

    await assert.rejects(
      () => editReplyWithFiles(interaction, fakeFiles, locale),
      (error: unknown) =>
        error instanceof DiscordAPIError &&
        error.code === RESTJSONErrorCodes.UnknownChannel,
    );

    assert.equal(deleteReply.mock.callCount(), 0);
    assert.equal(followUp.mock.callCount(), 0);
  });

  it("should re-throw non-DiscordAPIError errors", async () => {
    const { interaction, editReply, deleteReply, followUp } =
      createMockInteraction();

    editReply.mock.mockImplementation(async () => {
      throw new TypeError("Something unexpected");
    });

    await assert.rejects(
      () => editReplyWithFiles(interaction, fakeFiles, locale),
      (error: unknown) =>
        error instanceof TypeError &&
        error.message === "Something unexpected",
    );

    assert.equal(deleteReply.mock.callCount(), 0);
    assert.equal(followUp.mock.callCount(), 0);
  });
});
