import { APIEmbedField } from "@buape/carbon";
import { BaseEmbedCommand } from "../abstracts/embed-command.ts";

const lines = [
  "Upload your log file to [mclo.gs](https://mclo.gs/) so that people can help easier, not everyone is on their PC all the time and having a easily formatted searchable link is much easier for debugging.",
];

export class LogsCommand extends BaseEmbedCommand {
  name = "logs";
  description = "How to share logs";
  title = ":notepad_spiral: Log Sharing";
  lines = lines;
  extraFields: APIEmbedField[] = [
    {
      name: "Where can I find my logs?",
      value:
        "Go to your instance or .minecraft folder and upload the logs/latest.log file",
    },
    {
      name: "How about crash reports?",
      value:
        "Crash reports can be found in your instance or .minecraft folder under the crash-reports sub-folder. This is only made when a crash is registered, so if it doesn't exist that's fine.",
    },
  ];
}
