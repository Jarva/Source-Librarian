import {
  AutocompleteInteraction,
  Command,
  CommandInteraction,
  CommandOptions,
} from "npm:@buape/carbon";
import { userTargetOption } from "../../../helpers/user-target.ts";
import {addonAutocomplete, addonOption, addons} from "../addons.ts";
import { getMention, isEphemeral } from "../../../helpers/ephemeral.ts";
import { channelMention } from "../../../helpers/mention.ts";
import { logger } from "../../../logger.ts";

export class AddonDiscussionCommand extends Command {
  name = "discussion";
  description = "Discussion channel for a specific Ars addon";

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
      logger.warn("No addon ID provided in discussion command");
      return interaction.reply({
        content: "No Addon provided",
      });
    }

    const addon = addons[id];

    if (!addon.channel) {
      logger.warn({ addonId: id }, "No discussion channel found for addon");
      return interaction.reply({
        content: "No discussion channel found."
      });
    }

    await interaction.reply({
      content: `${getMention(interaction) ?? ''}\n${channelMention(addon.channel)}`,
    });
  }
}
