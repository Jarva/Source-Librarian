import "dotenv/config";
import { Client, GatewayIntentBits } from "@buape/carbon";
import { createHandler } from "@buape/carbon/adapters/fetch";
import { ShardingPlugin } from "@buape/carbon/sharding";
import { Ready } from "@/discord/listeners/ready.ts";
import { LogUpload } from "@/discord/listeners/log-upload.ts";
import commands from "@/discord/commands.ts";
import { requireEnv } from "@/helpers/env.ts";
import { MentionGuard } from "./listeners/mention-guard.ts";

const env = requireEnv(
  [
    "BASE_URL",
    "DISCORD_CLIENT_ID",
    "DISCORD_PUBLIC_KEY",
    "DISCORD_TOKEN",
  ] as const,
);

export const client = new Client({
  baseUrl: env.BASE_URL,
  disableDeployRoute: true,
  autoDeploy: false,
  clientId: env.DISCORD_CLIENT_ID,
  publicKey: env.DISCORD_PUBLIC_KEY,
  token: env.DISCORD_TOKEN,
}, {
  commands,
  listeners: [
    new Ready(),
    new LogUpload(),
    new MentionGuard(),
  ],
}, [
  new ShardingPlugin({
    intents: GatewayIntentBits.Guilds |
      GatewayIntentBits.GuildMessages |
      GatewayIntentBits.MessageContent,
  }),
]);

export const handler = createHandler(client);
