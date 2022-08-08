const fs = require('fs');
const { REST } = require('discord.js');
const { Routes } = require('discord-api-types/v10');
const AsciiTable = require('ascii-table');
const table = new AsciiTable();
table.setHeading('Commands', 'Description', 'Stats').setBorder('|', '=', "0", "0");

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {

        client.commandArray = [];
        for (folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter((file) => file.endsWith('.js'));

            for (const file of commandFiles) {
                const command = require(`../Commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());

                if (command.data.name) {
                    table.addRow(file.split('.js')[0], '✅')
                } else {
                    table.addRow(file.split('.js')[0], '⛔')
                };
            };
        };
        console.log(table.toString());

        const rest = new REST({ version: '9' }).setToken(process.env.token);

        rest.put(Routes.applicationCommands(process.env.clientID),
            { body: client.commandArray })
            .then(() => console.log('Successfully registered global application commands!'))
            .catch(console.error);
    };
};