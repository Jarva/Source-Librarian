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
    if (!interaction.member) return;
    const name = interaction.member.nickname ??
      interaction.member.user.globalName ?? undefined;
    const modal = new StarbuncleAdoptionModal({ name });
    await interaction.showModal(modal);
  }
}
