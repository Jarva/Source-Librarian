import { Client, ListenerEvent, ListenerEventData, ReadyListener } from "@buape/carbon";
import { logger } from "@/logger.ts";

export class Ready extends ReadyListener {
  async handle(
    data: ListenerEventData[this["type"]],
    _client: Client,
  ) {
    logger.info(
      { user: data.user.username, guilds: data.guilds.length },
      "Ready!",
    );
  }
}
