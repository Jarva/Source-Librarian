import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import {mention} from "../../../util/options";

export const iframes = {
    command: new SlashCommandBuilder()
        .setName("iframes")
        .setDescription("What are I-Frames?")
        .addUserOption(mention)
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {

        const lines = [
            "I-Frames or Immunity Frames, are durations where a player is invulnerable to damage. Ways to bypass these immunity frames are referred to as I-Frame Skips.",
            "",
            "In the base mod, there are no I-Frame skips available. In 1.21.1, Ars Elemental adds a glyph called Nullify Defense that will reset an entities I-Frames. In older versions there are other I-Frame skips available.",
            "",
            "Please check out [\"What is an I-Frame\" on Ars.Guide](https://ars.guide/docs/spell_theory/iframes/) for more information."
        ]

        const embed = new EmbedBuilder()
            .setColor(0x231631)
            .setTitle(`What are I-Frames?`)
            .setURL("https://ars.guide/docs/spell_theory/iframes/")
            .setDescription(lines.join("\n"))

        const user = interaction.options.getUser("user");

        await interaction.reply({
            content: user != null ? `${user}` : undefined,
            embeds: [embed],
            ephemeral: user == null,
        });
    }
}
