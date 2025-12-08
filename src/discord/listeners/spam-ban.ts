import {
  Client,
  ListenerEvent,
  ListenerEventData,
  MessageCreateListener,
} from "@buape/carbon";
import { addMinutes } from "date-fns";
import { reportAndTimeout } from "../../helpers/timeout.ts";

export class SpamBan extends MessageCreateListener {
  override async handle(
    data: ListenerEventData[this["type"]],
    _client: Client,
  ) {
    if (!data.guild_id || !data.member) return;

    const timeout = addMinutes(new Date(), 15).toISOString();

    if (data.message.attachments.length >= 4) {
      reportAndTimeout({
        data,
        timeout,
        content: "Your message was removed, and you've been given a 15-minute timeout for sending too many images at once. This is an anti-spam measure."
      });
    }
  }
}
