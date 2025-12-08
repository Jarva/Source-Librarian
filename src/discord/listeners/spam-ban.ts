import {
  Client,
  ListenerEventData,
  MessageCreateListener,
} from "@buape/carbon";
import { reportAndTimeout } from "../../helpers/timeout.ts";

const extensions = [".png", ".jpg", ".jpeg", ".gif"]

export class SpamBan extends MessageCreateListener {
  override async handle(
    data: ListenerEventData[this["type"]],
    client: Client,
  ) {
    if (!data.guild_id || !data.member || data.author.bot) return;

    const words: string[] = data.message.content.split(/\s+/);

    const count = words.reduce((acc, curr) => {
      try {
        const url = new URL(curr);
        const isImage = extensions.some(extension => url.pathname.endsWith(extension));
        return acc += Number(isImage);
      } catch {}
      return acc;
    }, 0)

    if (data.author.id === "202407548916203520") {
      console.log(JSON.stringify({
        content: data.message.content,
        attachments: data.message.attachments.length,
        count
      }))
    }

    if (count >= 4) {
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
