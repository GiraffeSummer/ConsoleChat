const chalk = require('chalk');
const figlet = require('figlet');
const boxen = require('boxen');

module.exports = function (port = 80) {
    const io = require('socket.io')(port);
    figlet('Server!!', (err, data) => {
        if (err) return;
        console.log(chalk.green(data))
    });
    //console.log("Running as server...")
    const users = {}
    io.on('connection',
        (socket) => {
            console.log('socket connected');
            let conId = socket.conn.id;
            socket.on("disconnect", (reason) => {
                const name = (users[conId]) ? users[conId] : conId;
                console.log("disconnecting " + name);
            });
            socket.on("connect", () => {
                console.log("user joined");
            });
            socket.on("message", (msg) => {
                console.log("received: ", msg);
                if (users[conId]) users[conId] = msg.user;
                socket.broadcast.emit('message', msg);
            })
        }
    );
    io.on('error', (err) => { console.log('socket closed', err); });
    return { io };
}