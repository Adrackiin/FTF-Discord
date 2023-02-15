import {DiscordAPIError, Events} from 'discord.js';
import ChallengeManager from "../challenge-manager";

let needRegister = ["flag"]

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            const user = interaction.user;
            try {
                await (await interaction.client.guilds.fetch(process.env.GUILD_ID)).members.fetch(user.id)
            } catch (e){
                if(e instanceof DiscordAPIError){
                    if(e.code === 10007){
                        await interaction.deferReply();
                        await interaction.deleteReply()
                        user.send("Vous devez être présent sur le serveur de l'évènement pour utiliser cette commande.")
                        return;
                    }
                }
            }

            if(needRegister.includes(interaction.commandName) && !(await ChallengeManager.getInstance().userExists(user.id))){
                await interaction.deferReply();
                await interaction.deleteReply()
                user.send("Vous devez être inscrit à l'évènement (/infiltration) pour pouvoir utiliser cette commande.")
                return;
            }
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }
    },
};