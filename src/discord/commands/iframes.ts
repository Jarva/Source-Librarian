import { BaseEmbedCommand } from "@/discord/abstracts/embed-command.ts";

const lines = [
  "I-Frames or Immunity Frames, are durations where a player is invulnerable to damage. Ways to bypass these immunity frames are referred to as I-Frame Skips.",
  "",
  "In the base mod, there are no I-Frame skips available. In 1.21.1, Ars Elemental adds a glyph called Nullify Defense that will reset an entities I-Frames. In older versions there are other I-Frame skips available.",
  "",
  'Please check out ["What is an I-Frame" on Ars.Guide](https://ars.guide/docs/spell_theory/iframes/) for more information.',
];

export class IframesCommand extends BaseEmbedCommand {
  name = "iframes";
  description = "What are I-Frames?";
  lines = lines;
  url = "https://ars.guide/docs/spell_theory/iframes/";
}
