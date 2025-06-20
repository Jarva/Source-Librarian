import {
  APIEmbedField,
  AutocompleteInteraction,
  Command,
  CommandInteraction,
  CommandOptions,
  Embed,
} from "@buape/carbon";
import { userTargetOption } from "../../../helpers/user-target.ts";
import {addonAutocomplete, addonOption, addons} from "../addons.ts";
import { getMention, isEphemeral } from "../../../helpers/ephemeral.ts";
import { cache } from "../addon-cache.ts";
import { time, TimestampStyles } from "@discordjs/formatters";
import { channelMention } from "../../../helpers/mention.ts";

export class AddonInfoCommand extends Command {
  name = "info";
  description = "Information for a specific Ars addon";

  options: CommandOptions = [
    addonOption,
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

    const mod = await cache.fetch(addon.id, { signal: AbortSignal.timeout(5000) });
    if (mod === undefined) {
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
      color: 0x231631,
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
