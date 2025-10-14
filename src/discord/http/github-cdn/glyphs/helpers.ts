import { cache } from "@/discord/http/github-cdn/cache.ts";
import { type MessagePayloadFile } from "npm:@buape/carbon";
import { PATHS } from "@/discord/http/github-cdn/paths.ts";
import {logger} from "../../../../logger.ts";

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
  const lang = await cache.fetch(PATHS.langEnUS);

  if (lang === undefined || lang.type !== "LangCache") {
    return null;
  }

  return lang.data[key] ?? key;
};

export const getImage = async (
  mod: string,
  texture: string,
  isAnimated: boolean = false,
) => {
  const [textureNS, texturePath] = texture.split(":");
  const [folder, resource] = texturePath.split("/");

  const animatedParts = [
    `${PATHS.animatedResourcesPrefix}/`,
      mod,
      resource,
      ".gif",
      "?raw=true",
  ]

  const parts = [
    `${PATHS.resourcesPrefix}/`,
    mod,
    "/assets/",
    textureNS,
    "/textures/",
    texturePath,
    ".png",
    "?raw=true",
  ];

  const url = (isAnimated ? animatedParts : parts).join("");

  const data = await cache.fetch(url);

  if (data === undefined || data.type !== "TextureCache") {
    logger.warn(`Could not find ${url} or data type is incorrect: ${data?.type}`);
    return null;
  }

  return data.data;
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
