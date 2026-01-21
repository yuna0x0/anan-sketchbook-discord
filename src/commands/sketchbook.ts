/**
 * Sketchbook Slash Command
 * Allows users to generate sketchbook images with text and/or images.
 * Supports various face expressions and can send to DM or channel.
 * Can be used as a user-installable application anywhere in Discord.
 */

import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AttachmentBuilder,
  MessageFlags,
  ApplicationIntegrationType,
  InteractionContextType,
} from "discord.js";
import {
  EmotionTypeValue,
  ExpressionOption,
  ExpressionOptionValue,
  getRandomEmotion,
} from "../config.js";
import {
  generateSketchbookImage,
  isImageSupported,
  getUnsupportedImageError,
} from "../utils/imageGenerator.js";
import { WrapAlgorithm } from "../utils/textWrapper.js";
import {
  COMMAND_DESCRIPTION_LOCALIZATIONS,
  OPTION_DESCRIPTION_LOCALIZATIONS,
  EXPRESSION_DISPLAY_NAME_LOCALIZATIONS,
  ALIGN_CHOICE_LOCALIZATIONS,
  VALIGN_CHOICE_LOCALIZATIONS,
  WRAP_CHOICE_LOCALIZATIONS,
  getResponseMessage,
  getSketchbookMessage,
} from "../locales.js";
import { Locale } from "discord.js";

// Build the slash command with all options
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
      .addChoices(
        {
          name: EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.NORMAL][
            Locale.EnglishUS
          ]!,
          name_localizations:
            EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.NORMAL],
          value: ExpressionOption.NORMAL,
        },
        {
          name: EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.HAPPY][
            Locale.EnglishUS
          ]!,
          name_localizations:
            EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.HAPPY],
          value: ExpressionOption.HAPPY,
        },
        {
          name: EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.ANGRY][
            Locale.EnglishUS
          ]!,
          name_localizations:
            EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.ANGRY],
          value: ExpressionOption.ANGRY,
        },
        {
          name: EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[
            ExpressionOption.SPEECHLESS
          ][Locale.EnglishUS]!,
          name_localizations:
            EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.SPEECHLESS],
          value: ExpressionOption.SPEECHLESS,
        },
        {
          name: EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.BLUSH][
            Locale.EnglishUS
          ]!,
          name_localizations:
            EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.BLUSH],
          value: ExpressionOption.BLUSH,
        },
        {
          name: EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.YANDERE][
            Locale.EnglishUS
          ]!,
          name_localizations:
            EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.YANDERE],
          value: ExpressionOption.YANDERE,
        },
        {
          name: EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[
            ExpressionOption.CLOSED_EYES
          ][Locale.EnglishUS]!,
          name_localizations:
            EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.CLOSED_EYES],
          value: ExpressionOption.CLOSED_EYES,
        },
        {
          name: EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.SAD][
            Locale.EnglishUS
          ]!,
          name_localizations:
            EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.SAD],
          value: ExpressionOption.SAD,
        },
        {
          name: EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.SCARED][
            Locale.EnglishUS
          ]!,
          name_localizations:
            EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.SCARED],
          value: ExpressionOption.SCARED,
        },
        {
          name: EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.EXCITED][
            Locale.EnglishUS
          ]!,
          name_localizations:
            EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.EXCITED],
          value: ExpressionOption.EXCITED,
        },
        {
          name: EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[
            ExpressionOption.SURPRISED
          ][Locale.EnglishUS]!,
          name_localizations:
            EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.SURPRISED],
          value: ExpressionOption.SURPRISED,
        },
        {
          name: EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.CRYING][
            Locale.EnglishUS
          ]!,
          name_localizations:
            EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.CRYING],
          value: ExpressionOption.CRYING,
        },
        {
          name: EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.RANDOM][
            Locale.EnglishUS
          ]!,
          name_localizations:
            EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.RANDOM],
          value: ExpressionOption.RANDOM,
        },
      ),
  )
  .addStringOption((option) =>
    option
      .setName("align")
      .setDescription(OPTION_DESCRIPTION_LOCALIZATIONS.align[Locale.EnglishUS]!)
      .setDescriptionLocalizations(OPTION_DESCRIPTION_LOCALIZATIONS.align)
      .setRequired(false)
      .addChoices(
        {
          name: ALIGN_CHOICE_LOCALIZATIONS.left[Locale.EnglishUS]!,
          name_localizations: ALIGN_CHOICE_LOCALIZATIONS.left,
          value: "left",
        },
        {
          name: ALIGN_CHOICE_LOCALIZATIONS.center[Locale.EnglishUS]!,
          name_localizations: ALIGN_CHOICE_LOCALIZATIONS.center,
          value: "center",
        },
        {
          name: ALIGN_CHOICE_LOCALIZATIONS.right[Locale.EnglishUS]!,
          name_localizations: ALIGN_CHOICE_LOCALIZATIONS.right,
          value: "right",
        },
      ),
  )
  .addStringOption((option) =>
    option
      .setName("valign")
      .setDescription(
        OPTION_DESCRIPTION_LOCALIZATIONS.valign[Locale.EnglishUS]!,
      )
      .setDescriptionLocalizations(OPTION_DESCRIPTION_LOCALIZATIONS.valign)
      .setRequired(false)
      .addChoices(
        {
          name: VALIGN_CHOICE_LOCALIZATIONS.top[Locale.EnglishUS]!,
          name_localizations: VALIGN_CHOICE_LOCALIZATIONS.top,
          value: "top",
        },
        {
          name: VALIGN_CHOICE_LOCALIZATIONS.middle[Locale.EnglishUS]!,
          name_localizations: VALIGN_CHOICE_LOCALIZATIONS.middle,
          value: "middle",
        },
        {
          name: VALIGN_CHOICE_LOCALIZATIONS.bottom[Locale.EnglishUS]!,
          name_localizations: VALIGN_CHOICE_LOCALIZATIONS.bottom,
          value: "bottom",
        },
      ),
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
      .setName("overlay")
      .setDescription(
        OPTION_DESCRIPTION_LOCALIZATIONS.overlay[Locale.EnglishUS]!,
      )
      .setDescriptionLocalizations(OPTION_DESCRIPTION_LOCALIZATIONS.overlay)
      .setRequired(false),
  )
  .addStringOption((option) =>
    option
      .setName("wrap")
      .setDescription(OPTION_DESCRIPTION_LOCALIZATIONS.wrap[Locale.EnglishUS]!)
      .setDescriptionLocalizations(OPTION_DESCRIPTION_LOCALIZATIONS.wrap)
      .setRequired(false)
      .addChoices(
        {
          name: WRAP_CHOICE_LOCALIZATIONS.greedy[Locale.EnglishUS]!,
          name_localizations: WRAP_CHOICE_LOCALIZATIONS.greedy,
          value: "greedy",
        },
        {
          name: WRAP_CHOICE_LOCALIZATIONS.knuth_plass[Locale.EnglishUS]!,
          name_localizations: WRAP_CHOICE_LOCALIZATIONS.knuth_plass,
          value: "knuth_plass",
        },
      ),
  );

/**
 * Execute the sketchbook command
 */
export async function execute(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  // Get user's locale for localized responses
  const locale = interaction.locale || Locale.EnglishUS;

  // Defer reply since image generation may take a moment
  const sendToDM = interaction.options.getBoolean("dm") ?? false;
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
    const align = (interaction.options.getString("align") ?? "center") as
      | "left"
      | "center"
      | "right";
    const valign = (interaction.options.getString("valign") ?? "middle") as
      | "top"
      | "middle"
      | "bottom";
    const useOverlay = interaction.options.getBoolean("overlay") ?? true;
    const wrapAlgorithm = (interaction.options.getString("wrap") ??
      "greedy") as WrapAlgorithm;

    // Validate that at least text or image is provided
    if (!text && !imageAttachment) {
      await interaction.editReply({
        content: getSketchbookMessage("noInput", locale),
      });
      return;
    }

    // Fetch image buffer if attachment is provided
    let contentImageBuffer: Buffer | undefined;
    if (imageAttachment) {
      // Basic validation that the attachment claims to be an image
      if (!imageAttachment.contentType?.startsWith("image/")) {
        await interaction.editReply({
          content: getResponseMessage("imageNotSupported", locale),
        });
        return;
      }

      // Fetch the image data
      const response = await fetch(imageAttachment.url);
      if (!response.ok) {
        await interaction.editReply({
          content: getResponseMessage("imageFetchFailed", locale),
        });
        return;
      }
      contentImageBuffer = Buffer.from(await response.arrayBuffer());

      // Validate the actual image format from magic bytes
      if (!isImageSupported(contentImageBuffer)) {
        await interaction.editReply({
          content: getUnsupportedImageError(),
        });
        return;
      }
    }

    // Generate the sketchbook image
    const imageBuffer = await generateSketchbookImage({
      emotion: expression,
      text: text ?? undefined,
      contentImage: contentImageBuffer,
      align,
      valign,
      useOverlay,
      wrapAlgorithm,
    });

    // Create attachment from buffer
    const attachment = new AttachmentBuilder(imageBuffer, {
      name: "sketchbook.png",
      description: text
        ? `Sketchbook with text: ${text.substring(0, 100)}`
        : "Sketchbook with image",
    });

    // Send the result
    if (sendToDM) {
      try {
        // Send to DM
        const dmChannel = await interaction.user.createDM();
        await dmChannel.send({ files: [attachment] });
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
      // Send to channel
      await interaction.editReply({ files: [attachment] });
    }
  } catch (error) {
    console.error("Error generating sketchbook image:", error);
    await interaction.editReply({
      content: getResponseMessage("genericError", locale),
    });
  }
}
