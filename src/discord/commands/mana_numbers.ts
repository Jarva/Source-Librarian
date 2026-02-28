import { BaseEmbedCommand } from "@/discord/abstracts/embed-command.ts";

const lines = [
  "In 1.16.5, Numeric HUD is bundled with the Ars Ender Storage addon (which also requires the Ender Storage mod).",
  "From 1.18 through 1.20.1, Numeric HUD comes from Ars Instrumentum via the Numeric Charm. A client config can force the HUD on even when you are not wearing it.",
  "In 1.20.1, the Ars Mana Meter addon can also enable debug numbers and lets you adjust the mana bar position.",
  "In 1.21, there are multiple options:",
  "- Use `/ars debug on`. This requires admin permissions and enables numbers for the current session. It can also temporarily disable the other methods.",
  "- Install Ars Numeric HUD. It only toggles the numeric HUD on.",
  "- If Sauce 0.0.18+ is included (usually via Ars Elemental), open `sauce_startup.toml` and change the value from `false` to `true`. In Sauce 0.0.18+, source machines also show technical info in their tooltips.",
];

export class NumbersCommand extends BaseEmbedCommand {
  name = "numbers";
  description = "How can I enable the numeric HUD?";
  title = "<:sense_magic:1099088954541752410>   Numeric values for source and mana";
  lines = lines;
}
