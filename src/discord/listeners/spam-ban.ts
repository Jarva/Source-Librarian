import {
  Client,
  ListenerEventData,
  MessageCreateListener,
} from "@buape/carbon";
import { reportAndTimeout } from "../../helpers/timeout.ts";

export class SpamBan extends MessageCreateListener {
  override async handle(
    data: ListenerEventData["MESSAGE_CREATE"],
    client: Client,
  ) {
    if (!data.guild_id || !data.member || data.author.bot) return;

    if (data.author.id === "202407548916203520") {
      JSON.stringify({
        content: data.message.content,
        attachments: data.message.attachments.length
      })
    }

    if (data.message.attachments.length >= 4) {
      reportAndTimeout({
        data,
        timeout: 15,
        reason: "Sent 4 or more images at once",
        client,
        content: "Your message was removed, and you've been given a 15-minute timeout for sending too many images at once. This is an anti-spam measure."
      });
    }
  }
}
