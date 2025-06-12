import { Client } from "@buape/carbon";
import { createHandler } from "@buape/carbon/adapters/fetch";
import { ShardingPlugin } from "@buape/carbon/sharding";
import { Ready } from "./listeners/ready.ts";
import commands from "./commands.ts";

const env = Deno.env.toObject();

export const client = new Client({
  baseUrl: env.BASE_URL,
  disableDeployRoute: true,
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
