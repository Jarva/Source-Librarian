import "dotenv/config";
import { requireEnv } from "../src/helpers/env.ts";
import { discordPut } from "./helpers/discord.ts";
import { logger } from "../src/logger.ts";

const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = requireEnv([
  "DISCORD_TOKEN",
  "DISCORD_CLIENT_ID",
] as const);

// Provide guild IDs via CLI args, or fallback to the known list from the original commented code.
const guildIds = Deno.args.length > 0
  ? Deno.args
  : [
      "743298050222587978",
      "1173375132606140476",
      "1226186715111227534",
      "634618557464051772",
    ];

for (const guildId of guildIds) {
  try {
    await discordPut(
      `/applications/${DISCORD_CLIENT_ID}/guilds/${guildId}/commands`,
      DISCORD_TOKEN,
      [],
    );
    logger.info({ guildId }, "Successfully deleted all guild commands");
  } catch (err) {
    logger.error({ err, guildId }, "Error deleting guild commands");
  }
}
