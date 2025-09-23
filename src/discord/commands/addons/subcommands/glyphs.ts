import {
  Command,
  CommandWithSubcommands,
  InteractionContextType,
} from "npm:@buape/carbon";
import { AddonGlyphsSearchCommand } from "./glyphs/search.ts";
import {AddonGlyphsListCommand} from "./glyphs/list.ts";

export class AddonsGlyphsCommand extends CommandWithSubcommands {
  name = "glyphs";
  description = "Information for Ars Nouveau Glyphs";

  contexts: InteractionContextType[] = [InteractionContextType.Guild];

  subcommands: Command[] = [new AddonGlyphsSearchCommand(), new AddonGlyphsListCommand()];
}
