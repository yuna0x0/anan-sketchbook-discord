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
  EmotionType,
  EMOTION_DISPLAY_NAMES,
  EmotionTypeValue,
} from "../config.js";
import { generateSketchbookImage } from "../utils/imageGenerator.js";
import { WrapAlgorithm } from "../utils/textWrapper.js";

// Build the slash command with all options
export const data = new SlashCommandBuilder()
  .setName("sketchbook")
  .setDescription("Generate an image with Anan holding a sketchbook")
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
      .setDescription("The text to display on the sketchbook")
      .setRequired(false),
  )
  .addAttachmentOption((option) =>
    option
      .setName("image")
      .setDescription("An image to paste on the sketchbook")
      .setRequired(false),
  )
  .addStringOption((option) =>
    option
      .setName("expression")
      .setDescription("Anan's facial expression")
      .setRequired(false)
      .addChoices(
        {
          name: EMOTION_DISPLAY_NAMES[EmotionType.NORMAL],
          value: EmotionType.NORMAL,
        },
        {
          name: EMOTION_DISPLAY_NAMES[EmotionType.HAPPY],
          value: EmotionType.HAPPY,
        },
        {
          name: EMOTION_DISPLAY_NAMES[EmotionType.ANGRY],
          value: EmotionType.ANGRY,
        },
        {
          name: EMOTION_DISPLAY_NAMES[EmotionType.SPEECHLESS],
          value: EmotionType.SPEECHLESS,
        },
        {
          name: EMOTION_DISPLAY_NAMES[EmotionType.BLUSH],
          value: EmotionType.BLUSH,
        },
        {
          name: EMOTION_DISPLAY_NAMES[EmotionType.YANDERE],
          value: EmotionType.YANDERE,
        },
        {
          name: EMOTION_DISPLAY_NAMES[EmotionType.CLOSED_EYES],
          value: EmotionType.CLOSED_EYES,
        },
        {
          name: EMOTION_DISPLAY_NAMES[EmotionType.SAD],
          value: EmotionType.SAD,
        },
        {
          name: EMOTION_DISPLAY_NAMES[EmotionType.SCARED],
          value: EmotionType.SCARED,
        },
        {
          name: EMOTION_DISPLAY_NAMES[EmotionType.EXCITED],
          value: EmotionType.EXCITED,
        },
        {
          name: EMOTION_DISPLAY_NAMES[EmotionType.SURPRISED],
          value: EmotionType.SURPRISED,
        },
        {
          name: EMOTION_DISPLAY_NAMES[EmotionType.CRYING],
          value: EmotionType.CRYING,
        },
      ),
  )
  .addStringOption((option) =>
    option
      .setName("align")
      .setDescription("Horizontal text alignment")
      .setRequired(false)
      .addChoices(
        { name: "Left", value: "left" },
        { name: "Center", value: "center" },
        { name: "Right", value: "right" },
      ),
  )
  .addStringOption((option) =>
    option
      .setName("valign")
      .setDescription("Vertical text alignment")
      .setRequired(false)
      .addChoices(
        { name: "Top", value: "top" },
        { name: "Middle", value: "middle" },
        { name: "Bottom", value: "bottom" },
      ),
  )
  .addBooleanOption((option) =>
    option
      .setName("dm")
      .setDescription("Send the result to your DMs instead of the channel")
      .setRequired(false),
  )
  .addBooleanOption((option) =>
    option
      .setName("overlay")
      .setDescription("Apply the overlay effect (default: true)")
      .setRequired(false),
  )
  .addStringOption((option) =>
    option
      .setName("wrap")
      .setDescription("Text wrapping algorithm")
      .setRequired(false)
      .addChoices(
        { name: "Greedy (faster)", value: "greedy" },
        { name: "Knuth-Plass (better quality)", value: "knuth_plass" },
      ),
  );

/**
 * Execute the sketchbook command
 */
export async function execute(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  // Defer reply since image generation may take a moment
  const sendToDM = interaction.options.getBoolean("dm") ?? false;
  await interaction.deferReply({
    flags: sendToDM ? MessageFlags.Ephemeral : undefined,
  });

  try {
    // Get command options
    const text = interaction.options.getString("text");
    const imageAttachment = interaction.options.getAttachment("image");
    const expression = (interaction.options.getString("expression") ??
      EmotionType.NORMAL) as EmotionTypeValue;
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
        content:
          "Please provide either text or an image (or both) to generate the sketchbook image.",
      });
      return;
    }

    // Fetch image buffer if attachment is provided
    let contentImageBuffer: Buffer | undefined;
    if (imageAttachment) {
      // Validate that the attachment is an image
      if (!imageAttachment.contentType?.startsWith("image/")) {
        await interaction.editReply({
          content:
            "The attached file must be an image (PNG, JPEG, GIF, or WebP).",
        });
        return;
      }

      // Fetch the image data
      const response = await fetch(imageAttachment.url);
      if (!response.ok) {
        await interaction.editReply({
          content: "Failed to fetch the attached image. Please try again.",
        });
        return;
      }
      contentImageBuffer = Buffer.from(await response.arrayBuffer());
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
          content: "The sketchbook image has been sent to your DMs!",
        });
      } catch {
        // Failed to send DM (user might have DMs disabled)
        await interaction.editReply({
          content:
            "Failed to send DM. Please make sure your DMs are open, or try without the DM option.",
        });
      }
    } else {
      // Send to channel
      await interaction.editReply({ files: [attachment] });
    }
  } catch (error) {
    console.error("Error generating sketchbook image:", error);
    await interaction.editReply({
      content:
        "An error occurred while generating the sketchbook image. Please try again later.",
    });
  }
}
