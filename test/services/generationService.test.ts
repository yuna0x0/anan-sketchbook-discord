/**
 * Generation Service Tests
 * Tests for attachment building (filename, spoiler flag, description) and
 * the output-format encoding of rendered images
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  buildGenerationAttachment,
  renderGeneration,
} from "../../src/services/generationService.js";
import type {
  SketchbookParams,
  DialogueParams,
} from "../../src/services/generationService.js";
import { GAMES } from "../../src/config/games/index.js";

function isWebp(buffer: Buffer): boolean {
  return (
    buffer.length > 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  );
}

function isPng(buffer: Buffer): boolean {
  return buffer.length > 8 && buffer[0] === 0x89 && buffer[1] === 0x50;
}

function isJpeg(buffer: Buffer): boolean {
  return buffer.length > 2 && buffer[0] === 0xff && buffer[1] === 0xd8;
}

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
  const characterId = Object.keys(GAMES.manosaba.characters)[0];
  return {
    command: "dialogue",
    gameId: "manosaba",
    characterId,
    expressionId: GAMES.manosaba.characters[characterId].expressions[0],
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
      "sketchbook.webp",
    );
    assert.equal(
      buildGenerationAttachment(dialogueParams(), BUFFER, "en-US").name,
      "dialogue.webp",
    );
  });

  it("should prefix SPOILER_ when the spoiler flag is set", () => {
    assert.equal(
      buildGenerationAttachment(sketchbookParams(true), BUFFER, "en-US").name,
      "SPOILER_sketchbook.webp",
    );
    assert.equal(
      buildGenerationAttachment(dialogueParams(true), BUFFER, "en-US").name,
      "SPOILER_dialogue.webp",
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

  it("should use the chosen output format as the file extension", () => {
    const png = { ...sketchbookParams(), outputFormat: "png" as const };
    assert.equal(
      buildGenerationAttachment(png, BUFFER, "en-US").name,
      "sketchbook.png",
    );
    const jpg = { ...dialogueParams(true), outputFormat: "jpg" as const };
    assert.equal(
      buildGenerationAttachment(jpg, BUFFER, "en-US").name,
      "SPOILER_dialogue.jpg",
    );
  });
});

describe("renderGeneration output format", () => {
  it("should encode WebP by default", async () => {
    const buffer = await renderGeneration(sketchbookParams());
    assert.ok(isWebp(buffer), "default output should be WebP");
  });

  it("should encode PNG when format=png", async () => {
    const buffer = await renderGeneration({
      ...sketchbookParams(),
      outputFormat: "png",
    });
    assert.ok(isPng(buffer), "png output should be PNG");
  });

  it("should encode JPEG when format=jpg", async () => {
    const buffer = await renderGeneration({
      ...dialogueParams(),
      outputFormat: "jpg",
    });
    assert.ok(isJpeg(buffer), "jpg output should be JPEG");
  });
});
