import {
  APIApplicationCommandBasicOption,
  ApplicationCommandOptionType,
  AutocompleteInteraction,
} from "@buape/carbon";
import { Categories } from "@/discord/commands/addons/categories.ts";

interface Addon {
  id: string;
  categories: Categories[];
  channel?: string;
  private?: boolean;
}

export const addons: Record<string, Addon> = {
  "ars_nouveau": {
    id: "401955",
    channel: "743298050222587982",
    categories: [],
    private: true,
  },
  "ars_additions": {
    id: "974408",
    channel: "1207058223421595749",
    categories: ["essential", "supplementary"],
  },
  "ars_controle": {
    id: "1061812",
    channel: "1262068003072114750",
    categories: ["supplementary"],
  },
  "ars_technica": {
    id: "1096161",
    channel: "1281613727824613467",
    categories: ["supplementary", "compat"],
  },
  "ars_creo": {
    id: "575698",
    channel: "928865526078402580",
    categories: ["compat"],
  },
  "ars_instrumentum": {
    id: "580179",
    channel: "1019845252426776616",
    categories: ["supplementary"],
  },
  "ars_energistique": {
    id: "905641",
    channel: "1041655048574349342",
    categories: ["compat"],
  },
  "not_enough_glyphs": {
    id: "1023517",
    channel: "1222861594657030205",
    categories: ["essential", "supplementary"],
  },
  "ars_trinkets": {
    id: "950506",
    channel: "1189292470631141376",
    categories: ["supplementary", "power-fantasy"],
  },
  "starbunclemania": {
    id: "746215",
    channel: "1039885588310020176",
    categories: ["supplementary"],
  },
  "adams_ars_plus": {
    id: "1011093",
    channel: "1235001538611511357",
    categories: ["supplementary", "power-fantasy"],
  },
  "ars_omega": {
    id: "597007",
    channel: "1019672498213761084",
    categories: ["power-fantasy", "supplementary"],
  },
  "ars_delight": {
    id: "1131668",
    channel: "1301539822640435261",
    categories: ["supplementary", "compat"],
  },
  "ars_elemental": {
    id: "561470",
    channel: "1019900714044100699",
    categories: ["essential", "supplementary"],
  },
  "ars_scalaes": {
    id: "630431",
    channel: "1032058122505826375",
    categories: ["compat"],
  },
  "tome_of_blood_rebirth": {
    id: "911546",
    channel: "1131511198156857495",
    categories: ["compat"],
  },
  "ars_ocultas": {
    id: "907843",
    channel: "1131511198156857495",
    categories: ["compat"],
  },
  "ars_fauna": {
    id: "1055577",
    channel: "1258041008633942136",
    categories: ["supplementary"],
  },
  "ars_artifice": {
    id: "854169",
    channel: "1100053890411532408",
    categories: ["supplementary"],
  },
  "too_many_glyphs": {
    id: "560595",
    channel: "1022658726647316560",
    categories: ["essential", "supplementary"],
  },
  "ars_artillery": {
    id: "1070559",
    channel: "1265774509554794526",
    categories: ["supplementary"],
  },
  "ars_caelum": {
    id: "821651",
    categories: ["supplementary"],
  },
  "all_the_arcanist_gear": {
    id: "1094032",
    categories: ["supplementary", "power-fantasy"],
  },
  "ars_elemancy": {
    id: "1153666",
    channel: "1303504513830752306",
    categories: ["supplementary", "power-fantasy"],
  },
  "ars_polymorphia": {
    id: "1197614",
    categories: ["compat"],
  },
  "custom_machinery_ars_nouveau": {
    id: "969074",
    categories: ["compat"],
  },
  "modular_machinery_reborn_ars_nouveau": {
    id: "1132269",
    categories: ["compat"],
  },
  "reliquified_ars_nouveau": {
    id: "1196449",
    categories: ["supplementary", "compat"],
  },
  "ars_nouveau_refresh": {
    id: "1080571",
    categories: ["retexture"],
  },
  "ars_nouveau_brassified": {
    id: "934703",
    categories: ["retexture"],
  },
  "ars_loafers": {
    id: "1254524",
    categories: ["retexture"],
  },
  "ars_technic": {
    id: "929916",
    categories: ["inadvisable"],
  },
  "ars_knight_n_mages": {
    id: "914713",
    categories: ["supplementary"],
  },
  "samurai_dynasty": {
    id: "848381",
    categories: ["supplementary", "compat"],
  },
  "geore_nouveau": {
    id: "667803",
    categories: ["compat"],
  },
  "enigmatic_unity": {
    id: "808025",
    categories: ["compat"],
  },
  "ars_nouveau_dynamic_trees": {
    id: "874028",
    categories: ["compat"],
  },
  "hex_ars_linker": {
    id: "1134295",
    channel: "1338086578668703765",
    categories: ["compat"],
  },
  "ars_expanded_combat": {
    id: "957830",
    categories: ["compat"],
  },
  "ars_extended_glyphs": {
    id: "936742",
    categories: ["inadvisable"],
  },
  "not_enough_sourcelinks": {
    id: "1159429",
    categories: ["inadvisable"],
  },
  "ars_botania": {
    id: "1194681",
    categories: ["inadvisable"],
  },
  "ars_unification": {
    id: "1165429",
    channel: "1321449687047340082",
    categories: ["compat"],
  },
  "ars_numerichud": {
    id: "1221985",
    channel: "1353092379628011650",
    categories: ["supplementary"],
  },
};

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
