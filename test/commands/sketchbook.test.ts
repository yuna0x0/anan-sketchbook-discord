/**
 * Command Definition Tests
 * Tests that the slash command surfaces match the intended design:
 * core options only, with advanced options living in the Adjust/Effects
 * modals instead.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { data as sketchbookData } from "../../src/commands/sketchbook.js";
import { data as dialogueData } from "../../src/commands/dialogue.js";

describe("sketchbook command definition", () => {
  const json = sketchbookData.toJSON();
  const optionNames = (json.options ?? []).map((option) => option.name);

  it("should be named sketchbook", () => {
    assert.equal(json.name, "sketchbook");
  });

  it("should keep only the core options", () => {
    assert.deepEqual(optionNames, [
      "text",
      "image",
      "expression",
      "dm",
      "spoiler",
    ]);
  });

  it("should not expose advanced options in slash (moved to modals)", () => {
    for (const removed of [
      "align",
      "valign",
      "overlay",
      "wrap",
      "font",
      "font_size",
    ]) {
      assert.ok(
        !optionNames.includes(removed),
        `${removed} should not be a slash option`,
      );
    }
  });

  it("should offer all 13 expression choices", () => {
    const expression = json.options?.find((o) => o.name === "expression");
    assert.ok(expression && "choices" in expression);
    assert.equal(expression.choices?.length, 13);
  });
});

describe("dialogue command definition", () => {
  const json = dialogueData.toJSON();
  const optionNames = (json.options ?? []).map((option) => option.name);

  it("should be named dialogue", () => {
    assert.equal(json.name, "dialogue");
  });

  it("should keep only the core options", () => {
    assert.deepEqual(optionNames, [
      "character",
      "expression",
      "text",
      "background",
      "custom_background",
      "dm",
      "language",
      "spoiler",
    ]);
  });

  it("should not expose advanced options in slash (moved to modals)", () => {
    for (const removed of ["stretch", "font", "font_size", "highlight"]) {
      assert.ok(
        !optionNames.includes(removed),
        `${removed} should not be a slash option`,
      );
    }
  });

  it("should keep language since it affects the rendered character name", () => {
    const language = json.options?.find((o) => o.name === "language");
    assert.ok(language, "language option should exist");
  });

  it("should use autocomplete for character (hidden characters stay out of static choices)", () => {
    const character = json.options?.find((o) => o.name === "character");
    assert.ok(character && "autocomplete" in character);
    assert.equal(character.autocomplete, true);
    assert.ok(
      !("choices" in character) || !character.choices,
      "character should not have static choices",
    );
  });
});
