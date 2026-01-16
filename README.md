# Natsume Anan Sketchbook Discord Bot

A Discord user application that generates images with text and/or images on Anan's sketchbook. Users can customize facial expressions, text alignment, and send results to channels or direct messages.

![Natsume Anan Sketchbook Example](./assets/example.png)

## Features

- Generate sketchbook images with custom text
- Paste images onto the sketchbook
- Combine both text and images on the same sketchbook
- 12 different facial expressions to choose from
- Customizable text alignment (horizontal and vertical)
- Optional overlay effect for realistic sketchbook appearance
- Two text wrapping algorithms: greedy (fast) and Knuth-Plass (better quality)
- Send results to channel or DM

## Available Expressions

| Expression | Description |
|------------|-------------|
| Normal | Default neutral expression |
| Happy | Cheerful smiling face |
| Angry | Upset or annoyed expression |
| Speechless | Blank or deadpan look |
| Blush | Embarrassed blushing face |
| Yandere | Obsessive love expression |
| Closed Eyes | Eyes closed peacefully |
| Sad | Unhappy or melancholic look |
| Scared | Frightened expression |
| Excited | Energetic and enthusiastic |
| Surprised | Shocked or amazed face |
| Crying | Tearful sad expression |

## Prerequisites

- Node.js 18.0.0 or higher
- pnpm (recommended) or npm
- A Discord application with bot token

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yuna0x0/anan-sketchbook-discord.git
   cd anan-sketchbook-discord
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Fill in your Discord credentials in `.env`:
   ```
   DISCORD_TOKEN=your_discord_bot_token_here
   APPLICATION_ID=your_application_id_here
   ```

## Setting Up Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section and click "Add Bot"
4. Copy the bot token and add it to your `.env` file as `DISCORD_TOKEN`
5. Copy the Application ID from the "General Information" section and add it to your `.env` file as `APPLICATION_ID`
6. Go to "OAuth2" > "URL Generator"
7. Select scopes: `bot`, `applications.commands`
8. Select bot permissions: `Send Messages`, `Attach Files`, `Use Slash Commands`
9. Copy the generated URL and use it to invite the bot to your server

## Usage

### Register Commands

Before using the bot, you need to register the slash commands with Discord:

```bash
pnpm register
```

Note: Global commands may take up to 1 hour to appear in all servers.

### Start the Bot

Development mode (with hot reload):
```bash
pnpm dev
```

Production mode:
```bash
pnpm build
pnpm start
```

### Using the Command

Once the bot is running and invited to your server, use the `/sketchbook` command:

```
/sketchbook text:"Hello World!" expression:Happy
```

#### Command Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `text` | String | No* | The text to display on the sketchbook |
| `image` | Attachment | No* | An image to paste on the sketchbook |
| `expression` | Choice | No | Anan's facial expression (default: Normal) |
| `align` | Choice | No | Horizontal text alignment: Left, Center, Right (default: Center) |
| `valign` | Choice | No | Vertical text alignment: Top, Middle, Bottom (default: Middle) |
| `dm` | Boolean | No | Send the result to your DMs instead of the channel |
| `overlay` | Boolean | No | Apply the overlay effect (default: true) |
| `wrap` | Choice | No | Text wrapping algorithm: Greedy or Knuth-Plass (default: Greedy) |

*At least one of `text` or `image` must be provided.

#### Examples

Text only:
```
/sketchbook text:"Welcome to my server!"
```

Image only:
```
/sketchbook image:<attach an image>
```

Text and image with custom expression:
```
/sketchbook text:"Look at this!" image:<attach an image> expression:Excited
```

Send to DM with custom alignment:
```
/sketchbook text:"Secret message" dm:true align:Left valign:Top
```

## Project Structure

```
anan-sketchbook-discord/
├── assets/                   # Image assets and fonts
│   ├── base.png              # Base sketchbook image (normal)
│   ├── base_overlay.png      # Overlay for realistic effect
│   ├── happy.png             # Happy expression
│   ├── angry.png             # Angry expression
│   ├── speechless.png        # Speechless expression
│   ├── blush.png             # Blush expression
│   ├── yandere.png           # Yandere expression
│   ├── closed_eyes.png       # Closed eyes expression
│   ├── sad.png               # Sad expression
│   ├── scared.png            # Scared expression
│   ├── excited.png           # Excited expression
│   ├── surprised.png         # Surprised expression
│   ├── crying.png            # Crying expression
│   └── font.ttf              # Custom font for text rendering
├── src/
│   ├── index.ts              # Main entry point
│   ├── register.ts           # Command registration script
│   ├── config.ts             # Configuration and constants
│   ├── commands/
│   │   ├── index.ts          # Command exports
│   │   └── sketchbook.ts     # Sketchbook slash command
│   └── utils/
│       ├── imageGenerator.ts # Image generation logic
│       └── textWrapper.ts    # Text wrapping algorithms
├── .env.example              # Environment variables template
├── package.json              # Project dependencies
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## Special Text Effects

Text enclosed in square brackets `[]` will be displayed in purple color:

```
/sketchbook text:"This is normal but [this is purple] text"
```

## Dependencies

- [discord.js](https://discord.js.org/) - Discord API library
- [canvas](https://www.npmjs.com/package/canvas) - Image manipulation
- [dotenv](https://www.npmjs.com/package/dotenv) - Environment variable loading

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Credits

- Original concept and assets from [Anan's Sketchbook Chat Box](https://github.com/MarkCup-Official/Anan-s-Sketchbook-Chat-Box)
- Character Natsume Anan is from the game [Magical Girl Witch Trials](https://store.steampowered.com/app/3101040/Magical_Girl_Witch_Trials/)

## Disclaimer

This project is for personal use and learning purposes only. The character assets belong to their respective copyright holders. When distributing, please ensure compliance with the original material's copyright and secondary creation guidelines.
