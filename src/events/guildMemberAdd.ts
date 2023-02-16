import {Events} from "discord.js";
import ChallengeManager from "../challenge-manager";

const database = ChallengeManager.getInstance();

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            const role = await member.guild.roles.cache.get(1075720486065016844);
            if (role && await database.userExists(member.id)) {
                member.roles.add(role);
            }
        } catch (err) {
            console.error(err);
        }
    },
};