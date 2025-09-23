import {
  Client,
  ListenerEvent,
  ListenerEventData,
  ReadyListener,
} from "npm:@buape/carbon";
import { logger } from "@/logger.ts";

export class Ready extends ReadyListener {
  async handle(
    data: ListenerEventData[typeof ListenerEvent.Ready],
    client: Client,
  ) {
    logger.info({ user: data.user.username, guilds: data.guilds.length }, "Ready!");
  }
}
