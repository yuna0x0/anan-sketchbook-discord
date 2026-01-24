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
import { FontId, FONTS } from "../config/fonts.js";
import {
  CHARACTERS,
  CharacterId,
  NameConfigLocale,
  getExpressionNumber,
  FALLBACK_NAME_LOCALE,
} from "../config/dialogue/characters.js";
import {
  StretchMode,
  STRETCH_MODES,
  BACKGROUNDS,
  getBackgroundIds,
} from "../config/dialogue/backgrounds.js";
import { DIALOGUE_TEXT_DEFAULT_FONT } from "../config/dialogue/index.js";
import { ExpressionOption } from "../config/sketchbook/index.js";
import { generateDialogueImage } from "../utils/dialogueGenerator.js";
import { isImageSupported } from "../utils/imageUtils.js";
import {
  getImageFormatErrorMessage,
  DIALOGUE_COMMAND_DESCRIPTION_LOCALIZATIONS,
  DIALOGUE_OPTION_LOCALIZATIONS,
  CHARACTER_NAME_LOCALIZATIONS,
  STRETCH_MODE_LOCALIZATIONS,
  FONT_NAME_LOCALIZATIONS,
  getLocalizedBackgroundName,
  getLocalizedCharacterName,
  LANGUAGE_CHOICE_LOCALIZATIONS,
  getResponseMessage,
  getDialogueMessage,
  getLocalizedExpressionName,
  EXPRESSION_DISPLAY_NAME_LOCALIZATIONS,
  resolveLocale,
} from "../locales/index.js";
import { getGuildDefaultLanguage } from "../database/repositories/guildSettings.js";

// Supported locales for name display in dialogue (subset of Discord Locale)
const SUPPORTED_NAME_LOCALES: NameConfigLocale[] = [
  Locale.Japanese,
  Locale.ChineseTW,
  Locale.ChineseCN,
];

// Check if a Discord locale is supported for name display
function isSupportedNameLocale(
  locale: Locale | string,
): locale is NameConfigLocale {
  return SUPPORTED_NAME_LOCALES.includes(locale as NameConfigLocale);
}

// Build language choices with localizations (use EnglishUS as default name)
const languageChoices = SUPPORTED_NAME_LOCALES.map((locale) => ({
  name: LANGUAGE_CHOICE_LOCALIZATIONS[locale]?.[Locale.EnglishUS] ?? locale,
  name_localizations: LANGUAGE_CHOICE_LOCALIZATIONS[locale],
  value: locale,
}));

// Build character choices with localizations (Discord limit: 25)
// Use English name as default, with localized names for other locales
const characterChoices = Object.entries(CHARACTERS).map(([id]) => ({
  name: CHARACTER_NAME_LOCALIZATIONS[id as CharacterId][Locale.EnglishUS]!,
  name_localizations: CHARACTER_NAME_LOCALIZATIONS[id as CharacterId],
  value: id,
}));

// Build font choices with localizations (use EnglishUS as default name)
const fontChoices = Object.entries(FONTS).map(([id, info]) => ({
  name: FONT_NAME_LOCALIZATIONS[id]?.[Locale.EnglishUS] ?? info.name,
  name_localizations: FONT_NAME_LOCALIZATIONS[id],
  value: id,
}));

// Build stretch mode choices with localizations (use EnglishUS as default name)
const stretchModeChoices = Object.entries(STRETCH_MODES).map(([id, name]) => ({
  name: STRETCH_MODE_LOCALIZATIONS[id][Locale.EnglishUS] ?? name,
  name_localizations: STRETCH_MODE_LOCALIZATIONS[id],
  value: id,
}));

// Build the slash command
export const data = new SlashCommandBuilder()
  .setName("dialogue")
  .setDescription(DIALOGUE_COMMAND_DESCRIPTION_LOCALIZATIONS[Locale.EnglishUS]!)
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
      .setDescription(
        DIALOGUE_OPTION_LOCALIZATIONS.character[Locale.EnglishUS]!,
      )
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.character)
      .setRequired(true)
      .addChoices(...characterChoices),
  )
  .addStringOption((option) =>
    option
      .setName("expression")
      .setDescription(
        DIALOGUE_OPTION_LOCALIZATIONS.expression[Locale.EnglishUS]!,
      )
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.expression)
      .setRequired(true)
      .setAutocomplete(true),
  )
  .addStringOption((option) =>
    option
      .setName("text")
      .setDescription(DIALOGUE_OPTION_LOCALIZATIONS.text[Locale.EnglishUS]!)
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.text)
      .setRequired(true),
  )
  // Optional options
  .addStringOption((option) =>
    option
      .setName("background")
      .setDescription(
        DIALOGUE_OPTION_LOCALIZATIONS.background[Locale.EnglishUS]!,
      )
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.background)
      .setRequired(false)
      .setAutocomplete(true),
  )
  .addAttachmentOption((option) =>
    option
      .setName("custom_background")
      .setDescription(
        DIALOGUE_OPTION_LOCALIZATIONS.custom_background[Locale.EnglishUS]!,
      )
      .setDescriptionLocalizations(
        DIALOGUE_OPTION_LOCALIZATIONS.custom_background,
      )
      .setRequired(false),
  )
  .addStringOption((option) =>
    option
      .setName("stretch")
      .setDescription(DIALOGUE_OPTION_LOCALIZATIONS.stretch[Locale.EnglishUS]!)
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.stretch)
      .setRequired(false)
      .addChoices(...stretchModeChoices),
  )
  .addStringOption((option) =>
    option
      .setName("font")
      .setDescription(DIALOGUE_OPTION_LOCALIZATIONS.font[Locale.EnglishUS]!)
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.font)
      .setRequired(false)
      .addChoices(...fontChoices),
  )
  .addIntegerOption((option) =>
    option
      .setName("font_size")
      .setDescription(
        DIALOGUE_OPTION_LOCALIZATIONS.font_size[Locale.EnglishUS]!,
      )
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.font_size)
      .setRequired(false)
      .setMinValue(24)
      .setMaxValue(120),
  )
  .addBooleanOption((option) =>
    option
      .setName("highlight")
      .setDescription(
        DIALOGUE_OPTION_LOCALIZATIONS.highlight[Locale.EnglishUS]!,
      )
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.highlight)
      .setRequired(false),
  )
  .addBooleanOption((option) =>
    option
      .setName("dm")
      .setDescription(DIALOGUE_OPTION_LOCALIZATIONS.dm[Locale.EnglishUS]!)
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.dm)
      .setRequired(false),
  )
  .addStringOption((option) =>
    option
      .setName("language")
      .setDescription(DIALOGUE_OPTION_LOCALIZATIONS.language[Locale.EnglishUS]!)
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
      const selectCharacterMessage = getDialogueMessage(
        "selectCharacterFirst",
        userLocale,
      );
      await interaction.respond([
        {
          name: selectCharacterMessage,
          value: "_none_",
        },
      ]);
      return;
    }

    const character = CHARACTERS[characterId];
    const searchValue = focusedOption.value.toLowerCase();

    // Get localized random option name from EXPRESSION_DISPLAY_NAME_LOCALIZATIONS
    const randomLocalizations =
      EXPRESSION_DISPLAY_NAME_LOCALIZATIONS[ExpressionOption.RANDOM];
    const randomName = (randomLocalizations[
      userLocale as keyof typeof randomLocalizations
    ] ?? randomLocalizations[Locale.EnglishUS])!;

    // Create a list of expressions with their localized names, starting with Random
    const expressionsWithNames = [
      {
        id: "_random_",
        localizedName: randomName,
        displayName: randomName,
      },
      ...character.expressions.map((expressionId) => {
        const localizedName = getLocalizedExpressionName(
          expressionId,
          userLocale,
        );
        return {
          id: expressionId,
          localizedName,
          displayName: localizedName,
        };
      }),
    ];

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
      DIALOGUE_TEXT_DEFAULT_FONT) as FontId;
    const fontSize = interaction.options.getInteger("font_size") ?? 72;
    const highlightBrackets =
      interaction.options.getBoolean("highlight") ?? true;
    const userSpecifiedLanguage = interaction.options.getString(
      "language",
    ) as NameConfigLocale | null;
    // Use user-specified language, or user's Discord locale if supported, or fallback to Japanese
    const nameLanguage: NameConfigLocale =
      userSpecifiedLanguage ??
      (isSupportedNameLocale(locale) ? locale : FALLBACK_NAME_LOCALE);

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

    // Handle random expression selection
    let finalExpressionId = expressionId;
    if (expressionId === "_random_") {
      const randomIndex = Math.floor(
        Math.random() * character.expressions.length,
      );
      finalExpressionId = character.expressions[randomIndex];
    }

    // Convert expression name to number
    const expression = getExpressionNumber(character, finalExpressionId);
    if (expression === undefined) {
      await interaction.editReply({
        content: getDialogueMessage("invalidExpression", locale, {
          characterName: getLocalizedCharacterName(characterId, nameLanguage),
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
          content: getImageFormatErrorMessage(locale),
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
    const localizedCharacterName = getLocalizedCharacterName(
      characterId,
      nameLanguage,
    );
    const attachment = new AttachmentBuilder(imageBuffer, {
      name: "dialogue.png",
      description: `${localizedCharacterName}: ${text.substring(0, 100)}`,
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
