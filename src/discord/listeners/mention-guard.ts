import {
  Client,
  ListenerEvent,
  ListenerEventData,
  MessageCreateListener,
  PermissionFlagsBits
} from "@buape/carbon";
import { addMinutes } from "date-fns";

const ALERT_CHANNEL = "1285648414373056595"

const hasPermission = (source: bigint, target: bigint) =>
(source & target) === target;

export class MentionGuard extends MessageCreateListener {
  override async handle(
    data: ListenerEventData[typeof ListenerEvent.MessageCreate],
    _client: Client,
  ) {
    if (!data.guild_id || !data.mention_everyone || !data.member) return;

    const permissions = await data.member.getPermissions()
    const allowed = permissions.some(permission => hasPermission(permission, PermissionFlagsBits.MentionEveryone));

    if (allowed) return;
    
    await data.message.forward(ALERT_CHANNEL);
    await data.message.forward(data.author.id);
    await data.message.delete();
    const timeout = addMinutes(new Date(), 15).toISOString();
    await data.member.timeoutMember(timeout, "Attempted to mention @everyone");
    await data.author.send({
      content: "Your message was removed, and you've been given a 15-minute timeout for attempting to mention \@everyone. This is an anti-spam measure."
    })
  }
}
