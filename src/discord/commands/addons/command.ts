import {
  Command,
  CommandWithSubcommandGroups,
  CommandWithSubcommands,
  InteractionContextType,
} from "@buape/carbon";
import { AddonInfoCommand } from "./subcommands/info.ts";
import { AddonsGlyphsCommand } from "./subcommands/glyphs.ts";

export class AddonsCommand extends CommandWithSubcommandGroups {
  name = "addons";
  description = "Information for Ars Nouveau Addons";

  contexts: InteractionContextType[] = [InteractionContextType.Guild];

  subcommands: Command[] = [new AddonInfoCommand()];
  subcommandGroups: CommandWithSubcommands[] = [new AddonsGlyphsCommand()];
}
