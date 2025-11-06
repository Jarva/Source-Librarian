import ky from "ky";

export const client = ky.extend({
  prefixUrl: "https://cdn.jsdelivr.net/gh/",
});
