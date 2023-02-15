import {SlashCommandBuilder} from 'discord.js';
import ChallengeManager from "../challenge-manager";

const data = new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Afficher vos statistiques");

async function execute(interaction) {
    await interaction.deferReply();
    await interaction.deleteReply();
    const user = interaction.user;

    const database = ChallengeManager.getInstance();
    const achieved: string[] = await database.getAchievedChallenges(user.id);
    const challengesLeft = database.getChallengesLeft(achieved);
    const numberOfChallenges = database.getDifficulties();
    user.send("**Défis réalisés:**\n" + Object.entries(database.getDifficulties()).map(([key, value]) => {
        const difficultyId  = Number(key);
        const challengeLeft = challengesLeft[difficultyId].challenges;
        return `${value.difficulty.replace(/^\w/, c => c.toUpperCase())}\n` +
            `${":green_square:".repeat(numberOfChallenges[difficultyId].challenges - challengeLeft)}${":red_square:".repeat(challengeLeft)}\n`;
    }).join("\n"));
}

module.exports = {
    data,
    execute
}