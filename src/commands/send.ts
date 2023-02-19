import {SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

const data = new SlashCommandBuilder()
    .setName("send")
    .setDescription("Envoyer un message en tant que bot")
    .addStringOption(option =>
        option.setName("message")
            .setDescription("Message à envoyer")
            .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

async function execute(interaction) {
    await interaction.deleteReply();
    await interaction.channel.send(interaction.options.getString('message').replace(/\\n/g, '\n'))
}

module.exports = {
    data,
    execute
}