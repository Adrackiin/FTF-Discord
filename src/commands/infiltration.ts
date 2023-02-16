import {SlashCommandBuilder} from 'discord.js';
import ChallengeManager from "../challenge-manager";
import {helpMessage} from "./help"

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
    if (await database.userExists(user.id)) {
        user.send("Vous vous êtes déjà infiltré, il n'y a pas de point de retour !");
    } else {
        await database.addUser(user.id, interaction.options.getString("promo"));
        user.send("Vous venez de vous infiltrer dans les entreprises ! Déjouez les systèmes de sécurité et récoltez des preuves.\n\n" +
        helpMessage);
        const guild = await interaction.client.guilds.fetch(process.env.GUILD_ID);
        const role = await guild.roles.cache.get("1075720486065016844");
        const member = await guild.members.fetch(user.id);
        if (role) {
            await member.roles.add(role);
        }
    }
}

module.exports = {
    data,
    execute
}