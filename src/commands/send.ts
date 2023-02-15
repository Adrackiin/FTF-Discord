import {SlashCommandBuilder} from 'discord.js';

const data = new SlashCommandBuilder()
    .setName("send")
    .setDescription("Envoyer un message en tant que bot")
    .addStringOption(option =>
        option.setName("message")
            .setDescription("Message à envoyer")
            .setRequired(true));

async function execute(interaction) {
    await interaction.deleteReply();
    if(interaction.user.id !== 178132411299790848){
        return;
    }
    interaction.channel.send(interaction.options.getString('message').replace(/\\n/g, '\n'))
}

module.exports = {
    data,
    execute
}