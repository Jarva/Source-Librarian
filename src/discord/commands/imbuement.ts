import { BaseEmbedCommand } from "@/discord/abstracts/embed-command.ts";

export class ImbuementCommand extends BaseEmbedCommand {
  name = "imbuement";
  title = "Imbuement Chamber";
  image = "https://i.imgur.com/3YG8c6e.png";
  lines = [
    "Oops, it looks like you've used an Enchanting Apparatus instead of an Imbuement Chamber",
  ];
  description = `Instructions for when a user should be using an ${this.title}`;
}
