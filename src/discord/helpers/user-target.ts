import {
  APIApplicationCommandBasicOption,
  ApplicationCommandOptionType,
} from "npm:@buape/carbon";

export const userTarget: APIApplicationCommandBasicOption = {
  name: "user",
  type: ApplicationCommandOptionType.User,
  description: "User to ping",
  required: false,
};
