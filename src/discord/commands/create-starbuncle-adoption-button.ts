import {
  Button,
  type ButtonInteraction,
  ButtonStyle,
  Command,
  type CommandInteraction,
  InteractionContextType,
  Permission,
  Row,
} from "@buape/carbon";
import { StarbuncleAdoptionModal } from "@/discord/modals/starbuncle-adoption.ts";

export class CreateStarbuncleAdoptionButtonCommand extends Command {
  name = "create-starbuncle-adoption-button";
  description = "Create a button that opens the Starbuncle adoption form";

  contexts: InteractionContextType[] = [InteractionContextType.Guild];
  permission = Permission.ManageGuild;

  async run(interaction: CommandInteraction) {
    const file = new Blob([Deno.readFileSync("./resources/starbuncle_colors.png")])
    await interaction.reply({
      content:         [
        "Adopted Starbuncles can randomly spawn in the world. They drop a Starbuncle Token that retains their name, color, adopter name and bio.",
        "",
        "[Click here to find your Minecraft UUID](<https://minecraftuuid.com/>)"
      ].join("\n"),
      files: [
        {
          name: "starbuncle_colors.png",
          data: file
        }
      ],
      components: [new Row([new StarbuncleAdoptionButton()])],
    });
  }
}

class StarbuncleAdoptionButton extends Button {
  customId = "starbuncle_adoption:open";
  label = "Adopt a Starbuncle";
  style = ButtonStyle.Primary;

  async run(interaction: ButtonInteraction) {
    if (!interaction.member) return;
    const name = interaction.member.nickname ?? interaction.member.user.globalName ?? undefined;
    const modal = new StarbuncleAdoptionModal({ name });
    await interaction.showModal(modal);
  }
}
