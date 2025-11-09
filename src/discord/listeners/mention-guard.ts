import {
  Client,
  GuildMember,
  ListenerEventData,
  Message,
  MessageCreateListener,
  User,
} from "@buape/carbon";
import { addMinutes } from "date-fns";

const ALERT_CHANNEL = "1285648414373056595";

export class MentionGuard extends MessageCreateListener {
  async forwardToDM(message: Message, author: User) {
    const dm = await author.createDm(author.id);
    await message.forward(dm.id);
  }

  override async handle(
    data: ListenerEventData[this["type"]],
    _client: Client,
  ) {
    if (!data.guild_id || !data.member || data.mention_everyone) return;
    if (!data.message.content.includes("@everyone")) return;

    const timeout = addMinutes(new Date(), 15).toISOString();

    const promises = [
      data.message.forward(ALERT_CHANNEL),
      this.forwardToDM(data.message, data.author),
      data.message.delete(),
      data.member.timeoutMember(timeout, "Attempted to mention @everyone"),
      data.author.send({
        content:
          "Your message was removed, and you've been given a 15-minute timeout for attempting to mention \@everyone. This is an anti-spam measure.",
      })
    ]
    await Promise.allSettled(promises);
  }
}
