import {SlashCommandBuilder} from 'discord.js';
import ChallengeManager from "../challenge-manager";

const data = new SlashCommandBuilder()
    .setName("infiltration")
    .setDescription("Accepter la mission")
    .addStringOption(option =>
        option.setName("promo")
            .setDescription("Indiquez votre promo (ZZ1, ZZ2, ZZ3...)")
            .setRequired(true))

async function execute(interaction) {
    await interaction.deleteReply();
    const user = interaction.user;

    const database = ChallengeManager.getInstance();
    if(await database.userExists(user.id)){
        user.send("Vous vous êtes déjà infiltré, il n'y a pas de point de retour !");
    } else {
        await database.addUser(user.id, interaction.options.getString("promo"));
        user.send("Vous venez de vous infiltrer dans les entreprises ! Déjouez les systèmes de sécurité et récoltez des preuves.\n\n" +
            "Les commandes pour mener à bien votre mission sont les suivantes:\n" +
            "- **/flag**: Renseigner les flags que vous avez trouvé. Exemple: `/flag drapeau`.\n" +
            "- **/stats**: Affiche les défis que vous avez complété.");
    }
}

module.exports = {
    data,
    execute
}