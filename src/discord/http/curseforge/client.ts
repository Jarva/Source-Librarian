import ky from "npm:ky";

export const client = ky.extend({
  prefixUrl: "https://api.curseforge.com/v1/",
  headers: {
    "X-API-Key": Deno.env.get("CURSEFORGE_API_KEY"),
  },
});
