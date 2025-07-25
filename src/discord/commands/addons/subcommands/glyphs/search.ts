import {
  APIEmbedField,
  ApplicationCommandOptionType,
  Command,
  CommandInteraction,
  CommandOptions,
  Embed,
} from "@buape/carbon";
import { userTargetOption } from "../../../../helpers/user-target.ts";
import { getMention, isEphemeral } from "../../../../helpers/ephemeral.ts";
import { cache } from "../../../../http/github-cdn/cache.ts";
import { cache as addonCache } from "../../addon-cache.ts";
import {
  getAttachment,
  getImage,
  getMod,
  getTranslation,
} from "../../../../http/github-cdn/glyphs/helpers.ts";
import { addons } from "../../addons.ts";
import Fuse from "npm:fuse.js";
import { capitalize } from "../../../../helpers/capitalize.ts";

export class AddonGlyphsSearchCommand extends Command {
  name = "search";
  description = "Search for a Glyph";

  options: CommandOptions = [
    {
      name: "glyph",
      type: ApplicationCommandOptionType.String,
      description: "The name of the Glyph",
      required: true,
    },
    userTargetOption,
  ];

  async run(interaction: CommandInteraction) {
    await interaction.defer({
      ephemeral: isEphemeral(interaction),
    });

    const query = interaction.options.getString("glyph");
    if (query === undefined) {
      return interaction.reply({
        content: "No glyph name provided",
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

    const entries = Object.values(glyphCache.entries);

    const fuse = new Fuse(entries, { keys: [{ name: "name", weight: 10 }, "description"] });
    const matches = fuse.search(query);
    if (matches.length === 0) {
      return await interaction.reply({
        content: "Unable to find that glyph",
      });
    }

    const [{ item: data }] = matches;

    const [namespace, path] = data.registryName.split(":");
    const mod = getMod(namespace);

    const addonEntry = addons[mod];
    let addon;
    if (addonEntry) {
      addon = await addonCache.fetch(addonEntry.id, {
        signal: AbortSignal.timeout(5000),
      });
    }

    const type = await getTranslation(data.typeName.translate) ??
      "Unknown Type";
    let description = await getTranslation(`${namespace}.glyph_desc.${path}`) ??
      "Unknown Glyph";
    const image = await getImage(mod, data.texture, data.animated);
    const attachment = getAttachment(image);

    const fields: APIEmbedField[] = [
      { name: "Tier", value: `${data.defaults.tier}`, inline: true },
      { name: "Cost", value: `${data.defaults.cost}`, inline: true },
    ];

    if (!data.defaults.enabled) {
      fields.push({
        name: "Enabled by default?",
        value: `${data.defaults.enabled}`,
      });
    }

    if (data.defaults.perSpellLimit !== 2147483647) {
      fields.push({
        name: "Per Spell Limit",
        value: `${data.defaults.perSpellLimit}`,
      });
    }

    if (data.spellSchools.length > 0) {
      fields.push({
        name: "Schools",
        value: data.spellSchools.map((school) => capitalize(school.id)).join(
          ", ",
        ),
      });
    }

    const augments = Object.entries(data.defaults.augments.descriptions);
    if (augments.length > 0) {
      description += "\n";
    }
    for (const [glyph, { translate }] of augments) {
      const exported = glyphCache.entries[glyph];
      description += `\n**${exported.name}:** ${await getTranslation(
        translate,
      )}`;
    }

    const embed = new Embed({
      title: `**${type}:** ${data.name} from ${addon?.name ?? capitalize(mod)}`,
      description: `${description}`,
      fields,
      thumbnail: attachment
        ? {
          url: `attachment://${attachment.name}`,
        }
        : undefined,
      url: addon?.link,
    });

    const mention = getMention(interaction);
    const prefix = mention ? `${mention}\n\n` : "";

    await interaction.reply({
      content: `${prefix}Result for search: ${query}`,
      embeds: [embed],
      files: attachment ? [attachment] : [],
    });
  }
}
