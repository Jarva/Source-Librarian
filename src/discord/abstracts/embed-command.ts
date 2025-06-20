import {
  APIEmbedField,
  Command,
  CommandInteraction,
  CommandOptions,
  Embed,
  InteractionContextType,
} from "npm:@buape/carbon";
import { userTargetOption } from "../helpers/user-target.ts";
import { getEphemeral, getMention } from "../helpers/ephemeral.ts";

export abstract class BaseEmbedCommand extends Command {
  abstract name: string;
  abstract description: string;
  title?: string;
  abstract lines: string[];
  url?: string;
  image?: string;
  extraFields: APIEmbedField[] = [];

  options: CommandOptions = [
    userTargetOption,
  ];

  contexts: InteractionContextType[] = [InteractionContextType.Guild];

  async run(interaction: CommandInteraction) {
    const embed = new Embed({
      title: this.title ?? this.description,
      color: 0x231631,
      description: this.lines.join("\n"),
      image: this.image
        ? {
          url: this.image,
        }
        : undefined,
      url: this.url,
      fields: [
        ...this.extraFields,
        {
          name: "Noticed a problem?",
          value: "Please raise an issue with <@202407548916203520>",
        },
      ],
    });

    await interaction.reply({
      content: getMention(interaction),
      embeds: [embed],
      flags: getEphemeral(interaction),
    });
  }
}
