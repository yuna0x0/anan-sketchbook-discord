/**
 * Adjust / Effects Modals
 * Builds the modals opened from the buttons on generated image messages, and
 * handles their submissions by re-rendering the image in place.
 *
 * Adjust: content and typography (text, expression, font, font size, layout).
 * Effects: post-processing (filter) and rendering toggles.
 *
 * Modals are pre-filled from the stored session; submissions update the
 * session and regenerate via the shared generation service.
 */

import {
  ModalBuilder,
  LabelBuilder,
  TextInputBuilder,
  TextInputStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  RadioGroupBuilder,
  MessageFlags,
  Locale,
} from "discord.js";
import type { ModalSubmitInteraction } from "discord.js";
import { isDeepStrictEqual } from "node:util";
import {
  getResponseMessage,
  getSketchbookMessage,
  getDialogueMessage,
  getAdjustUILabel,
  type AdjustUILabelKey,
  getFilterName,
  getDefaultValueLabel,
  getFineTuneHelpMessage,
  getFineTuneInvalidMessage,
  getLocalizedExpressionName,
  EXPRESSION_DISPLAY_NAME_LOCALIZATIONS,
  ALIGN_CHOICE_LOCALIZATIONS,
  VALIGN_CHOICE_LOCALIZATIONS,
  FONT_NAME_LOCALIZATIONS,
  STRETCH_MODE_LOCALIZATIONS,
  LANGUAGE_CHOICE_LOCALIZATIONS,
  resolveLocale,
} from "../locales/index.js";
import { FONTS, FontId } from "../config/fonts.js";
import {
  EmotionType,
  EmotionTypeValue,
  ExpressionOption,
  getRandomEmotion,
  SKETCHBOOK_DEFAULT_FONT,
} from "../config/sketchbook/index.js";
import { getGame } from "../config/games/index.js";
import { getExpressionNumber } from "../config/games/helpers.js";
import type { NameConfigLocale } from "../config/games/types.js";
import { STRETCH_MODES, StretchMode } from "../config/dialogue/index.js";
import {
  ImageFilter,
  ImageFilterId,
  isImageFilterId,
  FilterSettings,
  parseFilterSettings,
  serializeFilterSettings,
} from "../utils/imageFilters.js";
import {
  ImageAdjustments,
  ADJUSTMENT_LIMITS,
  parseAdjustments,
  serializeAdjustments,
} from "../utils/imageAdjustments.js";
import { splitKeyValueTokens } from "../utils/keyValueParser.js";
import type { HAlign, VAlign } from "../utils/sketchbookGenerator.js";
import {
  renderGeneration,
  buildGenerationAttachment,
  isOutputFormat,
  type OutputFormat,
} from "../services/generationService.js";
import {
  adjustSessions,
  AdjustSession,
} from "../services/adjustSessionStore.js";
import {
  ADJUST_MODAL_PREFIX,
  EFFECTS_MODAL_PREFIX,
  createModalCustomId,
  buildImageActionsRow,
} from "./actionRow.js";
import { getGuildDefaultLanguage } from "../database/repositories/guildSettings.js";

// Field custom IDs within the modals
const FIELD = {
  TEXT: "text",
  EXPRESSION: "expression",
  FONT: "font",
  FONT_SIZE: "font_size",
  LAYOUT: "layout",
  FILTER: "filter",
  OVERLAY: "overlay",
  WRAP: "wrap",
  HIGHLIGHT: "highlight",
  STRETCH: "stretch",
  LANGUAGE: "language",
  BACKGROUND: "background",
  FINE_TUNE: "fine_tune",
} as const;

// Toggle radio values
const TOGGLE_ON = "on";
const TOGGLE_OFF = "off";

// Abort a regeneration that takes too long so the message never stays stuck
// in the disabled "generating" state
const RENDER_TIMEOUT_MS = 30_000;

class RenderTimeoutError extends Error {
  constructor() {
    super("Render timed out");
  }
}

// Syntax examples shown as placeholders (literal, not translated)
const FINE_TUNE_PLACEHOLDER = "brightness=1.2 hue=90 dot_size=12";
const BACKGROUND_ID_PLACEHOLDER = "bg_001_001";

// Inputs that request the help card instead of values
const HELP_QUERIES = new Set(["help", "?", "？"]);

function isHelpQuery(input: string): boolean {
  return HELP_QUERIES.has(input.trim().toLowerCase());
}

// Sketchbook font size cap bounds (dialogue uses its own fixed-size bounds)
const SKETCHBOOK_FONT_SIZE_MIN = 8;
const SKETCHBOOK_FONT_SIZE_MAX = 160;
const DIALOGUE_FONT_SIZE_MIN = 24;
const DIALOGUE_FONT_SIZE_MAX = 120;

const HALIGNS: HAlign[] = ["left", "center", "right"];
const VALIGNS: VAlign[] = ["top", "middle", "bottom"];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Pick a localized string out of a LocalizationMap-style record
 * (values may be null), falling back to English, then to the given fallback.
 */
function pickLocalized(
  record: Record<string, string | null | undefined> | undefined,
  locale: string,
  fallback: string,
): string {
  if (!record) {
    return fallback;
  }
  return record[locale] ?? record[Locale.EnglishUS] ?? fallback;
}

// =============================================================================
// Modal builders
// =============================================================================

function buildFontSelect(
  current: FontId,
  defaultFontId: FontId,
  locale: string,
): LabelBuilder {
  const currentName = pickLocalized(
    FONT_NAME_LOCALIZATIONS[current],
    locale,
    current,
  );
  const select = new StringSelectMenuBuilder()
    .setCustomId(FIELD.FONT)
    // Optional: an untouched select submits nothing and keeps the setting
    .setRequired(false)
    // The placeholder shows the current value while no selection is rendered
    .setPlaceholder(currentName)
    .addOptions(
      Object.entries(FONTS).map(([id, info]) => {
        const option = new StringSelectMenuOptionBuilder()
          .setLabel(
            pickLocalized(FONT_NAME_LOCALIZATIONS[id], locale, info.name),
          )
          .setValue(id)
          .setDefault(id === current);
        if (id === defaultFontId) {
          option.setDescription(getAdjustUILabel("defaultMarker", locale));
        }
        return option;
      }),
    );

  return new LabelBuilder()
    .setLabel(getAdjustUILabel("fontLabel", locale))
    .setStringSelectMenuComponent(select);
}

function buildFilterRadio(
  current: ImageFilterId,
  locale: string,
): LabelBuilder {
  const radio = new RadioGroupBuilder()
    .setCustomId(FIELD.FILTER)
    .setRequired(false)
    .setOptions(
      Object.values(ImageFilter).map((id) => ({
        label: getFilterName(id, locale),
        value: id,
        default: id === current,
        ...(id === ImageFilter.NONE && {
          description: getAdjustUILabel("defaultMarker", locale),
        }),
      })),
    );

  return new LabelBuilder()
    .setLabel(getAdjustUILabel("filterLabel", locale))
    .setRadioGroupComponent(radio);
}

/**
 * A boolean setting as an On/Off radio group.
 * The current state carries the preselection flag; left untouched it submits
 * no value, which the handler treats as "keep the current setting".
 */
function buildToggleRadio(
  customId: string,
  labelKey: AdjustUILabelKey,
  current: boolean,
  defaultOn: boolean,
  locale: string,
): LabelBuilder {
  const onLabel = getAdjustUILabel("onLabel", locale);
  const offLabel = getAdjustUILabel("offLabel", locale);
  const defaultMarker = getAdjustUILabel("defaultMarker", locale);

  const radio = new RadioGroupBuilder()
    .setCustomId(customId)
    .setRequired(false)
    .setOptions([
      {
        label: onLabel,
        value: TOGGLE_ON,
        default: current,
        ...(defaultOn && { description: defaultMarker }),
      },
      {
        label: offLabel,
        value: TOGGLE_OFF,
        default: !current,
        ...(!defaultOn && { description: defaultMarker }),
      },
    ]);

  return new LabelBuilder()
    .setLabel(getAdjustUILabel(labelKey, locale))
    .setRadioGroupComponent(radio);
}

/**
 * One key=value field carrying both fine-tune adjustments and per-filter
 * settings (their keys are disjoint); modals cap at 5 top-level components,
 * so the two syntaxes share a single input
 */
function buildFineTuneField(
  adjustments: ImageAdjustments | undefined,
  settings: FilterSettings | undefined,
  outputFormat: OutputFormat | undefined,
  locale: string,
): LabelBuilder {
  const input = new TextInputBuilder()
    .setCustomId(FIELD.FINE_TUNE)
    .setStyle(TextInputStyle.Short)
    .setMaxLength(300)
    .setRequired(false)
    .setPlaceholder(FINE_TUNE_PLACEHOLDER);
  const serialized = [
    serializeAdjustments(adjustments),
    serializeFilterSettings(settings),
    outputFormat ? `format=${outputFormat}` : "",
  ]
    .filter((part) => part.length > 0)
    .join(" ");
  if (serialized) {
    input.setValue(serialized);
  }

  return new LabelBuilder()
    .setLabel(getAdjustUILabel("fineTuneLabel", locale))
    .setDescription(getAdjustUILabel("keyValueFieldHint", locale))
    .setTextInputComponent(input);
}

/**
 * Parse the combined fine-tune input, routing each token to the adjustments
 * parser, the filter-settings parser, or the output-format setting by key
 */
function parseCombinedFineTune(input: string): {
  adjustments?: ImageAdjustments;
  settings?: FilterSettings;
  outputFormat?: OutputFormat;
  invalidTokens: string[];
} {
  const adjustmentTokens: string[] = [];
  const settingTokens: string[] = [];
  let outputFormat: OutputFormat | undefined;
  const formatInvalid: string[] = [];
  for (const token of splitKeyValueTokens(input)) {
    const key = token.split("=")[0]?.toLowerCase() ?? "";
    if (key === "tint" || key in ADJUSTMENT_LIMITS) {
      adjustmentTokens.push(token);
    } else if (key === "format") {
      // jpeg is accepted as an alias for jpg
      const raw = token.split("=")[1]?.toLowerCase() ?? "";
      const value = raw === "jpeg" ? "jpg" : raw;
      if (isOutputFormat(value)) {
        outputFormat = value;
      } else {
        formatInvalid.push(token);
      }
    } else {
      settingTokens.push(token);
    }
  }

  const parsedAdjustments = parseAdjustments(adjustmentTokens.join(" "));
  const parsedSettings = parseFilterSettings(settingTokens.join(" "));
  return {
    adjustments: parsedAdjustments.adjustments,
    settings: parsedSettings.settings,
    outputFormat,
    invalidTokens: [
      ...parsedAdjustments.invalidTokens,
      ...parsedSettings.invalidTokens,
      ...formatInvalid,
    ],
  };
}

function buildSketchbookAdjustModal(
  session: AdjustSession,
  locale: string,
  nonce: string,
): ModalBuilder {
  const params = session.params;
  if (params.command !== "sketchbook") {
    throw new Error("Expected sketchbook params");
  }

  const textInput = new TextInputBuilder()
    .setCustomId(FIELD.TEXT)
    .setStyle(TextInputStyle.Paragraph)
    .setMaxLength(1000)
    // Optional here; the submit handler enforces "text or image"
    .setRequired(false);
  if (params.text) {
    textInput.setValue(params.text);
  }
  const textLabel = new LabelBuilder()
    .setLabel(getAdjustUILabel("textLabel", locale))
    .setTextInputComponent(textInput);

  const currentExpressionName = pickLocalized(
    EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[params.expression],
    locale,
    params.expression,
  );
  const expressionSelect = new StringSelectMenuBuilder()
    .setCustomId(FIELD.EXPRESSION)
    .setRequired(false)
    .setPlaceholder(currentExpressionName)
    .addOptions(
      Object.values(EmotionType).map((emotion) => {
        const option = new StringSelectMenuOptionBuilder()
          .setLabel(
            pickLocalized(EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[emotion], locale, emotion),
          )
          .setValue(emotion)
          .setDefault(emotion === params.expression);
        if (emotion === EmotionType.NORMAL) {
          option.setDescription(getAdjustUILabel("defaultMarker", locale));
        }
        return option;
      }),
    )
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel(
          pickLocalized(EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.RANDOM], locale, ExpressionOption.RANDOM),
        )
        .setValue(ExpressionOption.RANDOM),
    );
  const expressionLabel = new LabelBuilder()
    .setLabel(getAdjustUILabel("expressionLabel", locale))
    .setStringSelectMenuComponent(expressionSelect);

  const fontSizeInput = new TextInputBuilder()
    .setCustomId(FIELD.FONT_SIZE)
    .setStyle(TextInputStyle.Short)
    .setMaxLength(3)
    .setRequired(false)
    .setPlaceholder(
      `${SKETCHBOOK_FONT_SIZE_MIN}-${SKETCHBOOK_FONT_SIZE_MAX}`,
    );
  if (params.maxFontHeight !== undefined) {
    fontSizeInput.setValue(String(params.maxFontHeight));
  }
  const fontSizeLabel = new LabelBuilder()
    .setLabel(getAdjustUILabel("fontSizeCapLabel", locale))
    .setDescription(getAdjustUILabel("fontSizeAutoDefault", locale))
    .setTextInputComponent(fontSizeInput);

  const layoutName = (align: HAlign, valign: VAlign) => {
    const alignName = pickLocalized(ALIGN_CHOICE_LOCALIZATIONS[align], locale, align);
    const valignName = pickLocalized(VALIGN_CHOICE_LOCALIZATIONS[valign], locale, valign);
    return `${alignName} · ${valignName}`;
  };
  const layoutSelect = new StringSelectMenuBuilder()
    .setCustomId(FIELD.LAYOUT)
    .setRequired(false)
    .setPlaceholder(layoutName(params.align, params.valign));
  for (const align of HALIGNS) {
    for (const valign of VALIGNS) {
      const isCurrent = align === params.align && valign === params.valign;
      const option = new StringSelectMenuOptionBuilder()
        .setLabel(layoutName(align, valign))
        .setValue(`${align}:${valign}`)
        .setDefault(isCurrent);
      if (align === "center" && valign === "middle") {
        option.setDescription(getAdjustUILabel("defaultMarker", locale));
      }
      layoutSelect.addOptions(option);
    }
  }
  const layoutLabel = new LabelBuilder()
    .setLabel(getAdjustUILabel("layoutLabel", locale))
    .setStringSelectMenuComponent(layoutSelect);

  return new ModalBuilder()
    .setCustomId(createModalCustomId(ADJUST_MODAL_PREFIX, session.userId, nonce))
    .setTitle(getAdjustUILabel("adjustModalTitle", locale))
    .addLabelComponents(
      textLabel,
      expressionLabel,
      buildFontSelect(params.fontId, SKETCHBOOK_DEFAULT_FONT, locale),
      fontSizeLabel,
      layoutLabel,
    );
}

function buildDialogueAdjustModal(
  session: AdjustSession,
  locale: string,
  nonce: string,
): ModalBuilder {
  const params = session.params;
  if (params.command !== "dialogue") {
    throw new Error("Expected dialogue params");
  }

  const textInput = new TextInputBuilder()
    .setCustomId(FIELD.TEXT)
    .setStyle(TextInputStyle.Paragraph)
    .setMaxLength(1000)
    .setRequired(true)
    .setValue(params.text);
  const textLabel = new LabelBuilder()
    .setLabel(getAdjustUILabel("textLabel", locale))
    .setTextInputComponent(textInput);

  // Expressions of the current character (modal selects have no autocomplete);
  // capped to Discord's 25-option limit with the current one always included
  const game = getGame(params.gameId);
  const character = game.characters[params.characterId];
  const expressionIds = character.expressions.slice(0, 24);
  if (
    !expressionIds.includes(params.expressionId) &&
    character.expressions.includes(params.expressionId)
  ) {
    expressionIds[expressionIds.length - 1] = params.expressionId;
  }
  const expressionSelect = new StringSelectMenuBuilder()
    .setCustomId(FIELD.EXPRESSION)
    .setRequired(false)
    .setPlaceholder(
      getLocalizedExpressionName(params.gameId, params.expressionId, locale),
    )
    .addOptions(
      expressionIds.map((id) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(getLocalizedExpressionName(params.gameId, id, locale))
          .setValue(id)
          .setDefault(id === params.expressionId),
      ),
    )
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel(
          pickLocalized(EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.RANDOM], locale, ExpressionOption.RANDOM),
        )
        .setValue("_random_"),
    );
  const expressionLabel = new LabelBuilder()
    .setLabel(getAdjustUILabel("expressionLabel", locale))
    .setStringSelectMenuComponent(expressionSelect);

  const fontSizeInput = new TextInputBuilder()
    .setCustomId(FIELD.FONT_SIZE)
    .setStyle(TextInputStyle.Short)
    .setMaxLength(3)
    .setRequired(false)
    .setPlaceholder(`${DIALOGUE_FONT_SIZE_MIN}-${DIALOGUE_FONT_SIZE_MAX}`)
    .setValue(String(params.fontSize));
  const fontSizeLabel = new LabelBuilder()
    .setLabel(getAdjustUILabel("fontSizeLabel", locale))
    .setDescription(
      getDefaultValueLabel(locale, String(game.layout.defaultFontSize)),
    )
    .setTextInputComponent(fontSizeInput);

  const currentLanguageName = pickLocalized(
    LANGUAGE_CHOICE_LOCALIZATIONS[params.nameLocale],
    locale,
    params.nameLocale,
  );
  const languageSelect = new StringSelectMenuBuilder()
    .setCustomId(FIELD.LANGUAGE)
    .setRequired(false)
    .setPlaceholder(currentLanguageName)
    .addOptions(
      game.supportedNameLocales.map((nameLocale) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(
            pickLocalized(
              LANGUAGE_CHOICE_LOCALIZATIONS[nameLocale],
              locale,
              nameLocale,
            ),
          )
          .setValue(nameLocale)
          .setDefault(nameLocale === params.nameLocale),
      ),
    );
  const languageLabel = new LabelBuilder()
    .setLabel(getAdjustUILabel("languageLabel", locale))
    .setStringSelectMenuComponent(languageSelect);

  return new ModalBuilder()
    .setCustomId(createModalCustomId(ADJUST_MODAL_PREFIX, session.userId, nonce))
    .setTitle(getAdjustUILabel("adjustModalTitle", locale))
    .addLabelComponents(
      textLabel,
      expressionLabel,
      buildFontSelect(params.fontId, game.fonts.textDefaultFont, locale),
      fontSizeLabel,
      languageLabel,
    );
}

function buildSketchbookEffectsModal(
  session: AdjustSession,
  locale: string,
  nonce: string,
): ModalBuilder {
  const params = session.params;
  if (params.command !== "sketchbook") {
    throw new Error("Expected sketchbook params");
  }

  return new ModalBuilder()
    .setCustomId(createModalCustomId(EFFECTS_MODAL_PREFIX, session.userId, nonce))
    .setTitle(getAdjustUILabel("effectsModalTitle", locale))
    .addLabelComponents(
      buildFilterRadio(params.filter, locale),
      buildToggleRadio(
        FIELD.OVERLAY,
        "overlayOption",
        params.useOverlay,
        true,
        locale,
      ),
      buildToggleRadio(
        FIELD.WRAP,
        "wrapOption",
        params.wrapAlgorithm === "knuth_plass",
        false,
        locale,
      ),
      buildFineTuneField(params.adjustments, params.filterSettings, params.outputFormat, locale),
    );
}

function buildDialogueEffectsModal(
  session: AdjustSession,
  locale: string,
  nonce: string,
): ModalBuilder {
  const params = session.params;
  if (params.command !== "dialogue") {
    throw new Error("Expected dialogue params");
  }

  const stretchRadio = new RadioGroupBuilder()
    .setCustomId(FIELD.STRETCH)
    .setRequired(false)
    .setOptions(
      Object.entries(STRETCH_MODES).map(([id, name]) => ({
        label: pickLocalized(STRETCH_MODE_LOCALIZATIONS[id], locale, name),
        value: id,
        default: id === params.stretchMode,
        ...(id === "zoom_x" && {
          description: getAdjustUILabel("defaultMarker", locale),
        }),
      })),
    );
  const stretchLabel = new LabelBuilder()
    .setLabel(getAdjustUILabel("stretchLabel", locale))
    .setRadioGroupComponent(stretchRadio);

  // Stock background by ID (58 backgrounds exceed a select's 25-option cap,
  // so a text input carries the same IDs the slash autocomplete shows)
  const backgroundInput = new TextInputBuilder()
    .setCustomId(FIELD.BACKGROUND)
    .setStyle(TextInputStyle.Short)
    .setMaxLength(100)
    .setRequired(false)
    .setPlaceholder(BACKGROUND_ID_PLACEHOLDER);
  if (params.backgroundId) {
    backgroundInput.setValue(params.backgroundId);
  }
  const backgroundLabel = new LabelBuilder()
    .setLabel(getAdjustUILabel("backgroundIdLabel", locale))
    .setTextInputComponent(backgroundInput);

  return new ModalBuilder()
    .setCustomId(createModalCustomId(EFFECTS_MODAL_PREFIX, session.userId, nonce))
    .setTitle(getAdjustUILabel("effectsModalTitle", locale))
    .addLabelComponents(
      buildFilterRadio(params.filter, locale),
      stretchLabel,
      buildToggleRadio(
        FIELD.HIGHLIGHT,
        "highlightOption",
        params.highlightBrackets,
        true,
        locale,
      ),
      backgroundLabel,
      buildFineTuneField(params.adjustments, params.filterSettings, params.outputFormat, locale),
    );
}

export function buildAdjustModal(
  session: AdjustSession,
  locale: string,
  nonce = "0",
): ModalBuilder {
  return session.params.command === "sketchbook"
    ? buildSketchbookAdjustModal(session, locale, nonce)
    : buildDialogueAdjustModal(session, locale, nonce);
}

export function buildEffectsModal(
  session: AdjustSession,
  locale: string,
  nonce = "0",
): ModalBuilder {
  return session.params.command === "sketchbook"
    ? buildSketchbookEffectsModal(session, locale, nonce)
    : buildDialogueEffectsModal(session, locale, nonce);
}

// =============================================================================
// Submit handlers
// =============================================================================

/**
 * Common session/authorization preamble for modal submissions.
 * Returns null (after replying) when the submission cannot be processed.
 */
async function resolveSubmission(
  interaction: ModalSubmitInteraction,
): Promise<{ messageId: string; session: AdjustSession } | null> {
  if (!interaction.isFromMessage()) {
    return null;
  }

  const messageId = interaction.message.id;
  const session = adjustSessions.get(messageId);
  if (!session) {
    await interaction.reply({
      content: getResponseMessage("sessionExpired", interaction.locale),
      flags: MessageFlags.Ephemeral,
    });
    return null;
  }
  if (interaction.user.id !== session.userId) {
    await interaction.reply({
      content: getResponseMessage("actionDenied", interaction.locale),
      flags: MessageFlags.Ephemeral,
    });
    return null;
  }

  return { messageId, session };
}

/**
 * Whether two parameter sets are effectively identical
 * (undefined-valued keys and key order do not count as differences)
 */
function paramsUnchanged(
  a: AdjustSession["params"],
  b: AdjustSession["params"],
): boolean {
  return isDeepStrictEqual(
    JSON.parse(JSON.stringify(a)),
    JSON.parse(JSON.stringify(b)),
  );
}

/**
 * Re-render the image with new params and update the message in place.
 * The session is only updated after a successful render; a submission that
 * changes nothing is acknowledged without re-rendering.
 * `newImageBuffer` replaces the stored attachment image (the sketchbook
 * content image / dialogue custom background): undefined keeps it, null
 * clears it, a Buffer replaces it.
 */
async function regenerate(
  interaction: ModalSubmitInteraction,
  messageId: string,
  session: AdjustSession,
  newParams: AdjustSession["params"],
  newImageBuffer?: Buffer | null,
): Promise<void> {
  if (!interaction.isFromMessage()) {
    return;
  }

  const imageChanged = newImageBuffer !== undefined;
  if (!imageChanged && paramsUnchanged(session.params, newParams)) {
    // Nothing changed: the image already reflects these settings
    await interaction.deferUpdate();
    return;
  }
  const effectiveImageBuffer = imageChanged
    ? (newImageBuffer ?? undefined)
    : session.imageBuffer;

  // Locale for public message content follows the guild default when set
  const guildDefaultLanguage = interaction.guildId
    ? getGuildDefaultLanguage(interaction.guildId)
    : null;
  const publicLocale = resolveLocale(
    interaction.locale || Locale.EnglishUS,
    guildDefaultLanguage,
    true,
  );

  await interaction.deferUpdate();

  try {
    // Show a progress notice above the current image and disable the buttons
    // while rendering; editing without files keeps the existing attachment
    await interaction.editReply({
      content: getResponseMessage("generating", publicLocale),
      components: [
        buildImageActionsRow(session.userId, interaction.locale, {
          disabled: true,
        }),
      ],
    });

    const imageBuffer = await renderWithTimeout(
      newParams,
      effectiveImageBuffer,
    );
    const attachment = buildGenerationAttachment(
      newParams,
      imageBuffer,
      publicLocale,
    );
    await interaction.editReply({
      content: null,
      files: [attachment],
      components: [buildImageActionsRow(session.userId, interaction.locale)],
    });

    session.params = newParams;
    if (imageChanged) {
      session.imageBuffer = newImageBuffer ?? undefined;
    }
    adjustSessions.set(messageId, session);
  } catch (error) {
    console.error("Error regenerating image from modal submit:", error);
    // Best effort: clear the progress notice and re-enable the buttons
    try {
      await interaction.editReply({
        content: null,
        components: [buildImageActionsRow(session.userId, interaction.locale)],
      });
    } catch {
      // The message may be gone; the ephemeral error below still informs the user
    }
    const messageKey =
      error instanceof RenderTimeoutError ? "renderTimeout" : "genericError";
    await interaction.followUp({
      content: getResponseMessage(messageKey, interaction.locale),
      flags: MessageFlags.Ephemeral,
    });
  }
}

/**
 * Render with a timeout so the message cannot stay stuck in the disabled
 * "generating" state (the underlying render keeps running but its result is
 * discarded)
 */
function renderWithTimeout(
  params: AdjustSession["params"],
  imageBuffer: Buffer | undefined,
): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new RenderTimeoutError()),
      RENDER_TIMEOUT_MS,
    );
    renderGeneration(params, imageBuffer).then(
      (buffer) => {
        clearTimeout(timer);
        resolve(buffer);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export async function handleAdjustModalSubmit(
  interaction: ModalSubmitInteraction,
): Promise<void> {
  const resolved = await resolveSubmission(interaction);
  if (!resolved) {
    return;
  }
  const { messageId, session } = resolved;
  const fields = interaction.fields;

  if (session.params.command === "sketchbook") {
    const params = { ...session.params };

    const text = fields.getTextInputValue(FIELD.TEXT).trim();
    if (!text && !session.imageBuffer) {
      await interaction.reply({
        content: getSketchbookMessage("noInput", interaction.locale),
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    params.text = text || undefined;

    const expressionValue = fields.getStringSelectValues(FIELD.EXPRESSION)[0];
    if (expressionValue === ExpressionOption.RANDOM) {
      params.expression = getRandomEmotion();
    } else if (
      Object.values(EmotionType).includes(expressionValue as EmotionTypeValue)
    ) {
      params.expression = expressionValue as EmotionTypeValue;
    }

    const fontValue = fields.getStringSelectValues(FIELD.FONT)[0];
    if (fontValue in FONTS) {
      params.fontId = fontValue as FontId;
    }

    const sizeRaw = fields.getTextInputValue(FIELD.FONT_SIZE).trim();
    if (sizeRaw === "") {
      params.maxFontHeight = undefined;
    } else {
      const size = parseInt(sizeRaw, 10);
      if (Number.isFinite(size)) {
        params.maxFontHeight = clamp(
          size,
          SKETCHBOOK_FONT_SIZE_MIN,
          SKETCHBOOK_FONT_SIZE_MAX,
        );
      }
    }

    const layoutValue = fields.getStringSelectValues(FIELD.LAYOUT)[0] ?? "";
    const [align, valign] = layoutValue.split(":");
    if (
      HALIGNS.includes(align as HAlign) &&
      VALIGNS.includes(valign as VAlign)
    ) {
      params.align = align as HAlign;
      params.valign = valign as VAlign;
    }

    await regenerate(interaction, messageId, session, params);
    return;
  }

  const params = { ...session.params };
  const game = getGame(params.gameId);
  const character = game.characters[params.characterId];

  const text = fields.getTextInputValue(FIELD.TEXT).trim();
  if (text) {
    params.text = text;
  }

  const expressionValue = fields.getStringSelectValues(FIELD.EXPRESSION)[0];
  if (expressionValue === "_random_") {
    const randomIndex = Math.floor(
      Math.random() * character.expressions.length,
    );
    params.expressionId = character.expressions[randomIndex];
  } else if (
    expressionValue &&
    getExpressionNumber(character, expressionValue) !== undefined
  ) {
    params.expressionId = expressionValue;
  }

  const fontValue = fields.getStringSelectValues(FIELD.FONT)[0];
  if (fontValue in FONTS) {
    params.fontId = fontValue as FontId;
  }

  const sizeRaw = fields.getTextInputValue(FIELD.FONT_SIZE).trim();
  if (sizeRaw !== "") {
    const size = parseInt(sizeRaw, 10);
    if (Number.isFinite(size)) {
      params.fontSize = clamp(
        size,
        DIALOGUE_FONT_SIZE_MIN,
        DIALOGUE_FONT_SIZE_MAX,
      );
    }
  }

  const languageValue = fields.getStringSelectValues(FIELD.LANGUAGE)[0];
  if (
    languageValue &&
    game.supportedNameLocales.includes(languageValue as NameConfigLocale)
  ) {
    params.nameLocale = languageValue as NameConfigLocale;
  }

  await regenerate(interaction, messageId, session, params);
}

export async function handleEffectsModalSubmit(
  interaction: ModalSubmitInteraction,
): Promise<void> {
  const resolved = await resolveSubmission(interaction);
  if (!resolved) {
    return;
  }
  const { messageId, session } = resolved;
  const fields = interaction.fields;

  const filterValue = fields.getRadioGroup(FIELD.FILTER);
  const fineTuneRaw = fields.getTextInputValue(FIELD.FINE_TUNE);

  // Typing "help" in the fine-tune field requests the option reference card;
  // the field keeps its previous values while everything else still applies
  const helpRequested = isHelpQuery(fineTuneRaw);
  const parsed = helpRequested
    ? {
        adjustments: session.params.adjustments,
        settings: session.params.filterSettings,
        outputFormat: session.params.outputFormat,
        invalidTokens: [],
      }
    : parseCombinedFineTune(fineTuneRaw);

  if (parsed.invalidTokens.length > 0) {
    await interaction.reply({
      content: getFineTuneInvalidMessage(
        interaction.locale,
        parsed.invalidTokens,
      ),
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  const adjustments = parsed.adjustments;

  if (session.params.command === "sketchbook") {
    const params = { ...session.params };
    if (filterValue && isImageFilterId(filterValue)) {
      params.filter = filterValue;
    }
    // Untouched toggle radios submit no value and keep the current setting
    const overlayValue = fields.getRadioGroup(FIELD.OVERLAY);
    if (overlayValue) {
      params.useOverlay = overlayValue === TOGGLE_ON;
    }
    const wrapValue = fields.getRadioGroup(FIELD.WRAP);
    if (wrapValue) {
      params.wrapAlgorithm =
        wrapValue === TOGGLE_ON ? "knuth_plass" : "greedy";
    }
    params.adjustments = adjustments;
    params.filterSettings = parsed.settings;
    params.outputFormat = parsed.outputFormat;

    await regenerate(interaction, messageId, session, params);
    await sendHelpFollowUpIfRequested(interaction, helpRequested);
    return;
  }

  const params = { ...session.params };
  if (filterValue && isImageFilterId(filterValue)) {
    params.filter = filterValue;
  }
  const stretchValue = fields.getRadioGroup(FIELD.STRETCH);
  if (stretchValue && stretchValue in STRETCH_MODES) {
    params.stretchMode = stretchValue as StretchMode;
  }
  // Untouched toggle radios submit no value and keep the current setting
  const highlightValue = fields.getRadioGroup(FIELD.HIGHLIGHT);
  if (highlightValue) {
    params.highlightBrackets = highlightValue === TOGGLE_ON;
  }
  params.adjustments = adjustments;
  params.filterSettings = parsed.settings;
  params.outputFormat = parsed.outputFormat;

  // A valid stock background ID switches away from any custom background;
  // empty input keeps the current background
  let newImageBuffer: Buffer | null | undefined;
  const backgroundRaw = fields.getTextInputValue(FIELD.BACKGROUND).trim();
  if (backgroundRaw && backgroundRaw !== params.backgroundId) {
    if (!getGame(params.gameId).backgrounds[backgroundRaw]) {
      await interaction.reply({
        content: getDialogueMessage("unknownBackground", interaction.locale, {
          backgroundId: backgroundRaw,
        }),
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    params.backgroundId = backgroundRaw;
    if (session.imageBuffer) {
      newImageBuffer = null;
    }
  }

  await regenerate(interaction, messageId, session, params, newImageBuffer);
  await sendHelpFollowUpIfRequested(interaction, helpRequested);
}

/**
 * Send the option reference card after a help request, noting that the rest
 * of the submission was applied
 */
async function sendHelpFollowUpIfRequested(
  interaction: ModalSubmitInteraction,
  helpRequested: boolean,
): Promise<void> {
  if (!helpRequested) {
    return;
  }
  await interaction.followUp({
    content: `${getAdjustUILabel("helpAppliedNote", interaction.locale)}\n\n${getFineTuneHelpMessage(interaction.locale)}`,
    flags: MessageFlags.Ephemeral,
  });
}
