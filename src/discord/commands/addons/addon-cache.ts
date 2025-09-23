import { LRUCache } from "npm:lru-cache";
import { addons } from "./addons.ts";
import { Root } from "../../http/curseforge/types.ts";
import { client } from "../../http/curseforge/client.ts";
import { logger } from "../../../logger.ts";
import { CONFIG } from "../../../config.ts";

interface Version {
  name: string;
  link: string;
}

interface Mod {
  name: string;
  link: string;
  summary: string;
  author: string;
  logo: string;
  versions: Version[];
  last_updated: Date;
  download_count: number;
  issues: string | null;
  source: string | null;
}


export const cache = new LRUCache<string, Mod>({
  max: Object.keys(addons).length,
  ttl: CONFIG.CACHE.TTL,
  allowStaleOnFetchRejection: true,
  allowStaleOnFetchAbort: true,
  fetchMethod: async (key) => {
    try {
      const root = await client.get<Root>(`mods/${key}`).json();

      if (root == null) {
        throw new Error("Unable to retrieve mod");
      }

      const { data: mod } = root;

      const supported = mod.latestFilesIndexes.filter((version) =>
        CONFIG.SUPPORTED_VERSIONS.includes(version.gameVersion)
      );
      const released = supported.filter((version) => version.releaseType === 1);
      const deduped = released.filter((version, index, self) =>
        self.findIndex((other) => other.gameVersion === version.gameVersion) ===
        index
      );

      const versions = deduped.map((file) => ({
        name: file.gameVersion,
        link: `${mod.links.websiteUrl}/files/${file.fileId}`,
      }));

      return {
        name: mod.name,
        link: mod.links.websiteUrl,
        summary: mod.summary,
        author: mod.authors[0].name,
        logo: mod.logo.url,
        versions: versions,
        last_updated: new Date(mod.dateReleased),
        download_count: mod.downloadCount,
        issues: mod.links.issuesUrl,
        source: mod.links.sourceUrl,
      };
    } catch (err) {
      logger.error({ err, key }, "Failed to fetch addon mod data");
      throw err;
    }
  },
});
