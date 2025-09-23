import { BaseEmbedCommand } from "@/discord/abstracts/embed-command.ts";

const lines = [
  "- Learn all the glyphs you can. By default each glyph gives you 15 mana and 0.33 mana regen.",
  "- Enchant everything with Mana Boost and Mana Regen. Each level of Mana Boost will give you 25 mana. Each level of Mana Regen will give you 2 mana per second.",
  "- Use an Amulet of Mana Boost or Amulet of Mana Regen. These provide 50 mana, and 3 mana regen respectively.",
  "- Craft two Rings of Greater Discount, each of these reduce your spell cost by 20 mana.",
  "- Upgrade your Spell Book to the highest tier you can. Each book tier grants you 50 mana and 1 mana regen.",
  "- Put a Magic Capacity thread in the highest level slot that you can. This increases your max mana by 10% per level.",
];

export class ManaCommand extends BaseEmbedCommand {
  name = "mana";
  description = "How do I get more mana?";
  lines = lines;
}
