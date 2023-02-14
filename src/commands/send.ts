import {SlashCommandBuilder} from 'discord.js';

const data = new SlashCommandBuilder()
    .setName("send")
    .setDescription("Envoyer un message en tant que bot")
    .addStringOption(option =>
        option.setName("message")
            .setDescription("Message à envoyer")
            .setRequired(true));

async function execute(interaction) {
    await interaction.deferReply();
    await interaction.deleteReply();
    interaction.channel.send(interaction.options.getString('message').replace(/\\n/g, '\n'))
}

module.exports = {
    data,
    execute
}