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

export class StarbuncleAdoptionCommand extends Command {
  name = "starbuncle-adoption";
  description = "Create a button that opens the Starbuncle adoption form";

  contexts: InteractionContextType[] = [InteractionContextType.Guild];
  permission = Permission.ManageGuild;

  async run(interaction: CommandInteraction) {
    const file = new Blob([
      Deno.readFileSync("./resources/starbuncle_colors.png"),
    ]);
    await interaction.reply({
      content: [
        "# Adopt-A-Starbuncle",
        "Patreon supporters are able to adopt Starbuncles that randomly spawn in the world.",
        "These Starbuncles retain their name, color, adopter name and biography even when turned into Starbuncle Tokens.",
        "",
        "Before you start the form, you'll need to [find your Minecraft UUID](<https://minecraftuuid.com/>)",
        "Once that's done, click button below to start the adoption process <a:starbuncle_speed:860323942005997588>",
      ].join("\n"),
      files: [
        {
          name: "starbuncle_colors.png",
          data: file,
        },
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
    const name = interaction.member.nickname ??
      interaction.member.user.globalName ?? undefined;
    const modal = new StarbuncleAdoptionModal({ name });
    await interaction.showModal(modal);
  }
}
