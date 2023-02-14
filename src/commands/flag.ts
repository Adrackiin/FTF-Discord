import {SlashCommandBuilder} from 'discord.js';

const data = new SlashCommandBuilder()
    .setName("flag")
    .setDescription("Renseigne tes flags ici !")
    .addStringOption(option => option
        .setName("flag")
        .setDescription("Le flag à renseigner")
        .setRequired(true))

async function execute(interaction) {
    if (interaction.inGuild()) {
        await interaction.deferReply();
        await interaction.deleteReply();
        await interaction.user.send("Les flags doivent être renseignés ici.")
        return;
    }
    await interaction.reply("test");
}

module.exports = {
    data,
    execute
}