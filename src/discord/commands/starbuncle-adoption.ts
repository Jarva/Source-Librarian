import {
  Command,
  type CommandInteraction,
  InteractionContextType,
  Permission,
} from "@buape/carbon";
import { StarbuncleAdoptionModal } from "@/discord/modals/starbuncle-adoption.ts";

export class StarbuncleAdoptionCommand extends Command {
  name = "starbuncle-adoption";
  description = "Open the Starbuncle adoption form";
  permission = Permission.ManageRoles;

  contexts: InteractionContextType[] = [InteractionContextType.Guild];

  async run(interaction: CommandInteraction) {
    const modal = new StarbuncleAdoptionModal();
    await interaction.showModal(modal);
  }
}
