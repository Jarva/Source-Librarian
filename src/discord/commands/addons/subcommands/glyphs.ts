import {
  Command,
  CommandWithSubcommands,
  InteractionContextType,
} from "@buape/carbon";
import { AddonGlyphsSearchCommand } from "./glyphs/search.ts";

export class AddonsGlyphsCommand extends CommandWithSubcommands {
  name = "glyphs";
  description = "Information for Ars Nouveau Glyphs";

  contexts: InteractionContextType[] = [InteractionContextType.Guild];

  subcommands: Command[] = [new AddonGlyphsSearchCommand()];
}
