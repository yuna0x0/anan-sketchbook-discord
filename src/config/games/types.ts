/**
 * Game Definition Types
 * Interfaces describing everything a supported game contributes to the
 * dialogue system: characters, backgrounds, dialogue box layout, fonts,
 * and localization tables.
 */

import { Locale, LocalizationMap } from "discord.js";
import { RGBColor } from "../types.js";
import { FontId } from "../fonts.js";

// Name text configuration for rendering character names
export interface NameTextConfig {
  text: string;
  position: { x: number; y: number };
  fontColor: RGBColor;
  fontSize: number;
}

// Supported locales for name configuration (using Discord Locale)
export type NameConfigLocale = Locale;

// Localized name configurations (partial record of Discord Locale to name config)
export type LocalizedNameConfig = Partial<
  Record<NameConfigLocale, NameTextConfig[]>
>;

// Character information
export interface CharacterInfo {
  id: string;
  expressions: string[];
  themeColor: RGBColor;
  nameConfig: LocalizedNameConfig;
  /**
   * Hidden characters are story spoilers: they are excluded from default
   * character suggestions and only revealed when a search query closely
   * matches one of their names.
   */
  hidden?: boolean;
}

// Dialogue box canvas layout, matching the game's in-game dialogue box
export interface DialogueLayoutConfig {
  // Canvas dimensions
  canvasWidth: number;
  canvasHeight: number;
  // Character sprite position
  characterPosition: { x: number; y: number };
  // Text area boundaries
  textPosition: { x: number; y: number };
  textAreaEnd: { x: number; y: number };
  // Default text settings
  defaultFontSize: number;
  // Smallest size the text may shrink to when it overflows the text area
  minFontSize: number;
  lineHeightMultiplier: number;
  // Shadow settings
  shadowOffset: { x: number; y: number };
  shadowColor: RGBColor;
  // Default text color
  defaultTextColor: RGBColor;
}

// Font selection for a game's dialogue rendering
export interface GameFontsConfig {
  // Default font for dialogue text
  textDefaultFont: FontId;
  // Fallback fonts for dialogue text
  textFallbackFonts: FontId[];
  // Character name font mapping by Discord locale
  nameLocaleFonts: Partial<Record<Locale, FontId>>;
  // Name font used when the locale has no entry in nameLocaleFonts
  nameFallbackFont: FontId;
}

// Localization tables for a game's content
export interface GameLocalizations {
  // Display name of the game itself, for the `game` command option choice
  gameName: LocalizationMap;
  // Character ID -> localized character names
  characterNames: Record<string, LocalizationMap>;
  // Background ID -> localized background names
  backgroundNames: Record<string, LocalizationMap>;
  // Expression ID (e.g. "ema_expression_1") -> localized expression names
  expressionNames: Record<string, LocalizationMap>;
}

// Everything a game contributes to the dialogue system
export interface GameDefinition {
  // Registry key; also the `game` option value, DialogueParams.gameId,
  // and the directory name under assets/games/
  id: string;
  characters: Record<string, CharacterInfo>;
  // Background ID -> filename under assets/games/<id>/dialogue/backgrounds/
  backgrounds: Record<string, string>;
  // Background used when none is selected
  defaultBackgroundId: string;
  layout: DialogueLayoutConfig;
  fonts: GameFontsConfig;
  // Filename under assets/games/<id>/dialogue/ui/
  overlayFilename: string;
  // Locales the name plate supports (drives the language option and adjust modal)
  supportedNameLocales: NameConfigLocale[];
  // Fallback locale when the requested locale has no name config
  fallbackNameLocale: NameConfigLocale;
  localizations: GameLocalizations;
}
