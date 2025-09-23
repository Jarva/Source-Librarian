import {
  APIEmbedField,
  AutocompleteInteraction,
  Command,
  CommandInteraction,
  CommandOptions,
  Embed,
} from "npm:@buape/carbon";
import { userTargetOption } from "../../../helpers/user-target.ts";
import {addonAutocomplete, addons, getAddonOption} from "../addons.ts";
import { getMention, isEphemeral } from "../../../helpers/ephemeral.ts";
import { cache } from "../addon-cache.ts";
import { time, TimestampStyles } from "npm:@discordjs/formatters";
import { channelMention } from "../../../helpers/mention.ts";
import { logger } from "../../../logger.ts";
import { CONFIG } from "../../../config.ts";

export class AddonInfoCommand extends Command {
  name = "info";
  description = "Information about Ars addons";

  options: CommandOptions = [
    getAddonOption(false),
    userTargetOption,
  ];

  async autocomplete(interaction: AutocompleteInteraction) {
    return await addonAutocomplete(interaction);
  }

  async run(interaction: CommandInteraction) {
    await interaction.defer({
      ephemeral: isEphemeral(interaction),
    });

    const id = interaction.options.getString("addon");
    if (id === undefined) {
      return interaction.reply({
        content: "No Addon provided",
      });
    }

    const addon = addons[id];

    const mod = await cache.fetch(addon.id, { signal: AbortSignal.timeout(CONFIG.TIMEOUTS.CURSEFORGE_API) });
    if (mod === undefined) {
      logger.error({ addonId: addon.id }, "Unable to retrieve addon data");
      return await interaction.reply({
        content: "Unable to retrieve addon data",
      });
    }

    const versions = mod.versions.map((version) =>
      `[${version.name}](${version.link})`
    ).join(", ");

    const fields: APIEmbedField[] = [
      { name: "Supported Versions", value: `${versions}` },
      {
        name: "Last Updated",
        value: `${time(mod.last_updated, TimestampStyles.RelativeTime)}`,
        inline: true,
      },
      {
        name: "Downloads",
        value: `${mod.download_count.toLocaleString()}`,
        inline: true,
      },
    ];

    if (mod.issues != null) {
      fields.push({ name: "Issues", value: `${mod.issues}` });
    }

    if (mod.source != null) {
      fields.push({ name: "Source", value: `${mod.source}` });
    }

    if (addon && addon.channel) {
      fields.push({
        name: "Discussion",
        value: `${channelMention(addon.channel)}`,
      });
    }

    const embed = new Embed({
      title: `${mod.name} by ${mod.author}`,
      color: CONFIG.THEME.EMBED_COLOR,
      description: `${mod.summary}`,
      url: `${mod.link}`,
      thumbnail: {
        url: `${mod.logo}`,
      },
      fields,
    });

    await interaction.reply({
      content: getMention(interaction),
      embeds: [embed],
    });
  }
}
