/**
 * Sketchbook Slash Command
 * Allows users to generate sketchbook images with text and/or images.
 * Supports various face expressions and can send to DM or channel.
 * Can be used as a user-installable application anywhere in Discord.
 *
 * The slash command keeps only the core options; everything else (font,
 * font size, layout, overlay, wrapping, filters) is tweaked after generation
 * through the Adjust/Effects buttons on the resulting message.
 */

import {
  SlashCommandBuilder,
  MessageFlags,
  ApplicationIntegrationType,
  InteractionContextType,
  Locale,
} from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import {
  editReplyWithFiles,
  replyWithEphemeralError,
} from "../utils/interactionUtils.js";
import {
  EmotionTypeValue,
  ExpressionOption,
  ExpressionOptionValue,
  getRandomEmotion,
  SKETCHBOOK_DEFAULT_FONT,
} from "../config/sketchbook/index.js";
import { fetchUserImage } from "../utils/imageUtils.js";
import { ImageFilter } from "../utils/imageFilters.js";
import {
  renderGeneration,
  buildGenerationAttachment,
  SketchbookParams,
} from "../services/generationService.js";
import { adjustSessions } from "../services/adjustSessionStore.js";
import { buildImageActionsRow } from "../components/actionRow.js";
import {
  getImageFetchErrorMessage,
  COMMAND_DESCRIPTION_LOCALIZATIONS,
  OPTION_DESCRIPTION_LOCALIZATIONS,
  EXPRESSION_DISPLAY_NAME_LOCALIZATIONS,
  getResponseMessage,
  getSketchbookMessage,
  resolveLocale,
} from "../locales/index.js";
import { getGuildDefaultLanguage } from "../database/repositories/guildSettings.js";

// Build expression choices with localizations
const expressionChoices = Object.values(ExpressionOption).map((value) => ({
  name: EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[value][Locale.EnglishUS]!,
  name_localizations: EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[value],
  value,
}));

// Build the slash command with the core options only
export const data = new SlashCommandBuilder()
  .setName("sketchbook")
  .setDescription(COMMAND_DESCRIPTION_LOCALIZATIONS[Locale.EnglishUS]!)
  .setDescriptionLocalizations(COMMAND_DESCRIPTION_LOCALIZATIONS)
  // Allow the command to be installed by users (not just guilds)
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ])
  // Allow the command to be used in guilds, DMs with the bot, and any DM/group DM
  .setContexts([
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel,
  ])
  .addStringOption((option) =>
    option
      .setName("text")
      .setDescription(OPTION_DESCRIPTION_LOCALIZATIONS.text[Locale.EnglishUS]!)
      .setDescriptionLocalizations(OPTION_DESCRIPTION_LOCALIZATIONS.text)
      .setRequired(false),
  )
  .addAttachmentOption((option) =>
    option
      .setName("image")
      .setDescription(OPTION_DESCRIPTION_LOCALIZATIONS.image[Locale.EnglishUS]!)
      .setDescriptionLocalizations(OPTION_DESCRIPTION_LOCALIZATIONS.image)
      .setRequired(false),
  )
  .addStringOption((option) =>
    option
      .setName("expression")
      .setDescription(
        OPTION_DESCRIPTION_LOCALIZATIONS.expression[Locale.EnglishUS]!,
      )
      .setDescriptionLocalizations(OPTION_DESCRIPTION_LOCALIZATIONS.expression)
      .setRequired(false)
      .addChoices(...expressionChoices),
  )
  .addBooleanOption((option) =>
    option
      .setName("dm")
      .setDescription(OPTION_DESCRIPTION_LOCALIZATIONS.dm[Locale.EnglishUS]!)
      .setDescriptionLocalizations(OPTION_DESCRIPTION_LOCALIZATIONS.dm)
      .setRequired(false),
  )
  .addBooleanOption((option) =>
    option
      .setName("spoiler")
      .setDescription(
        OPTION_DESCRIPTION_LOCALIZATIONS.spoiler[Locale.EnglishUS]!,
      )
      .setDescriptionLocalizations(OPTION_DESCRIPTION_LOCALIZATIONS.spoiler)
      .setRequired(false),
  );

/**
 * Execute the sketchbook command
 */
export async function execute(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  // Defer reply since image generation may take a moment
  const sendToDM = interaction.options.getBoolean("dm") ?? false;

  // Get the effective locale for responses
  // For public messages in guilds, use the guild's default language if set
  const isPublic = !sendToDM;
  const guildDefaultLanguage = interaction.guildId
    ? getGuildDefaultLanguage(interaction.guildId)
    : null;
  const locale = resolveLocale(
    interaction.locale || Locale.EnglishUS,
    guildDefaultLanguage,
    isPublic,
  );
  await interaction.deferReply({
    flags: sendToDM ? MessageFlags.Ephemeral : undefined,
  });

  try {
    // Get command options
    const text = interaction.options.getString("text");
    const imageAttachment = interaction.options.getAttachment("image");
    const expressionOption = (interaction.options.getString("expression") ??
      ExpressionOption.NORMAL) as ExpressionOptionValue;

    // Handle random expression selection
    const expression: EmotionTypeValue =
      expressionOption === ExpressionOption.RANDOM
        ? getRandomEmotion()
        : (expressionOption as EmotionTypeValue);

    // Validate that at least text or image is provided
    if (!text && !imageAttachment) {
      await replyWithEphemeralError(
        interaction,
        getSketchbookMessage("noInput", locale),
      );
      return;
    }

    // Fetch image buffer if attachment is provided (size/dimension guarded)
    let contentImageBuffer: Buffer | undefined;
    if (imageAttachment) {
      const result = await fetchUserImage(imageAttachment);
      if (result.error) {
        await replyWithEphemeralError(
          interaction,
          getImageFetchErrorMessage(result.error, locale),
        );
        return;
      }
      contentImageBuffer = result.buffer;
    }

    // Generate the sketchbook image with default advanced settings;
    // the Adjust/Effects buttons on the message expose the rest
    const params: SketchbookParams = {
      command: "sketchbook",
      text: text ?? undefined,
      expression,
      align: "center",
      valign: "middle",
      useOverlay: true,
      wrapAlgorithm: "greedy",
      fontId: SKETCHBOOK_DEFAULT_FONT,
      filter: ImageFilter.NONE,
      spoiler: interaction.options.getBoolean("spoiler") ?? false,
    };
    const imageBuffer = await renderGeneration(params, contentImageBuffer);
    const attachment = buildGenerationAttachment(params, imageBuffer, locale);
    const actionsRow = buildImageActionsRow(
      interaction.user.id,
      interaction.locale,
    );

    // Send the result and remember the parameters for the Adjust/Effects flow
    if (sendToDM) {
      try {
        // Send to DM
        const dmChannel = await interaction.user.createDM();
        const message = await dmChannel.send({
          files: [attachment],
          components: [actionsRow],
        });
        adjustSessions.set(message.id, {
          userId: interaction.user.id,
          params,
          imageBuffer: contentImageBuffer,
        });
        await interaction.editReply({
          content: getResponseMessage("dmSent", locale),
        });
      } catch {
        // Failed to send DM (user might have DMs disabled)
        await interaction.editReply({
          content: getResponseMessage("dmFailed", locale),
        });
      }
    } else {
      // Send to channel, falling back to ephemeral if missing permissions
      const message = await editReplyWithFiles(
        interaction,
        [attachment],
        locale,
        [actionsRow],
      );
      if (message) {
        adjustSessions.set(message.id, {
          userId: interaction.user.id,
          params,
          imageBuffer: contentImageBuffer,
        });
      }
    }
  } catch (error) {
    console.error("Error generating sketchbook image:", error);
    await replyWithEphemeralError(
      interaction,
      getResponseMessage("genericError", locale),
    );
  }
}
