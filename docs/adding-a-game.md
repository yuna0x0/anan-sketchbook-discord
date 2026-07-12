# Adding a New Game

The dialogue system is multi-game: each game contributes its own characters,
backgrounds, dialogue box layout, fonts, and localizations through a
`GameDefinition` (see `src/config/games/types.ts`) registered in
`src/config/games/index.ts`. The `/dialogue` command exposes registered games
as static choices on its `game` option, and all character/expression/background
autocomplete and validation is scoped to the selected game.

Adding a game is a code change: follow the steps below, and the per-game
invariant tests validate the new game automatically.

## 1. Add the assets

Create the game's asset tree under `assets/games/<gameId>/dialogue/`:

```
assets/games/<gameId>/dialogue/
  ui/<overlay>.webp                      # text-box frame, drawn over the background
  backgrounds/<any-name>.webp            # one file per background
  characters/<charId>/<charId>_<n>.webp  # one sprite per expression, n is 1-based
```

- The overlay is stretched to the full canvas.
- Character sprites are drawn at native size at the game's configured
  `characterPosition`, so pre-size them to fit the game's dialogue box.
- Sprite files must be numbered `1..N` matching the character's
  `expressions` array length.
- Assets are lossless WebP. Sprite paths always append `SPRITE_EXTENSION`
  (`src/config/games/paths.ts`); backgrounds and the overlay carry full
  filenames in the game config, and the loader (`loadImageFromPath`)
  detects the format from file content, converting formats node-canvas
  cannot decode natively. Use `scripts/convert-assets-to-webp.ts` to
  convert PNG sources with pixel-identity verification.

Fonts are shared across games in `assets/fonts/`; add new fonts to
`src/config/fonts.ts` if the game needs one.

## 2. Create the game module

Create `src/config/games/<gameId>/` mirroring the Manosaba module
(`src/config/games/manosaba/`):

```
src/config/games/<gameId>/
  index.ts               # exports the GameDefinition
  characters.ts          # <GAMEID>_CHARACTERS + <GameId>CharacterId type
  backgrounds.ts         # <GAMEID>_BACKGROUNDS + default background id
  locales/
    characters.ts        # character name localizations
    backgrounds.ts       # background name localizations
    expressions.ts       # expression name localizations
    gameName.ts          # localized game title (shown as the option choice)
```

- `characters.ts`: for each character define `id`, `expressions` (IDs like
  `<charId>_expression_<n>`), `themeColor` (used for `[bracket]` highlighting),
  `nameConfig` (per-locale hand-placed glyphs for the name plate), and
  optionally `hidden: true` for spoiler characters.
- Use `satisfies` for compile-time exhaustiveness, e.g.
  `satisfies Record<MyGameCharacterId, LocalizationMap>` in the locale tables,
  so adding a character without a name localization fails `pnpm build`.

## 3. Export the GameDefinition

In `<gameId>/index.ts`, assemble the `GameDefinition`:

- `layout`: measure the game's dialogue box: canvas size, character sprite
  position, text area start/end, default font size, line height, shadow, and
  default text color.
- `fonts`: default/fallback dialogue text fonts and per-locale name plate
  fonts.
- `overlayFilename`, `defaultBackgroundId`.
- `supportedNameLocales` / `fallbackNameLocale`: locales the name plate
  supports; these drive the `language` option and the Adjust modal.
- `localizations`: the tables from `locales/`.

## 4. Register the game

Add one import and one entry in `src/config/games/index.ts`:

```ts
import { MYGAME } from "./mygame/index.js";

export const GAMES = {
  manosaba: MANOSABA,
  mygame: MYGAME,
} as const satisfies Record<string, GameDefinition>;
```

## 5. Validate

```
pnpm build && pnpm test
```

`test/config/games.test.ts` runs invariants for every registered game:
localization completeness, valid fonts, default background, and that every
sprite/background/overlay file exists on disk at the expected path.

## 6. Re-register the slash commands

The `game` option's choices are baked into the command definition, so publish
the update:

```
pnpm register
```

Then verify in a test guild: `/dialogue game:<new game>` should scope
character, expression, and background autocomplete to the new game, and the
Adjust/Effects buttons on a generated image should re-render correctly.
