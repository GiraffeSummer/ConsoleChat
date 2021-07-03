const chalk = require('chalk');
const figlet = require('figlet');
const boxen = require('boxen');

const commandManager = require('./commands.js');

const { newChannel } = require('./functions.js');

const server = { commands: {}, channels: {}, users: {}, mainChannelName: 'main' }
module.exports = { server, start };
function start(port = 80) {
    const io = require('socket.io')(port);
    figlet('Server!!', (err, data) => {
        if (err) return;
        console.log(chalk.green(data))
    });

    //load commands
    commandManager.Load(server);
    
    server.channels[server.mainChannelName] = newChannel(server.mainChannelName);

    io.on('connection',
        (socket) => {
            let conId = socket.conn.id;
            socket.on("disconnect", (reason) => {
                const name = (server.users[conId]) ? server.users[conId].name : conId;
                delete server.users[conId];
                console.log("disconnecting " + name);
            });
            socket.on("connect", () => {
                console.log("user joined");
            });
            socket.on("join", (user) => {
                if (server.users[conId] == undefined) server.users[conId] = user;
                console.log(chalk.hex(user.color)(user.name) + ` joined [${conId}]`);
                const channel = server.channels[server.mainChannelName];
                socket.join(channel.name);
                channel.users.push(user);

                server.users[conId].channel = channel;
            });
            /*socket.on('changechannel', (data) => {
                socket.leave(data.user.channel.name);
                socket.join(server.channels[data.channel.name])
            })*/
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
                }
            });
        }
    );
    io.on('error', (err) => { console.log('socket closed', err); });
    return { io };
}

function RunCommand(msg, io, socket) {
    const args = msg.message.slice(commandManager.prefix.length).split(" ");

    if (args[0] === "") args.shift();
    if (args.length < 1) return;

    const commandName = args.shift().toLowerCase();
    if (server.commands[commandName] != undefined) {
        //send global message

        msg.send = (content) => { io.in(msg.user.channel.name).emit('console', { text: content }); };
        msg.reply = (content) => { socket.emit('console', { text: content }); };
        msg.broadcast = (content) => { io.emit('console', { text: content }); };

        msg.user.socket = socket;

        server.commands[commandName].run(server, msg, args);
    }
}

const baseMessage = { text: "" }