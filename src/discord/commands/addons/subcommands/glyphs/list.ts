import { Command, CommandOptions, AutocompleteInteraction, CommandInteraction, APIEmbedField, Embed, MessagePayloadObject } from "@buape/carbon";
import {addonAutocomplete, addonOption, addons} from "../../addons.ts";
import {userTargetOption} from "../../../../helpers/user-target.ts";
import {isEphemeral} from "../../../../helpers/ephemeral.ts";
import {cache} from "../../../../http/github-cdn/cache.ts";
import {getMod, getTranslation} from "../../../../http/github-cdn/glyphs/helpers.ts";
import {ExportedGlyph} from "../../../../http/github-cdn/glyphs/types.ts";
import {capitalize} from "../../../../helpers/capitalize.ts";
import { cache as addonCache } from "../../addon-cache.ts";
import { Paginator } from "@buape/carbon/paginator"

export class AddonGlyphsListCommand extends Command {
    name = "list";
    description = "List Glyphs from an Addon";
    pageSize = 5;

    options: CommandOptions = [
        addonOption,
        userTargetOption,
    ]

    async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
      return await addonAutocomplete(interaction);
    }

    async run(interaction: CommandInteraction) {
        await interaction.defer({
            ephemeral: isEphemeral(interaction),
        });

        const id = interaction.options.getString("addon");
        if (id === undefined) {
            return await interaction.reply({
                content: "No Addon ID provided",
            });
        }

        const addon = addons[id];

        const mod = await addonCache.fetch(addon.id, { signal: AbortSignal.timeout(5000) });
        if (mod === undefined) {
            return await interaction.reply({
                content: "Unable to retrieve addon data",
            });
        }

        const glyphCache = await cache.fetch("Jarva/ArsAddonBuilder/output/glyphs.json", {
            signal: AbortSignal.timeout(5000),
        });

        if (glyphCache === undefined || glyphCache.type !== "GlyphCache") {
            return await interaction.reply({
                content: "Unable to retrieve glyph data",
            });
        }

        const addonGlyphs = Object.values(glyphCache.entries).toSorted((a, b) => a.typeIndex - b.typeIndex).reduce<ExportedGlyph[]>((acc, curr) => {
            const [ns] = curr.registryName.split(":")
            const modId = getMod(ns);

            if (modId == id) {
                acc.push(curr);
            }

            return acc;
        }, []);

        if (addonGlyphs.length === 0) {
            return await interaction.reply({
                content: "No glyphs found for that addon"
            });
        }

        const chunks = addonGlyphs.reduce<ExportedGlyph[][]>((acc, _, i, arr) => {
            if (i % this.pageSize === 0) {
                acc.push(arr.slice(i, i + this.pageSize));
            }
            return acc;
        }, []);

        const pages: MessagePayloadObject[] = [];
        for (const chunk of chunks) {
            const fields: APIEmbedField[] = [];

            for (const glyph of chunk) {
                const [namespace, path] = glyph.registryName.split(":");
                const type = await getTranslation(glyph.typeName.translate) ??
                    "Unknown Type";
                const description = await getTranslation(`${namespace}.glyph_desc.${path}`) ??
                    "Unknown Glyph";

                fields.push({
                    name: `**${type}:** ${glyph.name}`,
                    value: `${description}`
                });
            }

            pages.push({
                embeds: [
                    new Embed({
                        title: `${mod.name ?? capitalize(mod.name)} Glyphs`,
                        fields,
                        url: mod.link
                    })
                ]
            })
        }

        const paginator = new Paginator(pages, { client: interaction.client })
        await paginator.send(interaction)
    }
}
