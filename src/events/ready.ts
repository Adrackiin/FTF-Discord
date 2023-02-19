import { Events } from 'discord.js';

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        try {
            const channel = await client.channels.fetch("1066657027042054226");
            const msg = await channel.messages.fetch("1076852175193526272");
        } catch(e){
            console.error(e);
        }
    },
};