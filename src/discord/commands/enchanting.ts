import { BaseEmbedCommand } from "@/discord/abstracts/embed-command.ts";

export class EnchantingCommand extends BaseEmbedCommand {
  name = "enchanting";
  title = "Enchanting Apparatus";
  image = "https://i.imgur.com/88FE6iD.png";
  lines = [
    "Oops, it looks like you've used an Imbuement Chamber instead of an Enchanting Apparatus",
  ];
  description = `Instructions for when a user should be using an ${this.title}`;
}
