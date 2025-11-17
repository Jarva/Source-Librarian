import {
  APIApplicationCommandBasicOption,
  ApplicationCommandOptionType,
  AutocompleteInteraction,
} from "@buape/carbon";
import { addons, type Addon } from "@/discord/commands/addons/data.ts";

export { addons, type Addon };

export const choices = Object.entries(addons).filter(([, addon]) =>
  !addon.private
).map(
  ([key]) => ({ value: `${key}`, name: `${key}` }),
);

export const addonOption: APIApplicationCommandBasicOption = {
  name: "addon",
  type: ApplicationCommandOptionType.String,
  description: "The name of the Ars Addon",
  required: true,
  autocomplete: true,
};

export const getAddonOption = (
  required: boolean,
): APIApplicationCommandBasicOption => ({
  ...addonOption,
  required,
});

export const addonAutocomplete = async (
  interaction: AutocompleteInteraction,
): Promise<void> => {
  const { name: option, value } = interaction.options.getFocused()!;
  if (option !== addonOption.name) return;
  if (value === undefined) {
    const chosen = choices.slice(0, 25);
    return await interaction.respond(chosen);
  }

  if (typeof value === "string") {
    const chosen = choices.filter((choice) => choice.name.includes(value))
      .slice(0, 25);
    return await interaction.respond(chosen);
  }
};
