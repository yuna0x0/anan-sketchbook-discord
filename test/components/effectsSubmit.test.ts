/**
 * Effects Modal Submit Tests
 * Integration tests for the keep-current semantics and the no-change
 * short-circuit: an untouched submission must not alter any stored parameter
 * and must not re-render; a real change must re-render.
 */

import { describe, it, mock } from "node:test";
import assert from "node:assert/strict";

import type { ModalSubmitInteraction } from "discord.js";
import { handleEffectsModalSubmit } from "../../src/components/adjustModals.js";
import { adjustSessions } from "../../src/services/adjustSessionStore.js";
import type { SketchbookParams } from "../../src/services/generationService.js";

// Placeholder Discord snowflake IDs (not real IDs)
const USER_ID = "111111111111111111";
const MESSAGE_ID = "333333333333333333";

/** A session with every setting deliberately non-default */
function nonDefaultParams(): SketchbookParams {
  return {
    command: "sketchbook",
    text: "Hi",
    expression: "happy",
    align: "left",
    valign: "top",
    useOverlay: false,
    wrapAlgorithm: "knuth_plass",
    fontId: "miSans",
    maxFontHeight: 40,
    filter: "halftone_dots",
    filterSettings: { dot_size: 12 },
    adjustments: { brightness: 1.5 },
  };
}

/**
 * Mock a modal submission. By default nothing was touched: radios unanswered,
 * text inputs carrying their prefilled values.
 */
function createInteraction(
  radioAnswers: Record<string, string> = {},
  fineTuneValue = "brightness=1.5 dot_size=12",
) {
  const editReply = mock.fn<(options: unknown) => Promise<unknown>>(
    async () => ({}),
  );
  const followUp = mock.fn<(options: unknown) => Promise<unknown>>(
    async () => ({}),
  );
  const deferUpdate = mock.fn<() => Promise<unknown>>(async () => ({}));

  const interaction = {
    isFromMessage: () => true,
    message: { id: MESSAGE_ID },
    user: { id: USER_ID },
    locale: "en-US",
    guildId: null,
    fields: {
      getRadioGroup: (customId: string) => radioAnswers[customId] ?? null,
      getStringSelectValues: () => [],
      getTextInputValue: (customId: string) => {
        if (customId === "fine_tune") return fineTuneValue;
        return "";
      },
    },
    deferUpdate,
    editReply,
    followUp,
    reply: async () => ({}),
  } as unknown as ModalSubmitInteraction;

  return { interaction, editReply, followUp, deferUpdate };
}

describe("handleEffectsModalSubmit", () => {
  it("should keep every setting and skip re-rendering when submitted untouched", async () => {
    adjustSessions.set(MESSAGE_ID, {
      userId: USER_ID,
      params: nonDefaultParams(),
    });

    try {
      const { interaction, editReply, followUp, deferUpdate } =
        createInteraction();
      await handleEffectsModalSubmit(interaction);

      assert.equal(deferUpdate.mock.callCount(), 1, "acknowledged silently");
      assert.equal(editReply.mock.callCount(), 0, "no re-render, no indicator");
      assert.equal(followUp.mock.callCount(), 0, "no error follow-up");

      const session = adjustSessions.get(MESSAGE_ID);
      assert.ok(session);
      assert.deepEqual(session.params, nonDefaultParams());
    } finally {
      adjustSessions.delete(MESSAGE_ID);
    }
  });

  it("should re-render when a setting actually changes", async () => {
    adjustSessions.set(MESSAGE_ID, {
      userId: USER_ID,
      params: nonDefaultParams(),
    });

    try {
      const { interaction, editReply, followUp } = createInteraction({
        overlay: "on",
      });
      await handleEffectsModalSubmit(interaction);

      const lastEdit = editReply.mock.calls.at(-1)?.arguments[0] as {
        files?: unknown[];
      };
      assert.ok(lastEdit?.files?.length, "should re-render with a new file");
      assert.equal(followUp.mock.callCount(), 0, "no error follow-up");

      const session = adjustSessions.get(MESSAGE_ID);
      assert.equal(session?.params.command, "sketchbook");
      assert.equal(
        (session?.params as SketchbookParams).useOverlay,
        true,
        "overlay toggle applied",
      );
    } finally {
      adjustSessions.delete(MESSAGE_ID);
    }
  });

  it("should apply a format token from the fine-tune field", async () => {
    adjustSessions.set(MESSAGE_ID, {
      userId: USER_ID,
      params: nonDefaultParams(),
    });

    try {
      const { interaction, editReply, followUp } = createInteraction(
        {},
        "brightness=1.5 dot_size=12 format=png",
      );
      await handleEffectsModalSubmit(interaction);

      const lastEdit = editReply.mock.calls.at(-1)?.arguments[0] as {
        files?: unknown[];
      };
      assert.ok(lastEdit?.files?.length, "should re-render with a new file");
      assert.equal(followUp.mock.callCount(), 0, "no error follow-up");

      const session = adjustSessions.get(MESSAGE_ID);
      assert.equal(session?.params.outputFormat, "png", "format applied");
    } finally {
      adjustSessions.delete(MESSAGE_ID);
    }
  });

  it("should reject an unknown format value with the help card", async () => {
    adjustSessions.set(MESSAGE_ID, {
      userId: USER_ID,
      params: nonDefaultParams(),
    });

    try {
      const replyCalls: unknown[] = [];
      const { interaction, editReply } = createInteraction(
        {},
        "format=bmp",
      );
      (interaction as unknown as { reply: (o: unknown) => Promise<unknown> }).reply =
        async (options: unknown) => {
          replyCalls.push(options);
          return {};
        };
      await handleEffectsModalSubmit(interaction);

      assert.equal(replyCalls.length, 1, "should reply with the error");
      assert.ok(
        String((replyCalls[0] as { content?: string }).content).includes(
          "format=bmp",
        ),
        "error names the invalid token",
      );
      assert.equal(editReply.mock.callCount(), 0, "no re-render on error");

      const session = adjustSessions.get(MESSAGE_ID);
      assert.equal(
        session?.params.outputFormat,
        undefined,
        "format unchanged on error",
      );
    } finally {
      adjustSessions.delete(MESSAGE_ID);
    }
  });
});
