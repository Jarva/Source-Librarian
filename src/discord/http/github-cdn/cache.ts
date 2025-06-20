import { LRUCache } from "npm:lru-cache";
import { client } from "./client.ts";
import { ExportedGlyph } from "./glyphs/types.ts";
import sharp from "npm:sharp";

interface GlyphCache {
  type: "GlyphCache";
  entries: Record<string, ExportedGlyph>;
}

interface LangCache {
  type: "LangCache";
  entries: Record<string, string>;
}

interface TextureCache {
  type: "TextureCache";
  entries: Blob;
}

type CacheEntry = GlyphCache | LangCache | TextureCache;

export const cache = new LRUCache<string, CacheEntry>({
  max: 100,
  ttl: 1000 * 60 * 60,
  allowStaleOnFetchRejection: true,
  allowStaleOnFetchAbort: true,
  fetchMethod: async (key) => {
    try {
      const res = await client.get(key);
      if (key === "Jarva/ArsAddonBuilder/output/glyphs.json") {
        return {
          type: "GlyphCache",
          entries: await res.json(),
        };
      }
      if (key === "Jarva/ArsAddonBuilder/output/lang/en_us.json") {
        return {
          type: "LangCache",
          entries: await res.json(),
        };
      }
      if (key.startsWith("Jarva/ArsAddonBuilder/output/resources")) {
        const image = await res.blob();
        const buffer = await image.arrayBuffer();
        const resized = await sharp(buffer)
            .resize(128, null, {kernel: "nearest"})
            .toBuffer();
        return {
          type: "TextureCache",
          entries: new Blob([resized], {type: image.type}),
        };
      }
    } catch (error) {
      console.log(error);
    }
  },
});
