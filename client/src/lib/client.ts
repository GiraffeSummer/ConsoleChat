import io from "socket.io-client";
import { writable } from "svelte/store"
import type { User, Client, Channel } from './Definitions'

const messages = writable([])

//temporary wrapper object to fix some errors
const chalk = {
    hex(color: string): Function {
        return function (text: string): string {
            return text;
        }
    }
}

let connection = null;
let sendMessage: Function | null = null;
const data = writable({})

function Connect(ser: string, client: Client) {
    const receiveMessage = (msg) => {
        console.log(msg)
        const { user, message } = msg;
        console.log("" + chalk.hex(user.color)(`<${user.name}> ` + message))
        messages.update(list => [...list, msg])
    }

    const socket = io(ser);

    socket.on('connect', () => {
        console.log('Connected to server!');
        socket.emit('join', client);
    });

    socket.on('data', (_data) => {
        console.log(_data)
        data.set(_data)
    });

    socket.on("connect_failed", errorFunc);
    socket.on("connect_error", errorFunc);

    socket.on('message', receiveMessage);
    socket.on('console', (msg) => {
        const name = (msg.name !== undefined) ? msg.name : "SERVER";
        console.log(chalk.hex('#14A908')(`<${name}> `) + msg.text);
    });

    sendMessage = function (line: string) {
        line = line.trim();
        if (line === "leave()") Disconnect();

        const msg = { user: client, message: line };

        receiveMessage(msg)

        socket.emit("message", msg);
    }
    connection = io;
    return { io, socket };
}

function Disconnect() {
    connection = null;
}

const errorFunc = (msg) => { console.log("an error occured: " + msg.message); };

function Send(text: string) {
    if (sendMessage != null) {
        sendMessage(text);
    } else throw new Error("Sendmessage is not available, please connect first");
}

export { Connect, connection, Send, Disconnect, messages, data }