import {
  Client,
  ListenerEventData,
  MessageCreateListener,
} from "@buape/carbon";
import { addMinutes } from "date-fns";
import { reportAndTimeout } from "../../helpers/timeout.ts";



export class MentionGuard extends MessageCreateListener {
  override async handle(
    data: ListenerEventData[this["type"]],
    _client: Client,
  ) {
    if (!data.guild_id || !data.member || data.mention_everyone) return;
    if (!data.message.content.includes("@everyone")) return;

    const timeout = addMinutes(new Date(), 15).toISOString();

    await reportAndTimeout({
      timeout,
      content: "Your message was removed, and you've been given a 15-minute timeout for attempting to mention \@everyone. This is an anti-spam measure.",
      data
    });
  }
}
