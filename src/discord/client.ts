import "npm:dotenv/config";
import { Client } from "npm:@buape/carbon";
import { createHandler } from "npm:@buape/carbon/adapters/fetch";
import { ShardingPlugin } from "npm:@buape/carbon/sharding";
import { Ready } from "@/discord/listeners/ready.ts";
import commands from "@/discord/commands.ts";
import { requireEnv } from "@/helpers/env.ts";

const env = requireEnv([
  "BASE_URL",
  "DISCORD_CLIENT_ID",
  "DISCORD_PUBLIC_KEY",
  "DISCORD_TOKEN",
] as const);

export const client = new Client({
  baseUrl: env.BASE_URL,
  disableDeployRoute: true,
  autoDeploy: true,
  clientId: env.DISCORD_CLIENT_ID,
  publicKey: env.DISCORD_PUBLIC_KEY,
  token: env.DISCORD_TOKEN,
}, {
  commands,
  listeners: [
    new Ready(),
  ],
}, [
  new ShardingPlugin({
    intents: 0,
  }),
]);

export const handler = createHandler(client);
