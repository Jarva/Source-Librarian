import {
  Client,
  ListenerEventData,
  MessageCreateListener,
} from "@buape/carbon";
import { reportAndTimeout } from "../../helpers/timeout.ts";



export class MentionGuard extends MessageCreateListener {
  override async handle(
    data: ListenerEventData[this["type"]],
    client: Client,
  ) {
    if (!data.guild_id || !data.member || data.mention_everyone) return;
    if (!data.message.content.includes("@everyone")) return;

    await reportAndTimeout({
      timeout: 15,
      reason: "Attempted to mention @everyone",
      client,
      content: "Your message was removed, and you've been given a 15-minute timeout for attempting to mention \@everyone. This is an anti-spam measure.",
      data
    });
  }
}
