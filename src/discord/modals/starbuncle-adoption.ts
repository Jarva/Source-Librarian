import { BaseModalComponent, Modal, type ModalInteraction, Row, TextInput, TextInputStyle } from "@buape/carbon";
import { withLabel, WithLabel } from "../helpers/with-label.ts";

export const STARBUNCLE_COLORS = {
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

export type StarbuncleColor = keyof typeof STARBUNCLE_COLORS;

class StarbuncleUuidInput extends TextInput {
  customId = "starbuncle_uuid";
  label = "Starbuncle UUID";
  style = TextInputStyle.Short;
  required = true;
  minLength = 1;
  maxLength = 36;
  placeholder = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
}

class StarbuncleColorInput extends TextInput {
  customId = "starbuncle_color";
  label = "Color";
  style = TextInputStyle.Short;
  required = true;
  minLength = 1;
  maxLength = 20;
  placeholder = "e.g., white, orange, magenta, blue";
}

class StarbuncleNameInput extends TextInput {
  customId = "starbuncle_name";
  label = "Starbuncle Name";
  style = TextInputStyle.Short;
  required = true;
  minLength = 1;
  maxLength = 100;
  placeholder = "Enter the Starbuncle's name";
}

class AdopterNameInput extends TextInput {
  customId = "adopter_name";
  label = "Adopter Name";
  style = TextInputStyle.Short;
  required = true;
  minLength = 1;
  maxLength = 100;
  placeholder = "Enter the adopter's name";
}

class StarbuncleBioInput extends TextInput {
  customId = "starbuncle_bio";
  label = "Bio";
  style = TextInputStyle.Paragraph;
  required = true;
  minLength = 1;
  maxLength = 1000;
  placeholder = "Tell us about the Starbuncle";
}

export class StarbuncleAdoptionModal extends Modal {
  title = "Starbuncle Adoption";
  customId = "starbuncle_adoption";
  components = [
    withLabel({
      label: "UUID",
      description: "Minecraft UUID"
    }, TextInput, {
      customId: "starbuncle_uuid",
      style: TextInputStyle.Short,
      maxLength: 36,
      minLength: 36
    }),
    withLabel({
      label: "Color"
    }, TextInput, {
      customId: "starbuncle_color"
    })
    // new Row([new StarbuncleColorInput()]),
    // new Row([new StarbuncleNameInput()]),
    // new Row([new AdopterNameInput()]),
    // new Row([new StarbuncleBioInput()]),
  ];

  async run(interaction: ModalInteraction) {
    await interaction.reply({
      content: "Starbuncle adoption form received! This feature is still being implemented.",
    });
  }
}
