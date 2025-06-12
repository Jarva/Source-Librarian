import { cache } from "../cache.ts";
import { type MessagePayloadFile } from "@buape/carbon";

export const getMod = (namespace: string) => {
  switch (namespace) {
    case "toomanyglyphs":
    case "arsomega":
    case "ars_scalaes":
      return "not_enough_glyphs";
    default:
      return namespace;
  }
};

export const getTranslation = async (key: string) => {
  const lang = await cache.fetch("Jarva/ArsAddonBuilder/lang/en_us.json");

  if (lang === undefined || lang.type !== "LangCache") {
    return null;
  }

  return lang.entries[key] ?? key;
};

export const getImage = async (
  mod: string,
  texture: string,
  isAnimated: boolean = false,
) => {
  const [textureNS, texturePath] = texture.split(":");

  const parts = [
    "Jarva/ArsAddonBuilder/resources/",
    mod,
    "/assets/",
    textureNS,
    "/textures/",
    texturePath,
    `${isAnimated ? ".gif" : ".png"}`,
    "?raw=true",
  ];

  const url = parts.join("");

  const data = await cache.fetch(url);

  if (data === undefined || data.type !== "TextureCache") {
    return null;
  }

  return data.entries;
};

export const getAttachment = (
  image: Blob | null,
): MessagePayloadFile | undefined => {
  if (image !== null) {
    const [_, ext] = image.type.split("/");
    return {
      name: `attachment.${ext}`,
      data: image,
    };
  }
};
