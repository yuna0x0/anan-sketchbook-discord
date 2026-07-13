/**
 * Generation Service
 * Shared parameter types and rendering entry points used by both the slash
 * commands and the Adjust/Effects modal handlers, so an image can be
 * regenerated from stored parameters after the original command finished.
 */

import { AttachmentBuilder } from "discord.js";
import sharp from "sharp";
import { generateSketchbookImage } from "../utils/sketchbookGenerator.js";
import { generateDialogueImage } from "../utils/dialogueGenerator.js";
import {
  applyImageFilter,
  ImageFilterId,
  FilterSettings,
} from "../utils/imageFilters.js";
import {
  applyImageAdjustments,
  ImageAdjustments,
} from "../utils/imageAdjustments.js";
import type { HAlign, VAlign } from "../utils/sketchbookGenerator.js";
import type { WrapAlgorithm } from "../utils/textWrapper.js";
import type { FontId } from "../config/fonts.js";
import type { EmotionTypeValue } from "../config/sketchbook/index.js";
import type { NameConfigLocale } from "../config/games/types.js";
import { getGame, type GameId } from "../config/games/index.js";
import { getCharacter, getExpressionNumber } from "../config/games/helpers.js";
import type { StretchMode } from "../config/dialogue/index.js";
import {
  getSketchbookAttachmentDescription,
  getLocalizedCharacterName,
} from "../locales/index.js";

// Output attachment formats. WebP is the default (about 83% smaller than
// PNG at quality 90); png/jpg are advanced choices via the Effects
// fine-tune field (format=png). JPEG has no alpha, so it is flattened
// onto white.
export const OUTPUT_FORMATS = ["webp", "png", "jpg"] as const;
export type OutputFormat = (typeof OUTPUT_FORMATS)[number];
export const DEFAULT_OUTPUT_FORMAT: OutputFormat = "webp";
const OUTPUT_WEBP_QUALITY = 90;
const OUTPUT_JPEG_QUALITY = 90;

export function isOutputFormat(value: string): value is OutputFormat {
  return (OUTPUT_FORMATS as readonly string[]).includes(value);
}

export interface SketchbookParams {
  command: "sketchbook";
  text?: string;
  /** Resolved emotion (random is resolved before storing) */
  expression: EmotionTypeValue;
  align: HAlign;
  valign: VAlign;
  useOverlay: boolean;
  wrapAlgorithm: WrapAlgorithm;
  fontId: FontId;
  /** Maximum font size cap; undefined = config default */
  maxFontHeight?: number;
  filter: ImageFilterId;
  /** Per-filter tuning (dot size, pixel size, grain, ...) */
  filterSettings?: FilterSettings;
  /** Fine-tune adjustments applied after the filter */
  adjustments?: ImageAdjustments;
  /** Attachment format; undefined = DEFAULT_OUTPUT_FORMAT */
  outputFormat?: OutputFormat;
  /** Mark the attachment as a spoiler */
  spoiler?: boolean;
}

export interface DialogueParams {
  command: "dialogue";
  gameId: GameId;
  characterId: string;
  /** Resolved expression ID (random is resolved before storing) */
  expressionId: string;
  text: string;
  backgroundId?: string;
  stretchMode: StretchMode;
  fontId: FontId;
  fontSize: number;
  highlightBrackets: boolean;
  nameLocale: NameConfigLocale;
  filter: ImageFilterId;
  /** Per-filter tuning (dot size, pixel size, grain, ...) */
  filterSettings?: FilterSettings;
  /** Fine-tune adjustments applied after the filter */
  adjustments?: ImageAdjustments;
  /** Attachment format; undefined = DEFAULT_OUTPUT_FORMAT */
  outputFormat?: OutputFormat;
  /** Mark the attachment as a spoiler */
  spoiler?: boolean;
}

export type GenerationParams = SketchbookParams | DialogueParams;

/**
 * Render an image from generation parameters.
 * `imageBuffer` is the original attachment: the content image for sketchbook,
 * or the custom background for dialogue.
 */
export async function renderGeneration(
  params: GenerationParams,
  imageBuffer?: Buffer,
): Promise<Buffer> {
  if (params.command === "sketchbook") {
    const base = await generateSketchbookImage({
      emotion: params.expression,
      text: params.text,
      contentImage: imageBuffer,
      align: params.align,
      valign: params.valign,
      useOverlay: params.useOverlay,
      wrapAlgorithm: params.wrapAlgorithm,
      fontId: params.fontId,
      maxFontHeight: params.maxFontHeight,
    });
    return applyPostProcessing(base, params);
  }

  const game = getGame(params.gameId);
  const character = getCharacter(game, params.characterId);
  if (!character) {
    throw new Error(
      `Unknown character for game ${game.id}: ${params.characterId}`,
    );
  }
  const expression = getExpressionNumber(character, params.expressionId);
  if (expression === undefined) {
    throw new Error(
      `Invalid expression "${params.expressionId}" for character ${params.characterId}`,
    );
  }

  const base = await generateDialogueImage({
    game,
    characterId: params.characterId,
    expression,
    text: params.text,
    backgroundId: imageBuffer ? undefined : params.backgroundId,
    customBackground: imageBuffer,
    stretchMode: params.stretchMode,
    fontId: params.fontId,
    fontSize: params.fontSize,
    highlightBrackets: params.highlightBrackets,
    nameLocale: params.nameLocale,
  });
  return applyPostProcessing(base, params);
}

/**
 * Post-processing shared by both commands: filter first, then fine-tune
 * adjustments on the filtered result, then the output-format encode.
 */
async function applyPostProcessing(
  base: Buffer,
  params: GenerationParams,
): Promise<Buffer> {
  const filtered = await applyImageFilter(
    base,
    params.filter,
    params.filterSettings,
  );
  const adjusted = params.adjustments
    ? await applyImageAdjustments(filtered, params.adjustments)
    : filtered;
  return encodeOutput(adjusted, params.outputFormat);
}

/**
 * Encode the rendered PNG buffer into the requested attachment format
 */
async function encodeOutput(
  png: Buffer,
  format: OutputFormat = DEFAULT_OUTPUT_FORMAT,
): Promise<Buffer> {
  switch (format) {
    case "png":
      return png;
    case "jpg":
      // JPEG has no alpha channel; flatten transparency onto white
      return sharp(png)
        .flatten({ background: "#ffffff" })
        .jpeg({ quality: OUTPUT_JPEG_QUALITY })
        .toBuffer();
    case "webp":
      return sharp(png).webp({ quality: OUTPUT_WEBP_QUALITY }).toBuffer();
  }
}

/**
 * Build the Discord attachment (filename + accessibility description) for a
 * rendered image.
 */
export function buildGenerationAttachment(
  params: GenerationParams,
  imageBuffer: Buffer,
  locale: string,
): AttachmentBuilder {
  // Discord treats attachments whose filename starts with SPOILER_ as spoilers
  const prefix = params.spoiler ? "SPOILER_" : "";
  const extension = params.outputFormat ?? DEFAULT_OUTPUT_FORMAT;

  if (params.command === "sketchbook") {
    return new AttachmentBuilder(imageBuffer, {
      name: `${prefix}sketchbook.${extension}`,
      description: getSketchbookAttachmentDescription(
        params.text ?? null,
        locale,
      ),
    });
  }

  const characterName = getLocalizedCharacterName(
    params.gameId,
    params.characterId,
    params.nameLocale,
  );
  return new AttachmentBuilder(imageBuffer, {
    name: `${prefix}dialogue.${extension}`,
    description: `${characterName}: ${params.text.substring(0, 100)}`,
  });
}
