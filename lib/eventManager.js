const fs = require('fs');
const Templates = require('./template/event');

const Types = Object.freeze({ ready: "ready", join: "join", leave: "leave", changechannel: 'changechannel', createchannel: 'createchannel', message: "message" });

const { db } = require("../index.js");

const Load = (server) => {
    const eventPath = db.get('dataPath') + '/events';

    if (!fs.existsSync(eventPath)) {
        console.log(`'${eventPath}' not found, it is now created, add custom server events there.`);
        fs.mkdirSync(eventPath);
    } else {
        try {
            console.log(`Loading events from folder: '${eventPath}'`)

            //make sure all basic folders are present
            Object.values(Types).forEach(evt => {
                const eventFolderPath = eventPath + "/" + evt
                if (!fs.existsSync(eventFolderPath)) {
                    fs.mkdirSync(eventFolderPath);
                }
            });

            //go through all event folders
            const eventFolders = getDirectories(eventPath);
            eventFolders.forEach(evtType => {
                server.events[evtType] = [];
                const eventFolderPath = eventPath + "/" + evtType

                const files = fs.readdirSync(eventFolderPath).filter(f => f.endsWith(".js"));

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
    
    if(events === undefined) return;

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

        case 'createchannel':
            events.forEach(f => {
                f(server, args.user, args.channel);
            });
            break;

        case 'changechannel':
            events.forEach(f => {
                f(server, args.user, args.newChannel, args.oldChannel);
            });
            break;

        default:
            //edit dynamic events
            break;
    }

}

const getDirectories = source =>
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

module.exports = { Run, Load }