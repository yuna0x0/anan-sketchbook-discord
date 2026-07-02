/**
 * Character Search Tests
 * Tests for autocomplete suggestions and the hidden-character reveal rules
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  searchCharacters,
  matchesHiddenCharacter,
} from "../../src/utils/characterSearch.js";
import { CHARACTERS } from "../../src/config/dialogue/characters.js";

const HIDDEN_IDS = Object.values(CHARACTERS)
  .filter((info) => info.hidden)
  .map((info) => info.id);
const VISIBLE_COUNT = Object.keys(CHARACTERS).length - HIDDEN_IDS.length;

describe("searchCharacters", () => {
  it("should have at least one hidden character configured", () => {
    assert.ok(HIDDEN_IDS.includes("yuki"));
  });

  it("should not include hidden characters in default suggestions", () => {
    const results = searchCharacters("", "en-US");
    const ids = results.map((r) => r.id);
    assert.equal(results.length, VISIBLE_COUNT);
    for (const hiddenId of HIDDEN_IDS) {
      assert.ok(!ids.includes(hiddenId), `${hiddenId} should be hidden`);
    }
  });

  it("should not reveal hidden characters on short generic queries", () => {
    for (const query of ["y", "yu", "u", "k"]) {
      const ids = searchCharacters(query, "en-US").map((r) => r.id);
      assert.ok(!ids.includes("yuki"), `"${query}" should not reveal yuki`);
    }
  });

  it("should reveal a hidden character on close name matches", () => {
    for (const query of ["yuki", "tsuki", "月代雪", "雪", "ユキ", "月代"]) {
      const ids = searchCharacters(query, "en-US").map((r) => r.id);
      assert.ok(ids.includes("yuki"), `"${query}" should reveal yuki`);
    }
  });

  it("should match visible characters by any localized name", () => {
    // Chinese name typed on an English client
    const ids = searchCharacters("夏目", "en-US").map((r) => r.id);
    assert.ok(ids.includes("anan"));
  });

  it("should filter visible characters by query", () => {
    const ids = searchCharacters("anan", "en-US").map((r) => r.id);
    assert.ok(ids.includes("anan"));
    assert.ok(!ids.includes("ema"));
  });

  it("should localize display names", () => {
    const results = searchCharacters("anan", "ja");
    const anan = results.find((r) => r.id === "anan");
    assert.equal(anan?.displayName, "夏目アンアン");
  });

  it("should stay within Discord's 25-suggestion limit", () => {
    assert.ok(searchCharacters("", "en-US").length <= 25);
  });
});

describe("matchesHiddenCharacter", () => {
  it("should require at least 3 characters for ASCII queries", () => {
    assert.equal(matchesHiddenCharacter("yuki", "yu"), false);
    assert.equal(matchesHiddenCharacter("yuki", "yuk"), true);
  });

  it("should allow single-character CJK queries", () => {
    assert.equal(matchesHiddenCharacter("yuki", "雪"), true);
  });

  it("should not match empty or whitespace queries", () => {
    assert.equal(matchesHiddenCharacter("yuki", ""), false);
    assert.equal(matchesHiddenCharacter("yuki", "   "), false);
  });

  it("should not match unrelated queries", () => {
    assert.equal(matchesHiddenCharacter("yuki", "anan"), false);
    assert.equal(matchesHiddenCharacter("yuki", "夏目"), false);
  });
});
