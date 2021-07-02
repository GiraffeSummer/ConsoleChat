const fs = require('fs');
const baseCommands = require('./baseCommands');
const prefix = '/';
const CommandTemplate = require('./template/command');

const { db } = require("../index.js");

const Load = (server) => {
    const cmdPath = db.get('commandPath');

    for (let i = 0; i < baseCommands.length; i++) {
        const command = baseCommands[i];
        AddCommand(command, server);
    }

    if (!fs.existsSync(cmdPath)) {
        console.log(`'${cmdPath}' not found, it is now created, add custom server commands there.`);
        fs.mkdirSync(cmdPath);
    } else {
        try {
            const files = fs.readdirSync(cmdPath).filter(f => f.endsWith(".js"));

            console.log(`Loading (${files.length}) files from '${cmdPath}'`);

            files.forEach((file) => {
                const command = require(cmdPath + `/${file}`);
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