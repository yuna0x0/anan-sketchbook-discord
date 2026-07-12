/**
 * Adjust/Effects Modal Builder Tests
 * Validates the modal structures built from stored sessions, including the
 * new Label / RadioGroup / CheckboxGroup modal components.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ComponentType } from "discord.js";

import {
  buildAdjustModal,
  buildEffectsModal,
} from "../../src/components/adjustModals.js";
import {
  buildImageActionsRow,
  isAdjustButtonCustomId,
  isEffectsButtonCustomId,
} from "../../src/components/actionRow.js";
import type { AdjustSession } from "../../src/services/adjustSessionStore.js";
import { GAMES } from "../../src/config/games/index.js";

// Placeholder Discord snowflake ID (not a real ID)
const USER_ID = "111111111111111111";

function sketchbookSession(withImage = false): AdjustSession {
  return {
    userId: USER_ID,
    params: {
      command: "sketchbook",
      text: "Hello",
      expression: "happy",
      align: "center",
      valign: "middle",
      useOverlay: true,
      wrapAlgorithm: "greedy",
      fontId: "miSans",
      filter: "none",
    },
    imageBuffer: withImage ? Buffer.from("fake") : undefined,
  };
}

function dialogueSession(): AdjustSession {
  const characterId = Object.keys(GAMES.manosaba.characters)[0];
  return {
    userId: USER_ID,
    params: {
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
    },
  };
}

/** Collect the inner component types of a modal's Label components */
function labelComponentTypes(modalJson: {
  components: { type: number; component?: { type: number } }[];
}): number[] {
  return modalJson.components
    .filter((c) => c.type === ComponentType.Label)
    .map((c) => (c as { component: { type: number } }).component.type);
}

describe("buildImageActionsRow", () => {
  it("should contain adjust, effects, and delete buttons", () => {
    const row = buildImageActionsRow(USER_ID, "en-US").toJSON();
    assert.equal(row.components.length, 3);

    const customIds = row.components.map(
      (c) => (c as { custom_id: string }).custom_id,
    );
    assert.ok(isAdjustButtonCustomId(customIds[0]));
    assert.ok(isEffectsButtonCustomId(customIds[1]));
    assert.ok(customIds.every((id) => id.endsWith(USER_ID)));
  });

  it("should localize button labels", () => {
    const row = buildImageActionsRow(USER_ID, "ja").toJSON();
    const labels = row.components.map((c) => (c as { label?: string }).label);
    assert.equal(labels[0], "調整");
    assert.equal(labels[1], "エフェクト");
  });

  it("should disable all buttons while regenerating", () => {
    const row = buildImageActionsRow(USER_ID, "en-US", {
      disabled: true,
    }).toJSON();
    for (const component of row.components) {
      assert.equal((component as { disabled?: boolean }).disabled, true);
    }
  });

  it("should leave buttons enabled by default", () => {
    const row = buildImageActionsRow(USER_ID, "en-US").toJSON();
    for (const component of row.components) {
      assert.ok(!(component as { disabled?: boolean }).disabled);
    }
  });
});

describe("modal custom ID nonce", () => {
  it("should produce a unique custom ID per open so clients cannot restore stale drafts", () => {
    const first = buildAdjustModal(sketchbookSession(), "en-US", "1000").toJSON();
    const second = buildAdjustModal(sketchbookSession(), "en-US", "1001").toJSON();

    assert.notEqual(first.custom_id, second.custom_id);
    assert.ok(first.custom_id.startsWith("adjust_modal:"));
    assert.ok(first.custom_id.endsWith(":1000"));

    const effects = buildEffectsModal(sketchbookSession(), "en-US", "1000").toJSON();
    assert.ok(effects.custom_id.startsWith("effects_modal:"));
    assert.ok(effects.custom_id.endsWith(":1000"));
  });
});

describe("buildAdjustModal", () => {
  it("sketchbook: should have text, expression, font, font size, and layout fields", () => {
    const modal = buildAdjustModal(sketchbookSession(), "en-US").toJSON();

    assert.equal(modal.components.length, 5);
    assert.deepEqual(labelComponentTypes(modal), [
      ComponentType.TextInput,
      ComponentType.StringSelect,
      ComponentType.StringSelect,
      ComponentType.TextInput,
      ComponentType.StringSelect,
    ]);
  });

  it("sketchbook: text is optional (text-or-image is enforced on submit)", () => {
    const textField = buildAdjustModal(sketchbookSession(false), "en-US")
      .toJSON()
      .components[0] as { component: { required?: boolean } };
    assert.equal(textField.component.required, false);
  });

  it("should mark the default font and layout options", () => {
    const modal = buildAdjustModal(sketchbookSession(), "en-US").toJSON();
    const fontSelect = (
      modal.components[2] as {
        component: { options: { value: string; description?: string }[] };
      }
    ).component;
    const layoutSelect = (
      modal.components[4] as {
        component: { options: { value: string; description?: string }[] };
      }
    ).component;

    const defaultFont = fontSelect.options.find((o) => o.value === "miSans");
    assert.equal(defaultFont?.description, "Default");
    const defaultLayout = layoutSelect.options.find(
      (o) => o.value === "center:middle",
    );
    assert.equal(defaultLayout?.description, "Default");
  });

  it("should describe the font size default", () => {
    const sketchbookModal = buildAdjustModal(sketchbookSession(), "en-US").toJSON();
    const sketchFontSize = sketchbookModal.components[3] as {
      description?: string;
    };
    assert.ok(sketchFontSize.description?.toLowerCase().includes("automatic"));

    const dialogueModal = buildAdjustModal(dialogueSession(), "en-US").toJSON();
    const dialogueFontSize = dialogueModal.components[3] as {
      description?: string;
    };
    assert.equal(dialogueFontSize.description, "Default: 72");
  });

  it("sketchbook: should mark the current expression as default", () => {
    const modal = buildAdjustModal(sketchbookSession(), "en-US").toJSON();
    const expressionSelect = (
      modal.components[1] as {
        component: { options: { value: string; default?: boolean }[] };
      }
    ).component;

    const defaults = expressionSelect.options.filter((o) => o.default);
    assert.equal(defaults.length, 1);
    assert.equal(defaults[0].value, "happy");
  });

  it("dialogue: should have text, expression, font, font size, and language fields", () => {
    const modal = buildAdjustModal(dialogueSession(), "en-US").toJSON();

    assert.equal(modal.components.length, 5);
    assert.deepEqual(labelComponentTypes(modal), [
      ComponentType.TextInput,
      ComponentType.StringSelect,
      ComponentType.StringSelect,
      ComponentType.TextInput,
      ComponentType.StringSelect,
    ]);
  });

  it("dialogue: should preselect the current name language", () => {
    const modal = buildAdjustModal(dialogueSession(), "en-US").toJSON();
    const languageSelect = (
      modal.components[4] as {
        component: {
          placeholder?: string;
          options: { value: string; default?: boolean }[];
        };
      }
    ).component;

    assert.equal(languageSelect.options.length, 3);
    const defaults = languageSelect.options.filter((o) => o.default);
    assert.equal(defaults.length, 1);
    assert.equal(defaults[0].value, "ja");
    assert.ok(languageSelect.placeholder, "placeholder shows current language");
  });

  it("should show the current value as select placeholder and preselect its option", () => {
    const modal = buildAdjustModal(sketchbookSession(), "en-US").toJSON();
    const expressionSelect = (
      modal.components[1] as {
        component: {
          placeholder?: string;
          options: { label: string; value: string; default?: boolean }[];
        };
      }
    ).component;

    // Session expression is "happy": placeholder covers clients that fail
    // to render the preselection flag
    assert.equal(expressionSelect.placeholder, "Happy");
    const current = expressionSelect.options.find((o) => o.value === "happy");
    assert.equal(current?.label, "Happy");
    assert.equal(current?.default, true);
  });

  it("dialogue: expression select should stay within the 25-option limit", () => {
    const modal = buildAdjustModal(dialogueSession(), "en-US").toJSON();
    const expressionSelect = (
      modal.components[1] as { component: { options: unknown[] } }
    ).component;
    assert.ok(expressionSelect.options.length <= 25);
  });
});

describe("buildEffectsModal", () => {
  it("sketchbook: should have filter, overlay, wrap, and fine-tune fields", () => {
    const modal = buildEffectsModal(sketchbookSession(), "en-US").toJSON();

    assert.equal(modal.components.length, 4);
    assert.deepEqual(labelComponentTypes(modal), [
      ComponentType.RadioGroup,
      ComponentType.RadioGroup,
      ComponentType.RadioGroup,
      ComponentType.TextInput,
    ]);
  });

  it("should preselect the current state on the radio options", () => {
    const modal = buildEffectsModal(sketchbookSession(), "en-US").toJSON();
    const filterRadio = (
      modal.components[0] as {
        component: { options: { value: string; default?: boolean }[] };
      }
    ).component;
    const overlayRadio = (
      modal.components[1] as {
        component: { options: { value: string; default?: boolean }[] };
      }
    ).component;

    assert.equal(
      filterRadio.options.find((o) => o.value === "none")?.default,
      true,
    );
    assert.equal(
      overlayRadio.options.find((o) => o.value === "on")?.default,
      true,
    );
    assert.ok(!overlayRadio.options.find((o) => o.value === "off")?.default);
  });

  it("should make all selects and radios optional so untouched fields keep current values", () => {
    const adjustModal = buildAdjustModal(sketchbookSession(), "en-US").toJSON();
    const effectsModal = buildEffectsModal(sketchbookSession(), "en-US").toJSON();
    for (const modal of [adjustModal, effectsModal]) {
      for (const label of modal.components) {
        const component = (
          label as { component: { type: number; required?: boolean } }
        ).component;
        if (
          component.type === ComponentType.StringSelect ||
          component.type === ComponentType.RadioGroup
        ) {
          assert.equal(
            component.required,
            false,
            "selects and radios must not be required",
          );
        }
      }
    }
  });

  it("sketchbook: should offer all five filters with the current as default", () => {
    const modal = buildEffectsModal(sketchbookSession(), "en-US").toJSON();
    const radio = (
      modal.components[0] as {
        component: { options: { value: string; default?: boolean }[] };
      }
    ).component;

    assert.equal(radio.options.length, 5);
    const defaults = radio.options.filter((o) => o.default);
    assert.equal(defaults.length, 1);
    assert.equal(defaults[0].value, "none");
  });

  it("sketchbook: should preselect toggle radios from the current state", () => {
    const modal = buildEffectsModal(sketchbookSession(), "en-US").toJSON();
    const overlayRadio = (
      modal.components[1] as {
        component: { options: { value: string; default?: boolean }[] };
      }
    ).component;
    const wrapRadio = (
      modal.components[2] as {
        component: { options: { value: string; default?: boolean }[] };
      }
    ).component;

    assert.equal(
      overlayRadio.options.find((o) => o.value === "on")?.default,
      true,
    );
    assert.equal(
      wrapRadio.options.find((o) => o.value === "off")?.default,
      true,
    );
  });

  it("dialogue: should have filter, stretch, highlight, background, and fine-tune fields", () => {
    const modal = buildEffectsModal(dialogueSession(), "en-US").toJSON();

    assert.equal(modal.components.length, 5);
    assert.deepEqual(labelComponentTypes(modal), [
      ComponentType.RadioGroup,
      ComponentType.RadioGroup,
      ComponentType.RadioGroup,
      ComponentType.TextInput,
      ComponentType.TextInput,
    ]);
  });

  it("dialogue: should pre-fill the background ID when a stock background is used", () => {
    const session = dialogueSession();
    if (session.params.command === "dialogue") {
      session.params.backgroundId = "bg_test";
    }
    const modal = buildEffectsModal(session, "en-US").toJSON();
    const background = (
      modal.components[3] as {
        component: { value?: string; placeholder?: string };
      }
    ).component;
    assert.equal(background.value, "bg_test");
    assert.equal(background.placeholder, "bg_001_001");
  });

  it("should hint the help command in the fine-tune field description", () => {
    const modal = buildEffectsModal(sketchbookSession(), "en-US").toJSON();
    const fineTune = modal.components[3] as { description?: string };
    assert.ok(fineTune.description?.includes("help"));
  });

  it("should pre-fill the fine-tune field from stored adjustments and filter settings", () => {
    const session = sketchbookSession();
    session.params.adjustments = {
      brightness: 1.5,
      rotate: 90,
      tint: { r: 255, g: 0, b: 0, alpha: 0.4 },
    };
    session.params.filterSettings = { dot_size: 12 };
    const modal = buildEffectsModal(session, "en-US").toJSON();
    const fineTune = (
      modal.components[3] as { component: { value?: string } }
    ).component;
    assert.equal(
      fineTune.value,
      "brightness=1.5 rotate=90 tint=ff000066 dot_size=12",
    );
  });

  it("should mark the default filter option", () => {
    const modal = buildEffectsModal(sketchbookSession(), "en-US").toJSON();
    const radio = (
      modal.components[0] as {
        component: { options: { value: string; description?: string }[] };
      }
    ).component;

    const none = radio.options.find((o) => o.value === "none");
    assert.equal(none?.description, "Default");
    const paper = radio.options.find((o) => o.value === "paper_texture");
    assert.equal(paper?.description, undefined);
  });

  it("should mark toggle radio defaults", () => {
    const modal = buildEffectsModal(sketchbookSession(), "en-US").toJSON();
    const overlayRadio = (
      modal.components[1] as {
        component: { options: { value: string; description?: string }[] };
      }
    ).component;
    const wrapRadio = (
      modal.components[2] as {
        component: { options: { value: string; description?: string }[] };
      }
    ).component;

    assert.equal(
      overlayRadio.options.find((o) => o.value === "on")?.description,
      "Default",
    );
    assert.equal(
      wrapRadio.options.find((o) => o.value === "off")?.description,
      "Default",
    );
  });

});
