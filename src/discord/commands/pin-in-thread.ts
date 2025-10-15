import { ApplicationCommandType, Command, CommandInteraction, GuildThreadChannel } from "npm:@buape/carbon"
import stringify from "npm:safe-stable-stringify@2.5.0";

export class PinInThreadCommand extends Command {
    name = "Pin In Thread";
    description = "Pins a message inside a thread";
    ephemeral = true;
    type = ApplicationCommandType.Message;

    async run(interaction: CommandInteraction) {
        console.log(stringify(interaction.options, null, 2));
        if (interaction.message == null) {
            return await interaction.reply({ content: "Unable to find message" });
        }
        if (interaction.channel instanceof GuildThreadChannel) {
            if (interaction.channel.ownerId == interaction.user.id) {
                if (interaction.message.pinned) {
                    await interaction.message.unpin();
                    return await interaction.reply({ content: "Message Unpinned" });
                }
                await interaction.message.pin();
                return await interaction.reply({ content: "Message Pinned" });
            }
            return await interaction.reply({ content: "This command is only for thread-owners" });
        }
        return await interaction.reply({ content: "This command is only for use in threads" });
    }
}
