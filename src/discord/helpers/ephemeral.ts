import {
  APIApplicationCommandBasicOption,
  CommandInteraction,
  MessageFlags,
} from "@buape/carbon";
import { userTarget } from "./user-target.ts";
import { mention } from "./mention.ts";

export const isEphemeral = (
  interaction: CommandInteraction,
  target: APIApplicationCommandBasicOption = userTarget,
) => !interaction.options.getUser(target.name);

export const getEphemeral = (
  interaction: CommandInteraction,
  target: APIApplicationCommandBasicOption = userTarget,
) => isEphemeral(interaction, target) ? MessageFlags.Ephemeral : 0;

export const getMention = (
  interaction: CommandInteraction,
  target: APIApplicationCommandBasicOption = userTarget,
) => {
  const user = interaction.options.getUser(target.name);
  if (user) return mention(user);
  return undefined;
};
