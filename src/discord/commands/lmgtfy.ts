import {
  ApplicationCommandOptionType,
  Command,
  CommandInteraction,
  CommandOptions,
  InteractionContextType,
} from "npm:@buape/carbon";
import { userTargetOption } from "@/discord/helpers/user-target.ts";
import { getEphemeral, getMention } from "@/discord/helpers/ephemeral.ts";

export class LmgtfyCommand extends Command {
  name = "lmgtfy";
  description = "When a user needs help finding Google";

  contexts: InteractionContextType[] = [InteractionContextType.Guild];

  options: CommandOptions = [
    {
      name: "query",
      description: "What should be googled?",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    userTargetOption,
  ];

  async run(interaction: CommandInteraction) {
    const query = interaction.options.getString("query");

    if (!query) {
      return await interaction.reply({
        content: "A query is required.",
        flags: getEphemeral(interaction),
      });
    }

    const mention = getMention(interaction);
    const url = `https://letmegooglethat.com/?q=${encodeURIComponent(query)}`;
    const content = `${mention ? `${mention}\n` : ""}[${query}](<${url}>)`;

    await interaction.reply({
      content,
      flags: getEphemeral(interaction),
    });
  }
}
