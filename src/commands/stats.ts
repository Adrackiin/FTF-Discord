import {SlashCommandBuilder} from 'discord.js';
import ChallengeManager from "../challenge-manager";

const data = new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Afficher vos statistiques");

async function execute(interaction) {
    await interaction.deleteReply();
    const user = interaction.user;
    const database = ChallengeManager.getInstance();
    const achieved: string[] = await database.getAchievedChallenges(user.id);
    const numberOfChallenges = database.getDifficulties();
    user.send("**Défis réalisés:**\n" + Object.entries(database.getDifficulties()).map(([key, value]) => {
        const difficultyId = Number(key);
        return `${value.difficulty.replace(/^\w/, c => c.toUpperCase())}\n${
            Array.from({length: numberOfChallenges[difficultyId].challenges}, (_, i) => i + 1)
            .map(id => achieved.includes(`${difficultyId}${id}`) ? ":green_square:" : ":red_square:").join("")}\n`
    }).join("\n"));
}

module.exports = {
    data,
    execute
}