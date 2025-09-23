import {
  APIEmbedField,
  ApplicationCommandOptionType,
  Command,
  CommandInteraction,
  CommandOptions,
  Embed,
} from "npm:@buape/carbon";
import { userTargetOption } from "@/discord/helpers/user-target.ts";
import { getMention, isEphemeral } from "@/discord/helpers/ephemeral.ts";
import { cache as addonCache } from "@/discord/commands/addons/addon-cache.ts";
import { logger } from "@/logger.ts";
import { CONFIG } from "@/config.ts";
import { fetchGlyphCache } from "@/discord/commands/addons/shared/glyph-utils.ts";
import {
  getAttachment,
  getImage,
  getMod,
  getTranslation,
} from "../../../../http/github-cdn/glyphs/helpers.ts";
import { addons } from "@/discord/commands/addons/addons.ts";
import Fuse from "npm:fuse.js";
import { capitalize } from "@/discord/helpers/capitalize.ts";

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

    const glyphResult = await fetchGlyphCache();
    if (!glyphResult.success) {
      return await interaction.reply({
        content: glyphResult.error,
      });
    }
    const { glyphCache } = glyphResult;

    const entries = Object.values(glyphCache.data);

    const fuse = new Fuse(entries, { keys: [{ name: "name", weight: 10 }, "description"] });
    const matches = fuse.search(query, { limit: 1 });
    if (matches.length === 0) {
      return await interaction.reply({
        content: "Unable to find that glyph",
      });
    }

    const firstMatch = matches[0];
    if (!firstMatch) {
      logger.error({ query }, "No glyph search results found");
      return await interaction.reply({
        content: "Unable to find that glyph",
      });
    }
    const { item: data } = firstMatch;

    const registryParts = data.registryName.split(":");
    if (registryParts.length < 2) {
      logger.error({ registryName: data.registryName }, "Invalid registry name format in search result");
      return await interaction.reply({
        content: "Invalid glyph data format",
      });
    }
    const [namespace, path] = registryParts;
    const mod = getMod(namespace);

    const addonEntry = addons[mod];
    let addon;
    if (addonEntry) {
      addon = await addonCache.fetch(addonEntry.id, {
        signal: AbortSignal.timeout(CONFIG.TIMEOUTS.CURSEFORGE_API),
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

    if (data.defaults.perSpellLimit !== CONFIG.GLYPH.UNLIMITED_SPELL_LIMIT) {
      fields.push({
        name: "Per Spell Limit",
        value: `${data.defaults.perSpellLimit}`,
      });
    }

    if (data.spellSchools.length > 0) {
      fields.push({
        name: "Schools",
        value: data.spellSchools.map((school: any) => capitalize(school.id)).join(
          ", ",
        ),
      });
    }

    const augments = Object.entries(data.defaults.augments.descriptions);
    if (augments.length > 0) {
      description += "\n";
    }
    for (const [glyph, { translate }] of augments as [string, { translate: string }][]) {
      const exported = glyphCache.data[glyph];
      if (!exported) {
        logger.warn({ glyph }, "Referenced glyph not found in cache");
        continue;
      }
      description += `\n**${exported.name}:** ${await getTranslation(
        translate,
      )}`;
    }

    const embed = new Embed({
      title: `**${type}:** ${data.name} from ${addon?.name ?? capitalize(mod)}`,
      color: CONFIG.THEME.EMBED_COLOR,
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
