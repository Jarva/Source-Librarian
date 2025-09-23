import { BaseEmbedCommand } from "@/discord/abstracts/embed-command.ts";

export class InfiniteGlyphsCommand extends BaseEmbedCommand {
  name = "infinite-glyphs";
  title = "Infinite Glyphs";
  lines = [
    "It's possible to increase the glyph limit in spells in two different ways.",
    "",
    "The first and easiest way is using a Spell Book from All-The-Arcanist-Gear, these have additional glyph slots baked into them.",
    "",
    "The second method is to modify the `ars_nouveau-server.toml` config file.",
    "To do this, you need to first set `infiniteSpells` to `true`. Secondly you need to modify `infiniteSpellLimit` to be the number of additional glyph slots you wish to have available.",
    "A value of `10` will grant the player 10 additional glyph slots, for a maximum of 20 glyphs per spell.",
    "A value of `-9` will cause the player to have just 1 glyph slot, essentially making the Spell Books only used for setting Enchanter Tools.",
  ];
  description = `Instructions for increasing the glyph limit`;
}
