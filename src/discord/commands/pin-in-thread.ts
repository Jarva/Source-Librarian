import { ApplicationCommandType, Command, CommandInteraction, GuildThreadChannel } from "npm:@buape/carbon"

export class PinInThreadCommand extends Command {
    name = "Pin In Thread";
    description = "Pins a message inside a thread";
    defer = true;
    ephemeral = true;
    type = ApplicationCommandType.Message;

    async run(interaction: CommandInteraction) {
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
