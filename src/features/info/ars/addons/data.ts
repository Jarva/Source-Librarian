import { LRUCache } from "lru-cache";
import {instance} from "../../../../util/curseforge/http";
import {Root} from "../../../../util/curseforge/types/mod";

export const categories = [
    { name: "Essentials", value: "essential", description: "Virtually required to get the full Ars experience." },
    { name: "Compatibility", value: "compat", description: "Focused on integrating with other mods." },
    { name: "Power Fantasy", value: "power-fantasy", description: "Focused on increasing the players power level." },
    { name: "Supplementals", value: "supplemental", description: "Focused on adding new content." },
    { name: "Retextures", value: "retexture", description: "Focused on changing the appearance of Ars content." },
    { name: "Inadvisable", value: "inadvisable", description: "Not recommended for use due to poor quality." },
] as const;

export type Categories = (typeof categories[number])["value"];

interface Addon {
    id: string;
    categories: Categories[];
    featured?: boolean;
    channel?: string;
}

export const addons: Record<string, Addon> = {
    "ars-additions": {
        id: "974408",
        categories: ["essential"],
        featured: true,
        channel: "1207058223421595749",
    },
    "ars-controle": {
        id: "1061812",
        categories: ["supplemental"],
        channel: "1262068003072114750",
    },
    "ars-technica": {
        id: "1096161",
        categories: ["supplemental", "compat"],
        featured: true,
        channel: "1281613727824613467",
    },
    "ars-creo": {
        id: "575698",
        categories: ["compat"],
        channel: "928865526078402580",
    },
    "ars-instrumentum": {
        id: "580179",
        categories: ["supplemental"],
        channel: "1019845252426776616",
    },
    "ars-energistique": {
        id: "905641",
        categories: ["compat"],
        channel: "1041655048574349342",
    },
    "not-enough-glyphs": {
        id: "1023517",
        categories: ["essential"],
        featured: true,
        channel: "1222861594657030205"
    },
    "ars-trinkets": {
        id: "950506",
        categories: ["supplemental", "power-fantasy"],
        channel: "1189292470631141376",
    },
    "starbunclemania": {
        id: "746215",
        categories: ["supplemental"],
        channel: "1039885588310020176",
    },
    "adams-ars-plus": {
        id: "1011093",
        categories: ["supplemental", "power-fantasy"],
        channel: "1235001538611511357"
    },
    "ars-omega": {
        id: "597007",
        categories: ["power-fantasy", "supplemental"],
        channel: "1019672498213761084"
    },
    "ars-delight": {
        id: "1131668",
        categories: ["supplemental", "compat"],
        channel: "1301539822640435261"
    },
    "ars-elemental": {
        id: "561470",
        categories: ["essential"],
        featured: true,
        channel: "1235001538611511357",
    },
    "ars-scalaes": {
        id: "630431",
        categories: ["compat"],
        channel: "1032058122505826375"
    },
    "tome-of-blood-rebirth": {
        id: "911546",
        categories: ["compat"],
        channel: "1131511198156857495"
    },
    "ars-ocultas": {
        id: "907843",
        categories: ["compat"],
        channel: "1131511198156857495"
    },
    "ars-fauna": {
        id: "1055577",
        categories: ["supplemental"],
        channel: "1258041008633942136",
    },
    "ars-artifice": {
        id: "854169",
        categories: ["supplemental"],
        channel: "1100053890411532408",
    },
    "too-many-glyphs": {
        id: "560595",
        categories: ["essential"],
        channel: "1022658726647316560",
    },
    "ars-artillery": {
        id: "1070559",
        categories: ["supplemental"],
        channel: "1265774509554794526",
    },
    "ars-caelum": {
        id: "821651",
        categories: ["supplemental"],
    },
    "all-the-arcanist-gear": {
        id: "1094032",
        categories: ["supplemental", "power-fantasy"],
    },
    "ars-elemancy": {
        id: "1153666",
        categories: ["supplemental", "power-fantasy"],
        channel: "1303504513830752306",
    },
    "ars-polymorphia": {
        id: "1197614",
        categories: ["compat"],
    },
    "custom-machinery-ars-nouveau": {
        id: "969074",
        categories: ["compat"],
    },
    "modular-machinery-reborn-ars-nouveau": {
        id: "1132269",
        categories: ["compat"],
    },
    "reliquified-ars-nouveau": {
        id: "1196449",
        categories: ["supplemental", "compat"],
    },
    "ars-nouveau-refresh": {
        id: "1080571",
        categories: ["retexture"],
    },
    "ars-nouveau-brassified": {
        id: "934703",
        categories: ["retexture"],
    },
    "ars-loafers": {
        id: "1254524",
        categories: ["retexture"],
    },
    "ars-technic": {
        id: "929916",
        categories: ["inadvisable"],
    },
    "ars-knight-n-mages": {
        id: "914713",
        categories: ["supplemental"],
    },
    "samurai-dynasty": {
        id: "848381",
        categories: ["supplemental", "compat"],
    },
    "geore-nouveau": {
        id: "667803",
        categories: ["compat"],
    },
    "enigmatic-unity": {
        id: "808025",
        categories: ["compat"],
    },
    "ars-nouveau-dynamic-trees": {
        id: "874028",
        categories: ["compat"],
    },
    "hex-ars-linker": {
        id: "1134295",
        categories: ["compat"],
        channel: "1338086578668703765",
    },
    "ars-expanded-combat": {
        id: "957830",
        categories: ["compat"],
    },
    "ars-extended-glyphs": {
        id: "936742",
        categories: ["inadvisable"],
    },
    "not-enough-sourcelinks": {
        id: "1159429",
        categories: ["inadvisable"],
    },
    "ars-botania": {
        id: "1194681",
        categories: ["inadvisable"],
    },
    "ars-unification": {
        id: "1165429",
        categories: ["compat"],
        channel: "1321449687047340082",
    },
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

const SUPPORTED_VERSIONS = ["1.16.5", "1.18.2", "1.19.2", "1.20.1", "1.21.1"];

export const data = new LRUCache<string, Mod>({
    max: Object.keys(addons).length,
    ttl: 1000 * 60 * 60,
    allowStaleOnFetchRejection: true,
    allowStaleOnFetchAbort: true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchMethod: async (key, stale, { options, signal, context }) => {
        console.log(`Re-fetching data from key: ${key}`);
        const { data: root } = await instance.get<Root>(`/mods/${key}`);
        if (root == null) {
            throw new Error("Unable to retrieve mod")
        }
        const { data: mod } = root;

        const versions = mod.latestFilesIndexes
            .filter(version => SUPPORTED_VERSIONS.includes(version.gameVersion))
            .filter(version => version.releaseType === 1)
            .map(file => ({
                name: file.gameVersion,
                link: `${mod.links.websiteUrl}/files/${file.fileId}`,
            }))
            .filter(((version, index, self) => index === self.findIndex((t) => t.name === version.name)));

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
        }
    }
})
