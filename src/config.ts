export const CONFIG = {
  CACHE: {
    TTL: 1000 * 60 * 60, // 1 hour
    MAX_SIZE: 100,
  },
  TIMEOUTS: {
    GITHUB_CDN: 5000, // 5 seconds
    CURSEFORGE_API: 5000, // 5 seconds
  },
  PAGE_SIZE: 5,
  SUPPORTED_VERSIONS: ["1.16.5", "1.18.2", "1.19.2", "1.20.1", "1.21.1"],
  THEME: {
    EMBED_COLOR: 0x231631,
  },
  GLYPH: {
    UNLIMITED_SPELL_LIMIT: 2147483647,
  },
} as const;
