import { APIMessage, Client, ListenerEventData, Message, MessagePayload, Routes, serializePayload, User } from "@buape/carbon";
import { addMinutes } from "date-fns/addMinutes";

const ARS_ALERT_CHANNEL = "1285648414373056595";

export const forwardToDM = async (message: Message, author: User) => {
    const dm = await author.createDm(author.id);
    await message.forward(dm.id);
}

interface ReportAndTimeoutOptions {
  client: Client,
  data: ListenerEventData["MESSAGE_CREATE"],
  timeout: number;
  channel?: string;
  content: string;
  reason: string;
}

export const sendMessage = async (client: Client, channelId: string, message: MessagePayload) => {
  const response = await client.rest.post(
    Routes.channelMessages(channelId),
    {
      body: serializePayload(message)
    }
  ) as APIMessage;
  return new Message(client, response);
}

export const reportAndTimeout = async (options: ReportAndTimeoutOptions) => {
  const channel = options.channel ?? ARS_ALERT_CHANNEL;

  const dm = await options.data.author.createDm(options.data.author.id).catch(_ => null);

  const timeout = addMinutes(new Date(), options.timeout).toISOString();

  const steps = [
    async () => await options.data.message.forward(channel),
    async () => await sendMessage(options.client, channel, {
      content: `Message from <@${options.data.author.id}> removed for \`${options.reason}\`. User timed out for ${options.timeout} minutes.`
    }),
    async () => dm && await options.data.message.forward(dm.id),
    async () => await options.data.message.delete(),
    async () => await options.data.member?.timeoutMember(timeout, options.reason),
    async () => dm && await sendMessage(options.client, dm.id, {
      content: options.content
    }),
  ];

  const results = [];
  for (const step of steps) {
    results.push(
      await step()?.catch(err => err)
    );
  }

  console.log(JSON.stringify(results));
}
