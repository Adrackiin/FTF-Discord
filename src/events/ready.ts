import { Events } from 'discord.js';

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        const channel = await client.channels.fetch("1066657027042054226");
        const msg = await channel.messages.fetch("1075737220188753941");
    },
};