import {BaseEmbedCommand} from "@/discord/abstracts/embed-command.ts";

const lines = [
    "Back in 1.16.5, the NumericHUD is a feature bundled in the Ars Ender Storage addon (requires the Ender Storage mod too).",
    "From 1.18 up to 1.20.1, the Numeric HUD is provided by Ars Instrumentum wearing the Numeric Charm, a client config can be used to force the hud on even while not wearing it.",
    "In 1.20.1 there's also Ars Mana Meter addon which in addition to enabling the debug numbers also allows some adjustments for the bar position.",
    "In 1.21 there are multiple ways:",
    "- Use the `/ars debug on` command, requires admin perms, turns them on for the current session. Can also be used to turn the other methods off temporarily.",
    "- add Ars Numeric HUD, only thing it does is turning the switch on.",
    "- if Sauce 0.0.18+ is included, usually embedded in Ars Elemental, go in `sauce_startup.toml` and flip the value from false to true. From this version of Sauce forward, source machines will display technical info on their tooltip too.",
];

export class NumbersCommand extends BaseEmbedCommand {
    name = "numbers";
    description = "How can i enable the numeric hud?";
    title = "<:sense_magic:1099088954541752410>   Numeric values for source and mana";
    lines = lines;
}