import {
FieldsHandler,
  Modal,
  type ModalInteraction,
  StringSelectMenu,
  TextInput,
  TextInputStyle,
} from "@buape/carbon";
import { withLabel } from "../helpers/with-label.ts";

export const STARBUNCLE_COLOR = {
  white: "White",
  orange: "Orange",
  magenta: "Magenta",
  light_blue: "Light Blue",
  yellow: "Yellow",
  lime: "Lime",
  pink: "Pink",
  gray: "Gray",
  light_gray: "Light Gray",
  cyan: "Cyan",
  purple: "Purple",
  blue: "Blue",
  brown: "Brown",
  green: "Green",
  red: "Red",
  black: "Black",
} as const;

export const STARBUNCLE_COLOR_OPTIONS = Object.entries(STARBUNCLE_COLOR).map((
  [value, label],
) => ({ value, label }));

interface AdoptionSettings {
  name?: string;
}

export class StarbuncleAdoptionModal extends Modal {
  title = "Starbuncle Adoption";
  customId = "starbuncle_adoption";

  constructor(settings: AdoptionSettings = {}) {
    super();

    this.components = [
      withLabel(
        {
          label: "Minecraft UUID",
          description: "https://minecraftuuid.com/",
        },
        TextInput,
        {
          customId: "starbuncle_uuid",
          maxLength: 36,
          minLength: 36,
        },
      ),
      withLabel(
        {
          label: "Starbuncle Color",
        },
        StringSelectMenu,
        {
          customId: "starbuncle_color",
          required: true,
          maxValues: 1,
          minValues: 1,
          options: STARBUNCLE_COLOR_OPTIONS,
        },
      ),
      withLabel(
        {
          label: "Starbuncle Name",
        },
        TextInput,
        {
          customId: "starbuncle_name",
          required: true,
        },
      ),
      withLabel(
        {
          label: "Adopter Name",
          description: "This name will be shown on the item",
        },
        TextInput,
        {
          customId: "adopter_name",
          required: true,
          value: settings.name,
        },
      ),
      withLabel(
        {
          label: "Starbuncle Bio",
          description: "A short description about your Starbuncle!",
        },
        TextInput,
        {
          customId: "starbuncle_bio",
          style: TextInputStyle.Paragraph,
          required: true,
          maxLength: 500,
        },
      ),
    ];
  }

  async run(interaction: ModalInteraction) {
    const responses = [
      interaction.fields.getText("starbuncle_uuid", true),
      interaction.fields.getStringSelect("starbuncle_color", true),
      interaction.fields.getText("starbuncle_name", true),
      interaction.fields.getText("adopter_name", true),
      interaction.fields.getText("starbuncle_bio", true),
    ]
    await interaction.reply({
      ephemeral: true,
      content:
        "Starbuncle adoption form received! This feature is still being implemented." + JSON.stringify(responses),
    });
  }
}
