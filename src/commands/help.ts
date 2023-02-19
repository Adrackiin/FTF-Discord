import {SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const helpMessage = "Les commandes pour mener à bien votre mission sont les suivantes:\n" +
    "- **/flag**: Renseigner les flags que vous avez trouvé. Exemple: `/flag drapeau`.\n" +
    "- **/help**: Affiche ce texte.\n" +
    "- **/infiltration**: S'inscrire à l'évènement.\n" +
    "- **/stats**: Affiche les défis que vous avez complété."

const data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Affiche toutes les commandes");

async function execute(interaction) {
    await interaction.deleteReply();
    interaction.user.send(helpMessage);
}

module.exports = {
    helpMessage,
    data,
    execute
}

