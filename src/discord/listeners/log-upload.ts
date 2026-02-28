import {
  APIAttachment,
  Client,
  ListenerEvent,
  ListenerEventData,
  MessageCreateListener,
} from "@buape/carbon";

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10 MiB
const LOG_FILE_REGEX = /\.log(?:\.gz)?$/i;

interface LogsSuccess {
  success: true;
  id: string;
  url: string;
  raw: string;
}

interface LogsFailure {
  success: false;
  error: string;
}

type LogsResponse = LogsSuccess | LogsFailure;

const filterLogAttachments = (
  attachments: APIAttachment[],
): APIAttachment[] => {
  return attachments
    .filter((attachment) => LOG_FILE_REGEX.test(attachment.filename))
    .filter((attachment) => attachment.size <= MAX_ATTACHMENT_SIZE);
};

const isCompressedLog = (attachment: APIAttachment): boolean =>
  attachment.filename.toLowerCase().endsWith(".log.gz");

const unzipAttachment = async (
  attachment: APIAttachment,
  content: ArrayBuffer,
): Promise<string> => {
  try {
    const stream = new Blob([content]).stream().pipeThrough(
      new DecompressionStream("gzip"),
    );
    return await new Response(stream).text();
  } catch (cause) {
    throw new Error(
      `Failed to decompress attachment: ${attachment.filename}`,
      { cause },
    );
  }
};

const downloadAttachment = async (
  attachment: APIAttachment,
): Promise<string> => {
  const response = await fetch(attachment.url);

  if (!response.ok) {
    throw new Error(
      `Failed to download attachment: ${response.status} ${response.statusText}`,
      { cause: { url: attachment.url, status: response.status } },
    );
  }

  const content = await response.arrayBuffer();

  if (isCompressedLog(attachment)) {
    return await unzipAttachment(attachment, content);
  }

  return new TextDecoder().decode(content);
};

const uploadLog = async (content: string): Promise<string> => {
  const response = await fetch("https://api.mclo.gs/1/log", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ content }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to upload log to mclo.gs: ${response.status} ${response.statusText}`,
      { cause: { status: response.status } },
    );
  }

  const payload = await response.json() as LogsResponse;

  if (!payload.success) {
    throw new Error(
      `mclo.gs API returned unsuccessful response: ${payload.error}`,
      { cause: payload },
    );
  }

  return payload.url;
};

export class LogUpload extends MessageCreateListener {
  override async handle(
    data: ListenerEventData[this["type"]],
    _client: Client,
  ) {
    if (!data.guild_id) return;

    const uploads: string[] = [];
    for (const attachment of filterLogAttachments(data.message.attachments)) {
      console.log("Found attachment", attachment);
      const content = await downloadAttachment(attachment);
      const url = await uploadLog(content);

      uploads.push(url);
    }

    if (uploads.length === 0) return;

    await data.message.reply({
      content: uploads.join("\n"),
    });
  }
}
