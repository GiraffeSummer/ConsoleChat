const fs = require('fs');
const baseCommands = require('./baseCommands');
const prefix = '/';
const CommandTemplate = require('./template/command');

const Load = (server) => {
    for (let i = 0; i < baseCommands.length; i++) {
        const command = baseCommands[i];

        AddCommand(command, server);
    }
    if (!fs.existsSync('./commands')) {
        console.log("'./commands' not found you can make one and add custom server commands.")
    } else {
        try {
            fs.readdirSync("./commands/").forEach((file) => {
                //Only js code may be loaded
                if (!file.endsWith(".js")) return;

                const command = require(`../commands/${file}`);
                AddCommand(command, server, file);
            });
        } catch (err) {
            console.log(`Error while loading commands. ${err}`);
        }
    }
}

function AddCommand(command, server, file = undefined) {
    command.config = MakeValid(command.config, CommandTemplate.config);
    const commandName = command.config.name;

    if (command.config.enabled) {
        command.config.usage = prefix + command.config.usage;
        server.commands[commandName] = command;
        console.log(`Loaded command ${commandName} ${(file !== undefined) ? "(" + file + ")" : ''}`);
    }
}

function MakeValid(ob, compare) {
    let newob = {};
    for (let prop in compare) newob[prop] = (!(ob[prop] == undefined || ob[prop] == null)) ? ob[prop] : compare[prop];
    return newob;
}


module.exports = { prefix, Load, MakeValid }