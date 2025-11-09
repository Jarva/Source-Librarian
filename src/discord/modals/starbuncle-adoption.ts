import {
  Modal,
  type ModalInteraction,
  StringSelectMenu,
  TextInput,
  TextInputStyle,
} from "@buape/carbon";
import { withLabel } from "../helpers/with-label.ts";
import { Octokit } from "@octokit/rest";
import {
  createOrUpdateTextFile,
} from "@octokit/plugin-create-or-update-text-file";
import { getEnv } from "../../helpers/env.ts";
import { validate } from "@std/uuid";

const API = Octokit.plugin(createOrUpdateTextFile);
const octokit = new API({ auth: getEnv("GITHUB_TOKEN") });

export interface Supporters {
  uuids: string[];
  starbuncleAdoptions: StarbuncleAdoption[];
}

export interface StarbuncleAdoption {
  name: string;
  adopter: string;
  color: string;
  bio: string;
}

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

const getStarbuncleOptions = () => {
  const entries = Object.entries(STARBUNCLE_COLOR);
  const idx = Math.floor(Math.random() * entries.length);

  return entries.map(([value, label], index) => ({
    value,
    label,
    default: index === idx,
  }));
};

// Allows Unicode letters, numbers, spaces, hyphens, and underscores
// \p{L} matches any letter from any language
// \p{N} matches any numeric character from any language
const NAME_PATTERN = /^[\p{L}\p{N}\s\-_\.]+$/u;
const validateTextPattern = (text: string): boolean => {
  return NAME_PATTERN.test(text);
};

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
          options: getStarbuncleOptions(),
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
    const uuid = interaction.fields.getText("starbuncle_uuid", true);
    const [color] = interaction.fields.getStringSelect(
      "starbuncle_color",
      true,
    );
    const name = interaction.fields.getText("starbuncle_name", true);
    const adopter_name = interaction.fields.getText("adopter_name", true);
    const bio = interaction.fields.getText("starbuncle_bio", true);

    if (!validate(uuid)) {
      return await interaction.reply({
        ephemeral: true,
        content: "Invalid Minecraft UUID format. Please provide a valid UUID.",
      });
    }

    const textPatternError = "can only contain letters, numbers, spaces, hyphens, periods, and underscores. (If you believe your name should be allowed, please ping <@202407548916203520>)";

    if (!validateTextPattern(name)) {
      return await interaction.reply({
        ephemeral: true,
        content: `Starbuncle Name ${textPatternError}`,
      });
    }

    if (!validateTextPattern(adopter_name)) {
      return await interaction.reply({
        ephemeral: true,
        content: `Adopter Name ${textPatternError}`,
      });
    }

    const baseRef = await octokit.git.getRef({
      owner: "baileyholl",
      repo: "Ars-Nouveau",
      ref: "heads/main",
    });
    const baseSha = baseRef.data.object.sha;

    const safeName = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const branchName = `adoption/${safeName || "starbuncle"}/${Date.now()}`;

    await octokit.git.createRef({
      owner: "Jarva",
      repo: "Ars-Nouveau",
      ref: `refs/heads/${branchName}`,
      sha: baseSha,
    });

    await octokit.createOrUpdateTextFile({
      owner: "Jarva",
      repo: "Ars-Nouveau",
      path: "supporters.json",
      message: `chore: add starbuncle adoption for ${name}`,
      branch: branchName,
      committer: {
        name: "Source Librarian",
        email: "source-librarian@jarva.dev",
      },
      author: {
        name: "Source Librarian",
        email: "source-librarian@jarva.dev",
      },
      content({ exists, content }) {
        if (!exists) return null;

        const json = JSON.parse(content) as Supporters;
        json.uuids.push(uuid);
        json.uuids = [...new Set(json.uuids)]

        json.starbuncleAdoptions.push({
          name,
          adopter: adopter_name,
          color,
          bio,
        });

        return JSON.stringify(json, null, 2);
      },
    });

    const pr = await octokit.pulls.create({
      owner: "baileyholl",
      repo: "Ars-Nouveau",
      base: "main",
      head: `Jarva:${branchName}`,
      title: `(Starbuncle Adoption) ${adopter_name} wants to adopt ${name}`,
    });

    await interaction.reply({
      ephemeral: true,
      content: [
        "<a:starbuncle_speed:860323942005997588> **Starbuncle adoption form received!**",
        `A [pull request](<${pr.data.html_url}>) has been created. Once it's merged, your Starbuncle will become available in-game, either randomly or with the following command:`,
        "```",
        `/ars-adopted by-adopter ${adopter_name}`,
        "or",
        `/ars-adopted by-name ${name}`,
        "```",
      ].join("\n"),
      sticker_ids: ["1245741044704739410"]
    // deno-lint-ignore no-explicit-any
    } as any);
  }
}
