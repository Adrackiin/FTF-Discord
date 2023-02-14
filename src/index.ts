import fs from 'node:fs';
import path from 'node:path';
// Require the necessary discord.js classes
import {Client, Collection, GatewayIntentBits} from 'discord.js';
import Database from "./database";

const dotEnv = require("dotenv");
dotEnv.config()

// Create a new client instance
const client = new Client({intents: [GatewayIntentBits.Guilds]});

// @ts-ignore
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        // @ts-ignore
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

const eventsPath = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

(async () => {
    console.log(await Database.getInstance().isFlagPresent("test"));
    console.log(await Database.getInstance().isFlagPresent("flat1"));
    console.log(await Database.getInstance().isFlagPresent("flag"));
})();