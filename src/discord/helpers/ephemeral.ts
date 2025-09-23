import {
  APIApplicationCommandBasicOption,
  CommandInteraction,
  MessageFlags,
} from "npm:@buape/carbon";
import { userTargetOption } from "./user-target.ts";
import { mention } from "./mention.ts";

export const isEphemeral = (
  interaction: CommandInteraction,
  target: APIApplicationCommandBasicOption = userTargetOption,
) => !interaction.options.getUser(target.name);

export const getEphemeral = (
  interaction: CommandInteraction,
  target: APIApplicationCommandBasicOption = userTargetOption,
) => isEphemeral(interaction, target) ? MessageFlags.Ephemeral : 0;

export const getMention = (
  interaction: CommandInteraction,
  target: APIApplicationCommandBasicOption = userTargetOption,
) => {
  const user = interaction.options.getUser(target.name);
  if (user) return mention(user);
  return undefined;
};
