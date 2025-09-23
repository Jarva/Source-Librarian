import { cache } from "@/discord/http/github-cdn/cache.ts";
import { cache as addonCache } from "@/discord/commands/addons/addon-cache.ts";
import { PATHS } from "@/discord/http/github-cdn/paths.ts";
import { CONFIG } from "@/config.ts";
import { logger } from "@/logger.ts";
import { addons } from "@/discord/commands/addons/addons.ts";

export interface GlyphFetchResult {
  success: true;
  glyphCache: {
    type: "GlyphCache";
    data: Record<string, any>;
  };
}

export interface GlyphFetchError {
  success: false;
  error: string;
}

export type GlyphFetchResponse = GlyphFetchResult | GlyphFetchError;

export async function fetchGlyphCache(): Promise<GlyphFetchResponse> {
  try {
    const glyphCache = await cache.fetch(PATHS.glyphs, {
      signal: AbortSignal.timeout(CONFIG.TIMEOUTS.GITHUB_CDN),
    });

    if (glyphCache === undefined || glyphCache.type !== "GlyphCache") {
      logger.error("Unable to retrieve glyph data");
      return {
        success: false,
        error: "Unable to retrieve glyph data",
      };
    }

    return {
      success: true,
      glyphCache,
    };
  } catch (error) {
    logger.error({ error }, "Failed to fetch glyph cache");
    return {
      success: false,
      error: "Unable to retrieve glyph data",
    };
  }
}

export async function fetchAddonMod(addonId: string) {
  try {
    const addon = addons[addonId];
    if (!addon) {
      logger.error({ addonId }, "Addon not found in registry");
      return null;
    }

    const mod = await addonCache.fetch(addon.id, {
      signal: AbortSignal.timeout(CONFIG.TIMEOUTS.CURSEFORGE_API),
    });

    if (mod === undefined) {
      logger.error({ addonId: addon.id }, "Unable to retrieve addon data");
      return null;
    }

    return mod;
  } catch (error) {
    logger.error({ error, addonId }, "Failed to fetch addon mod data");
    return null;
  }
}