import { SlashCommandUserOption } from "discord.js";

export const mention =
    (option: SlashCommandUserOption) => option
        .setName("user")
        .setDescription("The command's target")
        .setRequired(false);
