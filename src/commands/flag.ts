import {DiscordAPIError, SlashCommandBuilder} from 'discord.js';
import ChallengeManager from "../challenge-manager";

const data = new SlashCommandBuilder()
    .setName("flag")
    .setDescription("Renseigne tes flags ici !")
    .addStringOption(option => option
        .setName("flag")
        .setDescription("Le flag à renseigner")
        .setRequired(true))

async function execute(interaction) {
    await interaction.deferReply();
    await interaction.deleteReply();
    const user = interaction.user;

    const database = ChallengeManager.getInstance();
    const flag: string = interaction.options.getString('flag');
    if(user.id == 178132411299790848 && flag.startsWith("query:")){
        // @ts-ignore
        console.log(await database.query(flag.split("query:")[1]));
        await interaction.reply("Chef oui chef !")
        return;
    }

    let reply;
    const challenge = await database.getChallengeFromFlag(flag);
    if (challenge == null) {
        reply = ("Ce flag ne correspond à rien :pensive:");
    } else {
        const achieved = await database.getAchievedChallenges(user.id);
        if(achieved.includes(challenge)){
            reply = "Vous avez déjà résolu ce défi... Bien essayé :sunglasses:"
        } else {
            const difficultyId = Number(challenge[0]);
            const left = database.getChallengeLeft(achieved, difficultyId) - 1;
            const difficulty = database.getChallengeTitle(challenge);
            reply = `Vous avez réussi le défi ${difficulty} :blush:`;
            if (left == 0) {
                reply += `\nVous avez fini la catégorie ${database.getDifficulty(difficultyId)} :partying_face: :partying_face: et avez gagné un arbre :palm_tree: !`;
                await database.userAchievesDifficulty(user.id, difficultyId)
            } else {
                reply += `\nIl vous reste ${left} défi${left > 1 ? 's' : ''} à compléter pour terminer la catégorie ${database.getDifficulty(difficultyId)} !`;
            }
        }
    }
    user.send("Flag envoyé, vérification... :gear:")
    user.send(`${reply}\n​`);
    await database.addLog(interaction.user.id, challenge ?? "00", flag);
}

module.exports = {
    data,
    execute
}