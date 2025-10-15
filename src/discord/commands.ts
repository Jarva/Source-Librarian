import { IframesCommand } from "@/discord/commands/iframes.ts";
import { Command } from "npm:@buape/carbon";
import { ClaimsCommand } from "@/discord/commands/claims.ts";
import { ImbuementCommand } from "@/discord/commands/imbuement.ts";
import { ManaCommand } from "@/discord/commands/mana.ts";
import { LogsCommand } from "@/discord/commands/logs.ts";
import { EnchantingCommand } from "@/discord/commands/enchanting.ts";
import { AddonsCommand } from "@/discord/commands/addons/command.ts";
import { LagCommand } from "@/discord/commands/lag.ts";
import { InfiniteGlyphsCommand } from "@/discord/commands/infinite-glyphs.ts";
import { PinInThreadCommand } from "@/discord/commands/pin-in-thread.ts";

export default [
  new IframesCommand(),
  new ClaimsCommand(),
  new ImbuementCommand(),
  new EnchantingCommand(),
  new LogsCommand(),
  new ManaCommand(),
  new AddonsCommand(),
  new LagCommand(),
  new InfiniteGlyphsCommand(),
  new PinInThreadCommand(),
] as Command[];
