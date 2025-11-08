import {
  APIEmbedField,
  AutocompleteInteraction,
  Command,
  CommandInteraction,
  CommandOptions,
  Embed,
  MessagePayloadObject,
} from "@buape/carbon";
import {
  addonAutocomplete,
  addonOption,
  addons,
} from "@/discord/commands/addons/addons.ts";
import { userTargetOption } from "@/discord/helpers/user-target.ts";
import { isEphemeral } from "@/discord/helpers/ephemeral.ts";
import {
  getMod,
  getTranslation,
} from "@/discord/http/github-cdn/glyphs/helpers.ts";
import { ExportedGlyph } from "@/discord/http/github-cdn/glyphs/types.ts";
import { capitalize } from "@/discord/helpers/capitalize.ts";
import { Paginator } from "@buape/carbon/paginator";
import { logger } from "@/logger.ts";
import { CONFIG } from "@/config.ts";
import {
  fetchAddonMod,
  fetchGlyphCache,
} from "@/discord/commands/addons/shared/glyph-utils.ts";

export class AddonGlyphsListCommand extends Command {
  name = "list";
  description = "List Glyphs from an Addon";
  pageSize = CONFIG.PAGE_SIZE;

  options: CommandOptions = [
    addonOption,
    userTargetOption,
  ];

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

    const mod = await fetchAddonMod(id);
    if (!mod) {
      return await interaction.reply({
        content: "Unable to retrieve addon data",
      });
    }

    const glyphResult = await fetchGlyphCache();
    if (!glyphResult.success) {
      return await interaction.reply({
        content: glyphResult.error,
      });
    }
    const { glyphCache } = glyphResult;

    const addonGlyphs = Object.values(glyphCache.data).toSorted((a, b) =>
      a.typeIndex - b.typeIndex
    ).reduce<ExportedGlyph[]>((acc, curr) => {
      const registryParts = curr.registryName.split(":");
      if (registryParts.length < 2) {
        logger.warn(
          { registryName: curr.registryName },
          "Invalid registry name format",
        );
        return acc;
      }
      const [ns] = registryParts;
      const modId = getMod(ns);

      if (modId === id) {
        acc.push(curr);
      }

      return acc;
    }, []);

    if (addonGlyphs.length === 0) {
      return await interaction.reply({
        content: "No glyphs found for that addon",
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
        const registryParts = glyph.registryName.split(":");
        if (registryParts.length < 2) {
          logger.warn(
            { registryName: glyph.registryName },
            "Invalid registry name format in glyph processing",
          );
          continue;
        }
        const [namespace, path] = registryParts;
        const type = await getTranslation(glyph.typeName.translate) ??
          "Unknown Type";
        const description =
          await getTranslation(`${namespace}.glyph_desc.${path}`) ??
            "Unknown Glyph";

        fields.push({
          name: `**${type}:** ${glyph.name}`,
          value: `${description}`,
        });
      }

      pages.push({
        embeds: [
          new Embed({
            title: `${mod.name ?? capitalize(id)} Glyphs`,
            color: CONFIG.THEME.EMBED_COLOR,
            fields,
            url: mod.link,
          }),
        ],
      });
    }

    const paginator = new Paginator(pages, { client: interaction.client });
    await paginator.send(interaction);
  }
}
