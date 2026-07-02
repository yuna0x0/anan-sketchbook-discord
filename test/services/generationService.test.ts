/**
 * Generation Service Tests
 * Tests for attachment building (filename, spoiler flag, description)
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { buildGenerationAttachment } from "../../src/services/generationService.js";
import type {
  SketchbookParams,
  DialogueParams,
} from "../../src/services/generationService.js";
import { CHARACTERS, CharacterId } from "../../src/config/dialogue/characters.js";

const BUFFER = Buffer.from("fake-image");

function sketchbookParams(spoiler?: boolean): SketchbookParams {
  return {
    command: "sketchbook",
    text: "Hello",
    expression: "normal",
    align: "center",
    valign: "middle",
    useOverlay: true,
    wrapAlgorithm: "greedy",
    fontId: "miSans",
    filter: "none",
    spoiler,
  };
}

function dialogueParams(spoiler?: boolean): DialogueParams {
  const characterId = Object.keys(CHARACTERS)[0] as CharacterId;
  return {
    command: "dialogue",
    characterId,
    expressionId: CHARACTERS[characterId].expressions[0],
    text: "Hello there",
    stretchMode: "zoom_x",
    fontId: "miSans",
    fontSize: 72,
    highlightBrackets: true,
    nameLocale: "ja",
    filter: "none",
    spoiler,
  };
}

describe("buildGenerationAttachment", () => {
  it("should use plain filenames by default", () => {
    assert.equal(
      buildGenerationAttachment(sketchbookParams(), BUFFER, "en-US").name,
      "sketchbook.png",
    );
    assert.equal(
      buildGenerationAttachment(dialogueParams(), BUFFER, "en-US").name,
      "dialogue.png",
    );
  });

  it("should prefix SPOILER_ when the spoiler flag is set", () => {
    assert.equal(
      buildGenerationAttachment(sketchbookParams(true), BUFFER, "en-US").name,
      "SPOILER_sketchbook.png",
    );
    assert.equal(
      buildGenerationAttachment(dialogueParams(true), BUFFER, "en-US").name,
      "SPOILER_dialogue.png",
    );
  });

  it("should keep the accessibility description", () => {
    const attachment = buildGenerationAttachment(
      sketchbookParams(true),
      BUFFER,
      "en-US",
    );
    assert.ok(attachment.description?.includes("Hello"));
  });
});
