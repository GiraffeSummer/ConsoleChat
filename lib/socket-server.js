const chalk = require('chalk');
const figlet = require('figlet');
const boxen = require('boxen');

const commandManager = require('./commands.js');

const server = { commands: {}, users: {} }
module.exports = { server };

module.exports = function (port = 80) {
    const io = require('socket.io')(port);
    figlet('Server!!', (err, data) => {
        if (err) return;
        console.log(chalk.green(data))
    });

    //load commands
    commandManager.Load(server);
    console.log(server.commands)

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
            });
            socket.on("message", (msg) => {
                //console.log("received: ", msg);
                if (server.users[conId] == undefined) server.users[conId] = msg.user;

                if (msg.message.startsWith(commandManager.prefix)) {
                    const args = msg.message.slice(commandManager.prefix.length).split(" ");

                    if (args[0] === "") args.shift();
                    if (args.length < 1) return;

                    const commandName = args.shift().toLowerCase();
                    if (server.commands[commandName] != undefined) {
                        msg.send = (msg) => { socket.emit('console', { text: msg }); }

                        server.commands[commandName].run(server, msg, args);
                    }
                }
                else {
                    socket.broadcast.emit('message', msg);
                }
            });
        }
    );
    io.on('error', (err) => { console.log('socket closed', err); });
    return { io };
}

const baseMessage = { text: "" }