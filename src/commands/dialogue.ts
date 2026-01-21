/**
 * Dialogue Slash Command
 * Generates in-game style dialogue images with characters, backgrounds, and styled text.
 * Supports character selection with expressions, custom backgrounds, and bracket highlighting.
 */

import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AttachmentBuilder,
  MessageFlags,
  ApplicationIntegrationType,
  InteractionContextType,
  AutocompleteInteraction,
  Locale,
} from "discord.js";
import {
  CHARACTERS,
  CharacterId,
  DialogueFontId,
  StretchMode,
  NameConfigLocale,
  DIALOGUE_FONTS,
  STRETCH_MODES,
  BACKGROUNDS,
  getBackgroundIds,
  getExpressionNumber,
} from "../config.js";
import {
  generateDialogueImage,
  isImageSupported,
  getUnsupportedImageError,
} from "../utils/dialogueGenerator.js";
import {
  DIALOGUE_COMMAND_DESCRIPTION_LOCALIZATIONS,
  DIALOGUE_OPTION_LOCALIZATIONS,
  CHARACTER_NAME_LOCALIZATIONS,
  STRETCH_MODE_LOCALIZATIONS,
  FONT_NAME_LOCALIZATIONS,
  getLocalizedBackgroundName,
  LANGUAGE_CHOICE_LOCALIZATIONS,
  getResponseMessage,
  getDialogueMessage,
  getLocalizedExpressionName,
} from "../locales.js";

// Available languages for character name display with English display names
const NAME_LANGUAGE_DISPLAY: Record<NameConfigLocale, string> = {
  ja: "Japanese (ja)",
  "zh-TW": "Traditional Chinese (zh-TW)",
  "zh-CN": "Simplified Chinese (zh-CN)",
  en: "English (en)",
};

// Languages currently supported for name config (ja is default, listed first)
const NAME_LANGUAGES: NameConfigLocale[] = ["ja", "zh-TW", "zh-CN"];

// Build language choices with localizations
const languageChoices = NAME_LANGUAGES.map((locale) => ({
  name: NAME_LANGUAGE_DISPLAY[locale],
  name_localizations: LANGUAGE_CHOICE_LOCALIZATIONS[locale],
  value: locale,
}));

// Build character choices with localizations (Discord limit: 25)
const characterChoices = Object.entries(CHARACTERS).map(([id, info]) => ({
  name: info.fullName,
  name_localizations: CHARACTER_NAME_LOCALIZATIONS[id as CharacterId],
  value: id,
}));

// Build font choices with localizations
const fontChoices = Object.entries(DIALOGUE_FONTS).map(([id, info]) => ({
  name: info.name,
  name_localizations: FONT_NAME_LOCALIZATIONS[id],
  value: id,
}));

// Build stretch mode choices with localizations
const stretchModeChoices = Object.entries(STRETCH_MODES).map(([id, name]) => ({
  name: name,
  name_localizations: STRETCH_MODE_LOCALIZATIONS[id],
  value: id,
}));

// Build the slash command
export const data = new SlashCommandBuilder()
  .setName("dialogue")
  .setDescription("Generate an in-game style dialogue image")
  .setDescriptionLocalizations(DIALOGUE_COMMAND_DESCRIPTION_LOCALIZATIONS)
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
  // Required options
  .addStringOption((option) =>
    option
      .setName("character")
      .setDescription("The character to display")
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.character)
      .setRequired(true)
      .addChoices(...characterChoices),
  )
  .addStringOption((option) =>
    option
      .setName("expression")
      .setDescription("Character expression (use autocomplete)")
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.expression)
      .setRequired(true)
      .setAutocomplete(true),
  )
  .addStringOption((option) =>
    option
      .setName("text")
      .setDescription(
        "The dialogue text (supports emoji and [bracket] highlighting)",
      )
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.text)
      .setRequired(true),
  )
  // Optional options
  .addStringOption((option) =>
    option
      .setName("background")
      .setDescription("Background image ID (use autocomplete)")
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.background)
      .setRequired(false)
      .setAutocomplete(true),
  )
  .addAttachmentOption((option) =>
    option
      .setName("custom_background")
      .setDescription("Upload a custom background image")
      .setDescriptionLocalizations(
        DIALOGUE_OPTION_LOCALIZATIONS.custom_background,
      )
      .setRequired(false),
  )
  .addStringOption((option) =>
    option
      .setName("stretch")
      .setDescription("How to fit the background to the canvas")
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.stretch)
      .setRequired(false)
      .addChoices(...stretchModeChoices),
  )
  .addStringOption((option) =>
    option
      .setName("font")
      .setDescription("Font for the dialogue text")
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.font)
      .setRequired(false)
      .addChoices(...fontChoices),
  )
  .addIntegerOption((option) =>
    option
      .setName("font_size")
      .setDescription("Font size for the dialogue text (default: 72)")
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.font_size)
      .setRequired(false)
      .setMinValue(24)
      .setMaxValue(120),
  )
  .addBooleanOption((option) =>
    option
      .setName("highlight")
      .setDescription(
        "Highlight text in [brackets] with character color (default: True)",
      )
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.highlight)
      .setRequired(false),
  )
  .addBooleanOption((option) =>
    option
      .setName("dm")
      .setDescription("Send the result to your DMs instead of the channel")
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.dm)
      .setRequired(false),
  )
  .addStringOption((option) =>
    option
      .setName("language")
      .setDescription("Language for the character name display")
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.language)
      .setRequired(false)
      .addChoices(...languageChoices),
  );

/**
 * Handle autocomplete for expression and background selection
 * Shows localized names based on user's locale
 */
export async function autocomplete(
  interaction: AutocompleteInteraction,
): Promise<void> {
  const focusedOption = interaction.options.getFocused(true);
  const userLocale = interaction.locale;

  if (focusedOption.name === "expression") {
    // Get the selected character
    const characterId = interaction.options.getString(
      "character",
    ) as CharacterId | null;

    if (!characterId || !CHARACTERS[characterId]) {
      // No character selected yet, show a message
      await interaction.respond([
        {
          name: "Please select a character first",
          value: "_none_",
        },
      ]);
      return;
    }

    const character = CHARACTERS[characterId];
    const searchValue = focusedOption.value.toLowerCase();

    // Create a list of expressions with their localized names
    const expressionsWithNames = character.expressions.map(
      (expressionId, index) => {
        const localizedName = getLocalizedExpressionName(
          expressionId,
          userLocale,
        );
        return {
          id: expressionId,
          localizedName,
          displayName: localizedName,
        };
      },
    );

    // Filter expressions that match the search (by ID or localized name)
    const filtered = expressionsWithNames
      .filter(
        (exp) =>
          exp.id.toLowerCase().includes(searchValue) ||
          exp.localizedName.toLowerCase().includes(searchValue),
      )
      .slice(0, 25); // Discord limit

    await interaction.respond(
      filtered.map((exp) => ({
        name: exp.displayName,
        value: exp.id,
      })),
    );
  } else if (focusedOption.name === "background") {
    const searchValue = focusedOption.value.toLowerCase();
    const backgroundIds = getBackgroundIds();

    // Create a list of backgrounds with their localized names
    const backgroundsWithNames = backgroundIds.map((id) => {
      const localizedName = getLocalizedBackgroundName(id, userLocale);
      return {
        id,
        localizedName,
        displayName: `${localizedName} (${id})`,
      };
    });

    // Filter backgrounds that match the search (by ID or localized name)
    const filtered = backgroundsWithNames
      .filter(
        (bg) =>
          bg.id.toLowerCase().includes(searchValue) ||
          bg.localizedName.toLowerCase().includes(searchValue),
      )
      .slice(0, 25); // Discord limit

    await interaction.respond(
      filtered.map((bg) => ({
        name: bg.displayName,
        value: bg.id,
      })),
    );
  }
}

/**
 * Execute the dialogue command
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
    // Get required options
    const characterId = interaction.options.getString(
      "character",
      true,
    ) as CharacterId;
    const expressionId = interaction.options.getString("expression", true);
    const text = interaction.options.getString("text", true);

    // Get optional options
    const backgroundId =
      interaction.options.getString("background") ?? undefined;
    const customBackgroundAttachment =
      interaction.options.getAttachment("custom_background");
    const stretchMode = (interaction.options.getString("stretch") ??
      "zoom_x") as StretchMode;
    const fontId = (interaction.options.getString("font") ??
      "stzhongs") as DialogueFontId;
    const fontSize = interaction.options.getInteger("font_size") ?? 72;
    const highlightBrackets =
      interaction.options.getBoolean("highlight") ?? true;
    const nameLanguage = (interaction.options.getString("language") ??
      "ja") as NameConfigLocale;

    // Validate character exists
    const character = CHARACTERS[characterId];
    if (!character) {
      await interaction.editReply({
        content: getDialogueMessage("unknownCharacter", locale, {
          characterId,
        }),
      });
      return;
    }

    // Convert expression name to number
    const expression = getExpressionNumber(character, expressionId);
    if (expression === undefined) {
      await interaction.editReply({
        content: getDialogueMessage("invalidExpression", locale, {
          characterName: character.fullName,
          maxExpression: String(character.expressions.length),
        }),
      });
      return;
    }

    // Validate background ID if provided
    if (backgroundId && !BACKGROUNDS[backgroundId]) {
      await interaction.editReply({
        content: getDialogueMessage("unknownBackground", locale, {
          backgroundId,
        }),
      });
      return;
    }

    // Fetch custom background if provided
    let customBackgroundBuffer: Buffer | undefined;
    if (customBackgroundAttachment) {
      // Validate content type
      if (!customBackgroundAttachment.contentType?.startsWith("image/")) {
        await interaction.editReply({
          content: getResponseMessage("imageNotSupported", locale),
        });
        return;
      }

      // Fetch the image data
      const response = await fetch(customBackgroundAttachment.url);
      if (!response.ok) {
        await interaction.editReply({
          content: getResponseMessage("imageFetchFailed", locale),
        });
        return;
      }
      customBackgroundBuffer = Buffer.from(await response.arrayBuffer());

      // Validate the actual image format
      if (!isImageSupported(customBackgroundBuffer)) {
        await interaction.editReply({
          content: getUnsupportedImageError(),
        });
        return;
      }
    }

    // Generate the dialogue image
    const imageBuffer = await generateDialogueImage({
      characterId,
      expression,
      text,
      backgroundId: customBackgroundBuffer ? undefined : backgroundId,
      customBackground: customBackgroundBuffer,
      stretchMode,
      fontId,
      fontSize,
      highlightBrackets,
      nameLocale: nameLanguage,
    });

    // Create attachment from buffer
    const attachment = new AttachmentBuilder(imageBuffer, {
      name: "dialogue.png",
      description: `${character.fullName}: ${text.substring(0, 100)}`,
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
    console.error("Error generating dialogue image:", error);
    await interaction.editReply({
      content: getResponseMessage("genericError", locale),
    });
  }
}
