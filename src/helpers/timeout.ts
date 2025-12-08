import { ListenerEventData, Message, User } from "@buape/carbon";

const ARS_ALERT_CHANNEL = "1285648414373056595";

export const forwardToDM = async (message: Message, author: User) => {
    const dm = await author.createDm(author.id);
    await message.forward(dm.id);
}

interface ReportAndTimeoutOptions {
    data: ListenerEventData["MESSAGE_CREATE"],
    timeout: string;
    channel?: string;
    content: string;
}

export const reportAndTimeout = async (options: ReportAndTimeoutOptions) => {
    const channel = options.channel ?? ARS_ALERT_CHANNEL;
    const promises = [
      options.data.message.forward(channel),
      forwardToDM(options.data.message, options.data.author),
      options.data.message.delete(),
      options.data.member?.timeoutMember(options.timeout, "Attempted to mention @everyone"),
      options.data.author.send({
        content: options.content
      }),
    ];
    await Promise.allSettled(promises);
}
