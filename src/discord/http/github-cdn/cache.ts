import { LRUCache } from "lru-cache";
import { client } from "@/discord/http/github-cdn/client.ts";
import { ExportedGlyph } from "@/discord/http/github-cdn/glyphs/types.ts";
import sharp from "sharp";
import { PATHS } from "@/discord/http/github-cdn/paths.ts";
import { logger } from "@/logger.ts";
import { CONFIG } from "@/config.ts";

interface GlyphCache {
  type: "GlyphCache";
  data: Record<string, ExportedGlyph>;
}

interface LangCache {
  type: "LangCache";
  data: Record<string, string>;
}

interface TextureCache {
  type: "TextureCache";
  data: Blob;
}

type CacheEntry = GlyphCache | LangCache | TextureCache;

export const cache = new LRUCache<string, CacheEntry>({
  max: CONFIG.CACHE.MAX_SIZE,
  ttl: CONFIG.CACHE.TTL,
  allowStaleOnFetchRejection: true,
  allowStaleOnFetchAbort: true,
  fetchMethod: async (key: string) => {
    const res = await client.get(key);
    if (!res.ok) {
      const text = await res.text().catch(() => "<no body>");
      const error = new Error(
        `GitHub CDN fetch failed for ${key}: ${res.status} ${res.statusText} - ${text}`,
      );
      logger.error({
        key,
        status: res.status,
        statusText: res.statusText,
        responseText: text,
      }, "GitHub CDN fetch failed");
      throw error;
    }

    if (key === PATHS.glyphs) {
      return {
        type: "GlyphCache",
        data: await res.json(),
      };
    }
    if (key === PATHS.langEnUS) {
      return {
        type: "LangCache",
        data: await res.json(),
      };
    }
    if (key.startsWith(PATHS.animatedResourcesPrefix)) {
      const image = await res.blob();
      return {
        type: "TextureCache",
        data: image,
      };
    }
    if (key.startsWith(PATHS.resourcesPrefix)) {
      const image = await res.blob();
      const buffer = await image.arrayBuffer();
      const resized = await sharp(buffer)
        .resize(128, null, { kernel: sharp.kernel.nearest })
        .toBuffer();
      return {
        type: "TextureCache",
        data: new Blob([new Uint8Array(resized)], { type: image.type }),
      };
    }

    logger.error({ key }, "Unhandled cache key");
    throw new Error(`Unhandled cache key: ${key}`);
  },
});
