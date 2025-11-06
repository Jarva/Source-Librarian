import ky from "ky";
import { requireEnv } from "@/helpers/env.ts";

const { CURSEFORGE_API_KEY } = requireEnv(["CURSEFORGE_API_KEY"] as const);

export const client = ky.extend({
  prefixUrl: "https://api.curseforge.com/v1/",
  headers: {
    "X-API-Key": CURSEFORGE_API_KEY,
  },
});
