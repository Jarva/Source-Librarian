import { APIEmbedField } from "npm:@buape/carbon";
import { BaseEmbedCommand } from "../abstracts/embed-command.ts";

const lines = [
    "Spark is the best available tool for debugging lag. It provides more accurate reports as to what is causing the lag, but it doesn't show where in the world the lag is occuring. This is the one use-case that I'd recommend using Observable for.",
];

export class LagCommand extends BaseEmbedCommand {
    name = "lag";
    description = "How can I debug lag?";
    lines = lines;
    url = "https://spark.lucko.me/";
    extraFields: APIEmbedField[] = [
        {
            name: "Constant Lag",
            value:
                "`/spark profiler --timeout 300`",
        },
        {
            name: "Lag Spikes",
            value:
                "`/spark profiler --only-ticks-over 100 --timeout 300`",
        },
        {
            name: "FPS Issues",
            value: "`/sparkc profiler --timeout 300`"
        }
    ];
}
