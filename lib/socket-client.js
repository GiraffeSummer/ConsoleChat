const io = require("socket.io-client");
const readline = require('readline');
const { db } = require("../index.js");
const chalk = require('chalk');
const figlet = require('figlet');
const boxen = require('boxen');

const errorFunc = (msg) => { console.log("an error occured: " + msg.message); };
const beep = () => { process.stdout.write('\x07'); }

module.exports = (ser, errorListener = errorFunc) => {
    const receiveMessage = (msg) => {
        if (db.get('beep')) beep()
        const user = msg.user;
        const text = msg.message;
        console.log("" + chalk.hex(user.color)(`<${user.name}> ` + text))
    }

    const socket = io(ser);

    socket.on('connect', () => {
        console.log('Connected to server!');
    });

    socket.on("connect_failed", errorListener);
    socket.on("connect_error", errorListener);

    socket.on('message', receiveMessage);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "" //chalk.hex(db.get("color"))(db.get("name") + "> ")
    });

    //text = rs.question(chalk.hex(db.get("color"))(db.get("name") + "> "));
    //socket.emit("message", { user: data, message: text })

    rl.prompt();
    rl.on('line', function (line) {

        line = line.trim();
        if (line === "leave()") rl.close();

        socket.emit("message", { user: db.get(), message: line });

        rl.prompt();
    }).on('close', function () {
        process.exit(0);
    });

    return { io, socket };
}