import {Events} from 'discord.js';
import ChallengeManager from "../challenge-manager";

const database = ChallengeManager.getInstance();

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        if (reaction.message.id === "1075737220188753941") {
            if(!(await database.userExists(user.id))) {
                await user.send("Vous avez accepté la mission ! Pour commencer l'infiltration, veuillez entrer la commande `/infiltration`.");
            }
            reaction.users.remove(user);
        }
    },
};