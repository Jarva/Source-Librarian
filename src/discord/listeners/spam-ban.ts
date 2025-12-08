import {
  Client,
  ListenerEventData,
  MessageCreateListener,
} from "@buape/carbon";
import { reportAndTimeout } from "../../helpers/timeout.ts";

export class SpamBan extends MessageCreateListener {
  override async handle(
    data: ListenerEventData[this["type"]],
    client: Client,
  ) {
    if (!data.guild_id || !data.member) return;

    if (data.message.attachments.length >= 4) {
      reportAndTimeout({
        data,
        timeout: 15,
        reason: "Attempted to mention @everyone",
        client,
        content: "Your message was removed, and you've been given a 15-minute timeout for sending too many images at once. This is an anti-spam measure."
      });
    }
  }
}
