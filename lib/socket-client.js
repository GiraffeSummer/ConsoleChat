const io = require("socket.io-client");
const readline = require('readline');
const { db } = require("../index.js");
const chalk = require('chalk');
const figlet = require('figlet');
const boxen = require('boxen');

const errorFunc = (msg) => { console.log("an error occured: " + msg.message); };
const beep = () => { process.stdout.write('\x07'); }

module.exports = (ser, client) => {
    const receiveMessage = (msg) => {
        if (db.get('beep')) beep()
        const user = msg.user;
        const text = msg.message;
        console.log("" + chalk.hex(user.color)(`<${user.name}> ` + text))
    }

    const socket = io(ser);

    socket.on('connect', () => {
        console.log('Connected to server!');
        socket.emit('join', client);
    });

    socket.on("connect_failed", errorFunc);
    socket.on("connect_error", errorFunc);

    socket.on('message', receiveMessage);
    socket.on('console', (msg) => {
        const name = (msg.name !== undefined) ? msg.name : "CONSOLE";
        console.log(chalk.hex('#14A908')(`<${name}> `) + msg.text);
    });

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

        socket.emit("message", { user: client, message: line });

        rl.prompt();
    }).on('close', function () {
        process.exit(0);
    });

    return { io, socket };
}