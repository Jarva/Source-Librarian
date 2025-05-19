import {
    channelMention,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder, time, TimestampStyles
} from "discord.js";
import { APIEmbedField  } from "discord-api-types/v10"
import {categories, addons as addonData, data} from "./data";
import {mention} from "../../../../util/options";

const addonChoices = Object.entries(addonData).map(([key, value]) => ({ value: `${value.id}`, name: `${key}` }));

export const addons = {
    command: new SlashCommandBuilder()
        .setName("addons")
        .setDescription("Information for Ars Nouveau Addons")
        .addSubcommand(
            command => command
                .setName("category")
                .setDescription("List all addons for a specific category")
                .addStringOption(
                    option => option
                        .setName("name")
                        .setDescription("The name of the category")
                        .setChoices(...categories)
                        .setRequired(true)
                )
                .addUserOption(mention),
        )
        .addSubcommand(
            command => command
                .setName("info")
                .setDescription("Information for a specific Ars addon")
                .addStringOption(
                    option => option
                        .setName("name")
                        .setDescription("The name of the Ars Addon")
                        .setChoices(addonChoices)
                        .setRequired(true)
                )
                .addUserOption(mention),
        )
        .addSubcommand(
            command => command
                .setName("discussion")
                .setDescription("A link to the discussion channel for a specified addon")
                .addStringOption(
                    option => option
                        .setName("name")
                        .setDescription("The name of the Ars addon")
                        .setChoices(addonChoices)
                        .setRequired(true)
                )
                .addUserOption(mention),
        )
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommand = interaction.options.getSubcommand();

        const user = interaction.options.getUser("user");

        try {
            await interaction.deferReply({
                ephemeral: !user,
            });
        } catch(error) {
            //
        }

        if (subcommand === "category") {
            const categoryValue = interaction.options.getString("name")
            const category = categories.find(category => category.value === categoryValue);

            if (category === undefined) {
                await interaction.editReply({
                    content: "No Category provided"
                });
                return;
            }

            const addons = Object.values(addonData).filter(value => value.categories.includes(category.value)).map(value => value.id);

            const fields: APIEmbedField[] = [];

            for (const id of addons) {
                const mod = await data.fetch(id, { signal: AbortSignal.timeout(5000) });
                if (mod === undefined) continue;

                const versions = mod.versions.map(version => `[${version.name}](${version.link})`).join(", ");

                fields.push({
                    name: `${mod.name} by ${mod.author}`,
                    value: `**Supported Versions:** ${versions}\n${mod.summary}\n`
                })
            }

            const embed = new EmbedBuilder()
                .setColor(0x231631)
                .setTitle(`Category ${category.name}`)
                .addFields(fields);

            await interaction.editReply({
                content: user != null ? `${user}` : undefined,
                embeds: [embed],
            });
            return;
        }

        if (subcommand === "info") {
            const id = interaction.options.getString("name");
            if (id === null) {
                await interaction.editReply({
                    content: "No Addon ID provided"
                });
                return;
            }
            const mod = await data.fetch(id, { signal: AbortSignal.timeout(5000) });
            if (mod === undefined) {
                await interaction.editReply({
                    content: "Unable to retrieve addon data"
                });
                return;
            }

            const versions = mod.versions.map(version => `[${version.name}](${version.link})`).join(", ");

            const fields: APIEmbedField[] = [
                { name: "Supported Versions", value: `${versions}` },
                { name: "Last Updated", value: `${time(mod.last_updated, TimestampStyles.RelativeTime)}`, inline: true },
                { name: "Downloads", value: `${mod.download_count.toLocaleString()}`, inline: true }
            ];

            const addon = Object.values(addonData).find(val => val.id === id);

            if (mod.issues != null) {
                fields.push( { name: "Issues", value: `${mod.issues}` })
            }

            if (mod.source != null) {
                fields.push( { name: "Source", value: `${mod.source}` })
            }

            if (addon && addon.channel) {
                fields.push({ name: "Discussion", value: `${channelMention(addon.channel)}` });
            }

            const embed = new EmbedBuilder()
                .setColor(0x231631)
                .setTitle(`${mod.name} by ${mod.author}`)
                .setURL(`${mod.link}`)
                .setDescription(`${mod.summary}`)
                .addFields(
                    fields
                )
                .setThumbnail(`${mod.logo}`)

            await interaction.editReply({
                content: user != null ? `${user}` : undefined,
                embeds: [embed],
            });
            return;
        }

        if (subcommand === "discussion") {
            const id = interaction.options.getString("name");
            if (id === null) {
                await interaction.editReply({
                    content: "No Addon ID provided"
                });
                return;
            }
            const mod = await data.fetch(id, { signal: AbortSignal.timeout(5000) });
            if (mod === undefined) {
                await interaction.editReply({
                    content: "Unable to retrieve addon data"
                });
                return;
            }

            const addon = Object.values(addonData).find(val => val.id === id);

            const userMention = user != null ? `${user}` : '';
            const channel = addon?.channel ? `${userMention}\nDiscussion: ${channelMention(addon.channel)}` : `No discussion channel found for ${mod.name}.`;

            await interaction.editReply({
                content: channel,
            });
            return;
        }

        await interaction.editReply({
            content: `Command not found: ${subcommand}`
        })
    }
}
