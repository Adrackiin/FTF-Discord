import {REST, Routes, SlashCommandBuilder} from 'discord.js';
import fs from 'node:fs';
import path from "path"

require('dotenv').config();

const commands = [];
// Grab all the command files from the commands directory you created earlier
let cmdPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    const command = require(path.join(cmdPath, `/${file}`));
    commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({version: '10'}).setToken(process.env.DISCORD_TOKEN);

const onlyGuild = ["send"];

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
                body: commands.filter(cmd => onlyGuild.includes(cmd.name))
            }
        )

        // The put method is used to fully refresh all commands in the guild with the current set
        const data: any = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            {body: commands.filter(cmd => !onlyGuild.includes(cmd.name))},
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();