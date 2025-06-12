import { APIEmbedField } from "npm:@buape/carbon";
import { BaseEmbedCommand } from "../abstracts/embed-command.ts";

const lines = [
  "Lots of spells in Ars Nouveau use fake players under the hood to achieve their effects, so you will need to trust the player Ars_Nouveau (or its UUID) inside your chunks.",
  "",
  "For MineColonies, it may be easier to view your Permission Events in your Town Hall, and trust the Ars_Nouveau player after attempting to fire a turret.",
];

export class ClaimsCommand extends BaseEmbedCommand {
  name = "claims";
  description = "How to solve common claims issues";
  title = "<:break:1262385404745748632>   Spells inside Claimed Chunks";
  lines = lines;
  extraFields: APIEmbedField[] = [
    { name: "UUID", value: "`7400926d-1007-4e53-880f-b43e67f2bf29`" },
  ];
}
