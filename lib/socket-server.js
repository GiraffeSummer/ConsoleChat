const chalk = require('chalk');
const figlet = require('figlet');

const express = require('express');
const app = express()
const http = require('http').createServer(app)
//const { newChannel } = require('./functions.js');

app.use(express.static('public'))

const commandManager = require('./commands.js');

const eventManager = require('./eventManager');

const server = { commands: {}, events: {}, channels: {}, users: {}, mainChannelName: 'main' }
module.exports = { server, start };
function start(port = 80, version) {
    const io = require('socket.io')(http,
        {
            cors: {
                origin: "http://localhost:3000"
            }
        });//(port);
    server.version = version;
    app.use(require('./router.js')({ version }))

    server.createChannel = (name) => {
        const channel = { name, users: [], send: (content, uName) => { io.in(name).emit('console', { name: uName, text: content }); } }
        server.channels[name] = channel;
        return channel;
    }

    figlet('Server!!', (err, data) => {
        if (err) return;
        console.log(chalk.green(data))
    });

    //load commands
    commandManager.Load(server);
    eventManager.Load(server);

    http.listen(port, () => {
        console.log(`Website loaded.`)
    })

    server.createChannel(server.mainChannelName);

    io.on('connection',
        (socket) => {
            let conId = socket.conn.id;
            socket.on("disconnect", (reason) => {
                const user = server.users[conId];
                const name = (server.users[conId]) ? server.users[conId].name : conId;

                eventManager.Run('leave', { server, user });//

                //leave channel
                const curChannel = server.users[conId].channel.name;
                const index = server.channels[curChannel].users.indexOf(server.users[conId]);
                if (index > -1) server.channels[curChannel].users.splice(index, 1);

                delete server.users[conId];
                console.log("disconnecting " + name);
            });
            socket.on("connect", () => {
                console.log("user joined");
            });
            socket.on("join", (user) => {
                if (server.users[conId] == undefined) server.users[conId] = user;

                SendData(server, socket)

                console.log(chalk.hex(user.color)(user.name) + ` joined [${conId}]`);
                const channel = server.channels[server.mainChannelName];
                socket.join(channel.name);
                channel.users.push(user);

                server.users[conId].channel = channel;

                eventManager.Run('join', { server, user });//
            });
            socket.on("message", (msg) => {
                //console.log("received: ", msg);
                if (server.users[conId] == undefined) { server.users[conId] = msg.user; }

                if (msg.message.startsWith(commandManager.prefix)) {
                    //assign safe data do user (including channel data)
                    msg.user = server.users[conId];
                    RunCommand(msg, io, socket);
                }
                else {
                    socket.to(server.users[conId].channel.name).emit('message', msg);
                    eventManager.Run('message', { server, message: msg });//
                }
            });
        }
    );
    io.on('error', (err) => { console.log('socket closed', err); });

    server.eventManager = eventManager;

    eventManager.Run('ready', { server });//
    return { io };
}


function SendData(server, socket) {
    const data = {
        users: Object.values(server.users).map(user => { return { name: user.name, color: user.color } }),
        commands: commandManager.GetCommandList(),
        channels: Object.keys(server.channels)
    }
    socket.emit("data", data);
}

function RunCommand(msg, io, socket) {
    const args = msg.message.slice(commandManager.prefix.length).split(" ");

    if (args[0] === "") args.shift();
    if (args.length < 1) return;

    const commandName = args.shift().toLowerCase();
    if (server.commands[commandName] != undefined) {
        //send global message

        msg.send = (content, name) => { io.in(msg.user.channel.name).emit('console', { name, text: content }); };
        msg.reply = (content, name) => { socket.emit('console', { name, text: content }); };
        msg.broadcast = (content, name) => { io.emit('console', { name, text: content }); };

        msg.user.socket = socket;

        server.commands[commandName].run(server, msg, args);
    }
}

const baseMessage = { text: "" }