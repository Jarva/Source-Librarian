import {
  Command,
  CommandWithSubcommands,
  InteractionContextType,
} from "npm:@buape/carbon";
import { AddonGlyphsSearchCommand } from "@/discord/commands/addons/subcommands/glyphs/search.ts";
import {AddonGlyphsListCommand} from "@/discord/commands/addons/subcommands/glyphs/list.ts";

export class AddonsGlyphsCommand extends CommandWithSubcommands {
  name = "glyphs";
  description = "Information for Ars Nouveau Glyphs";

  contexts: InteractionContextType[] = [InteractionContextType.Guild];

  subcommands: Command[] = [new AddonGlyphsSearchCommand(), new AddonGlyphsListCommand()];
}
