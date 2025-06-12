import { IframesCommand } from "./commands/iframes.ts";
import { Command } from "npm:@buape/carbon";
import { ClaimsCommand } from "./commands/claims.ts";
import { ImbuementCommand } from "./commands/imbuement.ts";
import { ManaCommand } from "./commands/mana.ts";
import { LogsCommand } from "./commands/logs.ts";
import { EnchantingCommand } from "./commands/enchanting.ts";
import { AddonsCommand } from "./commands/addons/command.ts";

export default [
  new IframesCommand(),
  new ClaimsCommand(),
  new ImbuementCommand(),
  new EnchantingCommand(),
  new LogsCommand(),
  new ManaCommand(),
  new AddonsCommand(),
] as Command[];
