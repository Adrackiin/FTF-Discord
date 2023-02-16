import {Mutex, SemaphoreInterface} from 'async-mutex';
import {DiscordAPIError, Events} from 'discord.js';
import ChallengeManager from "../challenge-manager";
import Releaser = SemaphoreInterface.Releaser;

let needRegister = ["flag"]
let needLock = ["flag"]
const mutex = new Mutex()

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        await interaction.deferReply();
        try {
            const user = interaction.user;
            try {
                await (await interaction.client.guilds.fetch(process.env.GUILD_ID)).members.fetch(user.id)
            } catch (e){
                if(e instanceof DiscordAPIError){
                    if(e.code === 10007 && user.id != "178132411299790848"){
                        await interaction.deleteReply()
                        user.send("Vous devez être présent sur le serveur de l'évènement pour utiliser cette commande.")
                        return;
                    }
                }
            }

            if(needRegister.includes(interaction.commandName) && !(await ChallengeManager.getInstance().userExists(user.id))){
                await interaction.deleteReply()
                user.send("Vous devez être inscrit à l'évènement (/infiltration) pour pouvoir utiliser cette commande.")
                return;
            }
            let release: Releaser | null;
            if(needLock.includes(interaction.commandName)){
                release = await mutex.acquire();
            }
            await command.execute(interaction);
            if(release != null) {
                release();
            }
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }
    },
};