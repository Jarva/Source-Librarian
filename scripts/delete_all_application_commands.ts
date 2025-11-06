import "dotenv/config";
import { requireEnv } from "../src/helpers/env.ts";
import { discordPut } from "./helpers/discord.ts";
import { logger } from "../src/logger.ts";

const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = requireEnv([
  "DISCORD_TOKEN",
  "DISCORD_CLIENT_ID",
] as const);

const path = `/applications/${DISCORD_CLIENT_ID}/commands`;

try {
  await discordPut(path, DISCORD_TOKEN, []);
  logger.info("Successfully deleted all global application commands.");
} catch (err) {
  logger.error({ err }, "Error deleting application commands");
  Deno.exit(1);
}
