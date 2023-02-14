import {SlashCommandBuilder} from 'discord.js';
import ChallengeManager from "../challenge-manager";

const data = new SlashCommandBuilder()
    .setName("flag")
    .setDescription("Renseigne tes flags ici !")
    .addStringOption(option => option
        .setName("flag")
        .setDescription("Le flag à renseigner")
        .setRequired(true))

async function execute(interaction) {
    const user = interaction.user;
    const database = ChallengeManager.getInstance();
    const flag = interaction.options.getString('flag');
    let reply;

    await interaction.deferReply();
    await interaction.deleteReply();

    const challenge = await database.getChallengeFromFlag(flag);
    if (challenge == null) {
        reply = ("Ce flag ne correspond à rien :pensive:");
    } else {
        const achieved = await database.getAchievedChallenges(user.id);
        if(achieved.includes(challenge)){
            reply = "Vous avez déjà résolu ce défi... Bien essayé :sunglasses:"
        } else {
            reply = `Vous avez réussi le défi ${database.getChallengeTitle(challenge)} :blush: !`;
        }
    }
    user.send("Flag \\*\\*\\*\\*\\* envoyé, vérification... :gear:")
    user.send(`${reply}\n​`);
    await database.addLog(interaction.user.id, challenge ?? "00", flag);
}

module.exports = {
    data,
    execute
}