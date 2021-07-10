const fs = require('fs');
const Templates = require('./template/event');

const Types = Object.freeze({ ready: "ready", join: "join", leave: "leave", message: "message" });

const { db } = require("../index.js");

const Load = (server) => {
    const eventPath = db.get('dataPath') + '/events';

    /*
    for (let i = 0; i < baseCommands.length; i++) {
        const command = baseCommands[i];
        AddCommand(command, server);
    }*/

    if (!fs.existsSync(eventPath)) {
        console.log(`'${eventPath}' not found, it is now created, add custom server events there.`);
        fs.mkdirSync(eventPath);
    } else {
        try {
            console.log(`Loading events from folder: '${eventPath}'`)
            //go through all event folders
            Object.values(Types).forEach(evtType => {
                server.events[evtType] = [];
                const eventFolderPath = eventPath + "/" + evtType
                if (!fs.existsSync(eventFolderPath)) fs.mkdirSync(eventFolderPath);

                const files = fs.readdirSync(eventFolderPath).filter(f => f.endsWith(".js"));

                //  console.log(`Loading event \`${evtType}\` (${files.length}) files from '${evtType}'`);

                files.forEach((file) => {
                    const event = require(eventFolderPath + `/${file}`);
                    server.events[evtType].push(event);
                    console.log(`Loaded event ${file} for '${evtType}'`);
                });
            });
        } catch (err) {
            console.log(`Error while loading events. ${err}`);
        }
    }
}

function Run(type, args) {
    const { server } = args;
    const events = server.events[type];
    switch (type) {
        case 'ready':
            events.forEach(f => {
                f(server);
            });
            break;
        case 'join':
        case 'leave':
            events.forEach(f => {
                f(server, args.user, type);
            });
            break;
        case 'message':
            events.forEach(f => {
                f(server, args.message);
            });
            break;

        default:
            //edit dynamic events
            break;
    }

}


module.exports = { Run, Load }