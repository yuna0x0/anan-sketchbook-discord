/**
 * Dialogue Slash Command
 * Generates in-game style dialogue images with characters, backgrounds, and styled text.
 * Supports character selection with expressions, custom backgrounds, and bracket highlighting.
 *
 * The slash command keeps only the core options; everything else (font,
 * font size, background fit, highlighting, filters) is tweaked after
 * generation through the Adjust/Effects buttons on the resulting message.
 */

import {
  SlashCommandBuilder,
  MessageFlags,
  ApplicationIntegrationType,
  InteractionContextType,
  Locale,
} from "discord.js";
import type {
  ChatInputCommandInteraction,
  AutocompleteInteraction,
} from "discord.js";
import {
  editReplyWithFiles,
  replyWithEphemeralError,
} from "../utils/interactionUtils.js";
import type { NameConfigLocale } from "../config/games/types.js";
import {
  GAMES,
  GameId,
  DEFAULT_GAME_ID,
  isGameId,
  getGameIds,
  getGame,
} from "../config/games/index.js";
import {
  findOtherGamesWithBackground,
  findOtherGamesWithCharacter,
  getBackgroundIds,
  getExpressionNumber,
  isSupportedNameLocale,
} from "../config/games/helpers.js";
import { ExpressionOption } from "../config/sketchbook/index.js";
import { fetchUserImage } from "../utils/imageUtils.js";
import { ImageFilter } from "../utils/imageFilters.js";
import {
  renderGeneration,
  buildGenerationAttachment,
  DialogueParams,
} from "../services/generationService.js";
import { adjustSessions } from "../services/adjustSessionStore.js";
import { buildImageActionsRow } from "../components/actionRow.js";
import { searchCharacters } from "../utils/characterSearch.js";
import {
  getImageFetchErrorMessage,
  DIALOGUE_COMMAND_DESCRIPTION_LOCALIZATIONS,
  DIALOGUE_OPTION_LOCALIZATIONS,
  getLocalizedBackgroundName,
  getLocalizedCharacterName,
  getLocalizedGameName,
  LANGUAGE_CHOICE_LOCALIZATIONS,
  getResponseMessage,
  getDialogueMessage,
  getLocalizedExpressionName,
  EXPRESSION_DISPLAY_NAME_LOCALIZATIONS,
  resolveLocale,
} from "../locales/index.js";
import { getGuildDefaultLanguage } from "../database/repositories/guildSettings.js";

// Build game choices with localizations (use EnglishUS as default name).
// Games are static choices rather than autocomplete: only a handful will ever
// exist, and adding one already requires a deploy + command re-registration.
const gameChoices = getGameIds().map((gameId) => ({
  name: GAMES[gameId].localizations.gameName[Locale.EnglishUS] ?? gameId,
  name_localizations: GAMES[gameId].localizations.gameName,
  value: gameId,
}));

// Name locales supported by at least one game (deduped union); the selected
// game's own supported list is enforced at execute time
const allNameLocales = [
  ...new Set(getGameIds().flatMap((gameId) => GAMES[gameId].supportedNameLocales)),
];

// Build language choices with localizations (use EnglishUS as default name)
const languageChoices = allNameLocales.map((locale) => ({
  name: LANGUAGE_CHOICE_LOCALIZATIONS[locale]?.[Locale.EnglishUS] ?? locale,
  name_localizations: LANGUAGE_CHOICE_LOCALIZATIONS[locale],
  value: locale,
}));

// Build the slash command with the core options only
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
  // Game comes first so autocomplete for the options below is scoped to
  // the user's pick instead of silently defaulting
  .addStringOption((option) =>
    option
      .setName("game")
      .setDescription(DIALOGUE_OPTION_LOCALIZATIONS.game[Locale.EnglishUS]!)
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.game)
      .setRequired(true)
      .addChoices(...gameChoices),
  )
  // Character uses autocomplete (not static choices) so hidden characters
  // can be kept out of the default suggestions
  .addStringOption((option) =>
    option
      .setName("character")
      .setDescription(
        DIALOGUE_OPTION_LOCALIZATIONS.character[Locale.EnglishUS]!,
      )
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.character)
      .setRequired(true)
      .setAutocomplete(true),
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
  )
  .addBooleanOption((option) =>
    option
      .setName("spoiler")
      .setDescription(DIALOGUE_OPTION_LOCALIZATIONS.spoiler[Locale.EnglishUS]!)
      .setDescriptionLocalizations(DIALOGUE_OPTION_LOCALIZATIONS.spoiler)
      .setRequired(false),
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

  // Scope all suggestions to the selected game (default when omitted/invalid)
  const game = getGame(interaction.options.getString("game"));

  if (focusedOption.name === "character") {
    const suggestions = searchCharacters(game, focusedOption.value, userLocale);
    await interaction.respond(
      suggestions.map((suggestion) => ({
        name: suggestion.displayName,
        value: suggestion.id,
      })),
    );
    return;
  }

  if (focusedOption.name === "expression") {
    // Get the selected character
    const characterId = interaction.options.getString("character");

    if (!characterId || !game.characters[characterId]) {
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

    const character = game.characters[characterId];
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
          game.id,
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
    const backgroundIds = getBackgroundIds(game);

    // Create a list of backgrounds with their localized names
    const backgroundsWithNames = backgroundIds.map((id) => {
      const localizedName = getLocalizedBackgroundName(game.id, id, userLocale);
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
    // Resolve the selected game (choices constrain values from normal
    // clients; crafted values fall back to the default game)
    const gameOption = interaction.options.getString("game", true);
    const gameId: GameId = isGameId(gameOption) ? gameOption : DEFAULT_GAME_ID;
    const game = GAMES[gameId];

    // Get required options
    const characterId = interaction.options.getString("character", true);
    const expressionId = interaction.options.getString("expression", true);
    const text = interaction.options.getString("text", true);

    // Get optional options
    const backgroundId =
      interaction.options.getString("background") ?? undefined;
    const customBackgroundAttachment =
      interaction.options.getAttachment("custom_background");
    const userSpecifiedLanguage = interaction.options.getString(
      "language",
    ) as NameConfigLocale | null;
    // Use user-specified language, or user's Discord locale if supported,
    // or the game's fallback locale (validated against the selected game,
    // since the language choices are the union across all games)
    const nameLanguage: NameConfigLocale =
      userSpecifiedLanguage && isSupportedNameLocale(game, userSpecifiedLanguage)
        ? userSpecifiedLanguage
        : isSupportedNameLocale(game, locale)
          ? locale
          : game.fallbackNameLocale;

    // Validate the character exists in the selected game; when it belongs
    // to other registered games instead, point the user at the game option
    // (the same ID may exist in several games, so list every match)
    const character = game.characters[characterId];
    if (!character) {
      const otherGameIds = findOtherGamesWithCharacter(
        GAMES,
        characterId,
        gameId,
      );
      const selectedGame = getLocalizedGameName(gameId, locale);
      let message: string;
      if (otherGameIds.length === 1) {
        message = getDialogueMessage("characterWrongGame", locale, {
          characterName: getLocalizedCharacterName(
            otherGameIds[0],
            characterId,
            nameLanguage,
          ),
          selectedGame,
          otherGame: getLocalizedGameName(otherGameIds[0], locale),
        });
      } else if (otherGameIds.length > 1) {
        message = getDialogueMessage("characterWrongGameMultiple", locale, {
          characterId,
          selectedGame,
          otherGames: otherGameIds
            .map((id) => getLocalizedGameName(id, locale))
            .join(", "),
        });
      } else {
        message = getDialogueMessage("unknownCharacter", locale, {
          characterId,
          gameName: selectedGame,
        });
      }
      await replyWithEphemeralError(interaction, message);
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

    // Validate the expression (also converted to a number during rendering)
    const expression = getExpressionNumber(character, finalExpressionId);
    if (expression === undefined) {
      await replyWithEphemeralError(
        interaction,
        getDialogueMessage("invalidExpression", locale, {
          characterName: getLocalizedCharacterName(
            gameId,
            characterId,
            nameLanguage,
          ),
          maxExpression: String(character.expressions.length),
        }),
      );
      return;
    }

    // Validate the background ID if provided, with the same wrong-game
    // hinting as characters
    if (backgroundId && !game.backgrounds[backgroundId]) {
      const otherGameIds = findOtherGamesWithBackground(
        GAMES,
        backgroundId,
        gameId,
      );
      const selectedGame = getLocalizedGameName(gameId, locale);
      let message: string;
      if (otherGameIds.length === 1) {
        message = getDialogueMessage("backgroundWrongGame", locale, {
          selectedGame,
          otherGame: getLocalizedGameName(otherGameIds[0], locale),
        });
      } else if (otherGameIds.length > 1) {
        message = getDialogueMessage("backgroundWrongGameMultiple", locale, {
          backgroundId,
          selectedGame,
          otherGames: otherGameIds
            .map((id) => getLocalizedGameName(id, locale))
            .join(", "),
        });
      } else {
        message = getDialogueMessage("unknownBackground", locale, {
          backgroundId,
          gameName: selectedGame,
        });
      }
      await replyWithEphemeralError(interaction, message);
      return;
    }

    // Fetch custom background if provided (size/dimension guarded)
    let customBackgroundBuffer: Buffer | undefined;
    if (customBackgroundAttachment) {
      const result = await fetchUserImage(customBackgroundAttachment);
      if (result.error) {
        await replyWithEphemeralError(
          interaction,
          getImageFetchErrorMessage(result.error, locale),
        );
        return;
      }
      customBackgroundBuffer = result.buffer;
    }

    // Generate the dialogue image with default advanced settings;
    // the Adjust/Effects buttons on the message expose the rest
    const params: DialogueParams = {
      command: "dialogue",
      gameId,
      characterId,
      expressionId: finalExpressionId,
      text,
      backgroundId: customBackgroundBuffer ? undefined : backgroundId,
      stretchMode: "zoom_x",
      fontId: game.fonts.textDefaultFont,
      fontSize: game.layout.defaultFontSize,
      highlightBrackets: true,
      nameLocale: nameLanguage,
      filter: ImageFilter.NONE,
      spoiler: interaction.options.getBoolean("spoiler") ?? false,
    };
    const imageBuffer = await renderGeneration(params, customBackgroundBuffer);
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
          imageBuffer: customBackgroundBuffer,
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
          imageBuffer: customBackgroundBuffer,
        });
      }
    }
  } catch (error) {
    console.error("Error generating dialogue image:", error);
    await replyWithEphemeralError(
      interaction,
      getResponseMessage("genericError", locale),
    );
  }
}
