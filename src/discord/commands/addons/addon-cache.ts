import { LRUCache } from "lru-cache";
import { addons } from "@/discord/commands/addons/addons.ts";
import { LatestFilesIndex, Root } from "@/discord/http/curseforge/types.ts";
import { client } from "@/discord/http/curseforge/client.ts";
import { logger } from "@/logger.ts";
import { CONFIG } from "@/config.ts";
import { groupBy } from "es-toolkit";

const getVersions = (
  latestFileIndexes: LatestFilesIndex[],
): LatestFilesIndex[] => {
  const byGameVersion = groupBy(latestFileIndexes, (v) => v.gameVersion);

  return Object.values(byGameVersion)
    .flatMap((versions) =>
      versions.reduce<{ versions: LatestFilesIndex[]; mostStable: number }>(
        (acc, curr) => {
          if (acc.mostStable > curr.releaseType) {
            acc.versions.push(curr);
            acc.mostStable = curr.releaseType;
          }
          return acc;
        },
        { versions: [], mostStable: 10 },
      ).versions
    );
};

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

const fileNameSuffix = ["", " (Beta)", " (Alpha)"];

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

      const versions = getVersions(mod.latestFilesIndexes).map((file) => ({
        name: file.gameVersion + fileNameSuffix[file.releaseType - 1],
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
