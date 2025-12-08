import {
  Client,
  ListenerEventData,
  MessageCreateListener,
} from "@buape/carbon";
import { reportAndTimeout } from "../../helpers/timeout.ts";
import { LRUCache } from "lru-cache";

const extensions = [".png", ".jpg", ".jpeg", ".gif"]

const cache = new LRUCache<string, [string, string][]>({
  max: 500,
  ttl: 1000 * 20,
});

const increment = (id: string, channel: string, message: string) => {
  const messages = cache.get(id) ?? [];
  messages.push([channel, message]);
  console.log(`Incrementing ${id} to count ${messages.length}`)
  cache.set(
    id,
    messages
  );
  return messages;
}

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

    if (count >= 4 || data.message.attachments.length >= 4) {
      const messages = increment(data.author.id, data.channel_id, data.message.id);
      if (messages.length > 1) {
        reportAndTimeout({
          data,
          timeout: 15,
          reason: "Sent 4 or more images at once",
          client,
          content: "Your message was removed, and you've been given a 15-minute timeout for sending too many images at once. This is an anti-spam measure."
        });
        for (const [channel, message] of messages) {
          if (message === data.message.id) continue;
          const msg = await client.fetchMessage(channel, message);
          await msg.delete()
        }
      }
    }
  }
}
