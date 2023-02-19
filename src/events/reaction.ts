import {Events} from 'discord.js';
import ChallengeManager from "../challenge-manager";

const database = ChallengeManager.getInstance();

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        if (reaction.message.id === "1076852175193526272" && user.id != "481783592976908289") {
            if(!(await database.userExists(user.id))) {
                await user.send("Vous avez accepté la mission ! Pour commencer l'infiltration, veuillez entrer la commande `/infiltration`.");
            }
            reaction.users.remove(user);
        }
    },
};