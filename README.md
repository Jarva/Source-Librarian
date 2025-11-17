# Source Librarian

A Discord bot designed to assist the Ars Nouveau community with comprehensive information about the mod, its addons, and gameplay mechanics.

## Overview

Source Librarian is a feature-rich Discord bot built with Deno that provides quick access to:
- Ars Nouveau addon information from CurseForge
- Game mechanic quick-reference tips
- Glyph search and discovery
- Community utilities and helpers

## Tech Stack

- **Runtime**: Deno
- **Language**: TypeScript
- **Discord Framework**: [@buape/carbon](https://github.com/buape/carbon)
- **Web Framework**: [Hono](https://hono.dev/)
- **APIs**: CurseForge API, GitHub API
- **Image Processing**: Sharp
- **Caching**: LRU Cache
- **Search**: Fuse.js (fuzzy search)

## Features

### Addon Management
- **Addon Info**: Retrieve detailed information about Ars Nouveau addons from CurseForge
- **Glyph Search**: Search through available glyphs across different addons
- **Glyph List**: Browse comprehensive lists of glyphs organized by addon
- **Version Tracking**: Automatically fetches latest compatible versions for different Minecraft releases

### Game Mechanics Helpers
- **Mana Tips**: Quick reminders for increasing mana and regen
- **Enchanting/Imbuement Reminders**: Gentle nudges when the wrong block is used
- **Version Differences**: Highlights for older Ars Nouveau versions (e.g., 1.16.5)
- **Claim System**: Information about source claims
- **IFrames**: Invulnerability frame mechanics

### Utility Commands
- **Log Upload Helper**: Rehosts plaintext log attachments to mclo.gs
- **Lag Troubleshooting**: Common Spark profiling advice
- **Binary Search**: Guide users through binary search debugging
- **Ancient Knowledge**: Information about ancient spell knowledge
- **Infinite Glyphs**: Details on glyph slot configuration
- **Starbuncle Adoption**: Interactive starbuncle customization with color selection
- **Pin in Thread**: Utility for pinning messages within threads
- **LMGTFY**: Generate "Let Me Google That For You" links

## Project Structure

```
src/
├── discord/
│   ├── commands/          # Discord slash commands
│   │   ├── addons/        # Addon-related commands
│   │   └── *.ts           # Individual command implementations
│   ├── modals/            # Discord modal interactions
│   ├── listeners/         # Event listeners
│   ├── http/              # External API clients
│   │   ├── curseforge/    # CurseForge API integration
│   │   └── github-cdn/    # GitHub CDN for resources
│   ├── helpers/           # Discord-specific utilities
│   └── abstracts/         # Base classes
├── helpers/               # General utility functions
└── main.ts               # Application entry point
```

## Supported Addons

The bot tracks 40+ Ars Nouveau addons across multiple categories:
- **Essential**: Core addons highly recommended for most playthroughs
- **Supplementary**: Additional content and features
- **Compatibility**: Integration with other mods
- **Power Fantasy**: Enhanced power and capabilities
- **Retexture**: Visual improvements
- **Inadvisable**: Addons not recommended for general use

## License

LGPL-3.0. See `LICENSE` for details.

## Contributing

See `CONTRIBUTING.md` for guidelines.

## Support

For issues and feature requests, please visit the Ars Nouveau Discord community.
