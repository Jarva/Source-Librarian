import { ListenerEventData, Message, Routes, serializePayload, User } from "@buape/carbon";
import { Result } from "typescript-result"

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

    const dm = await options.data.author.createDm(options.data.author.id).catch(_ => null);

    const steps = [
      () => options.data.message.forward(channel),
      () => dm && options.data.message.forward(dm.id),
      () => options.data.message.delete(),
      () => options.data.member?.timeoutMember(options.timeout, "Attempted to mention @everyone"),
      () => dm && options.data.author.client.rest.post(
        Routes.channelMessages(dm.id),
        {
          body: serializePayload({
            content: options.content
          })
        }
      ),
    ];

    const results = [];
    for (const step of steps) {
      results.push(
        await step()?.catch(err => err)
      );
    }

    console.log(JSON.stringify(results));
}
