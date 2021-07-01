
const rs = require('readline-sync');
const chalk = require('chalk');
const figlet = require('figlet');
const boxen = require('boxen');
const { NeuDB } = require('./lib/NeuDB.js');

const data = { name: "", color: "#ffffff", beep: true }

const db = new NeuDB(data, true, './chat.json');
module.exports.db = db;

if (db.get("name") == "") {
    db.set("name", rs.question("enter your name: "));
    db.set('color', RandomColor());
} else {
    console.log(db.get("name") + " Logged in.");
}

//const isServer = rs.keyInYN('Do you want to be the server?')

const MainMenu = (args = undefined) => {
    const menuOptions = ['client', 'server', 'edit (WIP)', 'exit()'];
    let mode;

    const checkArgs = !(args == undefined);
    if (checkArgs && args['mode'] !== undefined && menuOptions.length > args['mode']) {
        mode = menuOptions[args['mode'] - 1]
    } else {
        mode = menuOptions[
            rs.keyInSelect(menuOptions, 'What do you want to do ' + db.get('name'), {
                cancel: false
            })
        ];
    }

    if (args !== undefined) {
        let text = "Arguments:\n"
        const keys = Object.keys(args)
        for (let i = 0; i < keys.length; i++) {
            text += keys[i] + ": " + args[keys[i]] + "\n";
        }
        console.log(boxen(text, { borderColor: 'blue' }))
    }


    switch (mode) {
        case 'client':
            let connUrl;
            if (checkArgs && args['uri'] !== undefined)
                connUrl = args['uri'];
            else
                connUrl = rs.question("server to connect to: (http://localhost:80) ", { defaultInput: "http://localhost:80" });

            require("./lib/socket-client.js")(connUrl);
            break;

        case 'server':
            let port;
            if (checkArgs && args['port'] !== undefined && args['port'] < 65535)
                port = args['port'];
            else
                port = rs.questionInt("server port: (80) ", { defaultInput: 80 });

            require("./lib/socket-server.js")(port);
            break;
        case menuOptions[2]:
            console.log("this is not implemented yet, please edit 'chat.json' for now");
            break;
        case 'exit()':
            process.exit();
            break;

        default:
            console.clear();
            MainMenu();
            break;
    }
}

function CheckArgs() {
    let args = process.argv.slice(2) || undefined;

    if (args) {
        if (args.length < 1) {
            MainMenu();
        } else if (args[0].toLowerCase() == "help") {
            console.log("usable arguments are:\n" +
                "mode: mode to launch in (1=client, 2=server)\n" +
                "port: in server mode what port to use\n" +
                "uri:  in client mode what uri to connect to")
        } else {
            args = argsToObj(args);
            MainMenu(args);
        }
    }
}
CheckArgs();

function argsToObj(args) {
    try {
        let a = {};
        args.forEach(element => {
            const e = element.split('=');
            if (isNaN(e[1]))
                a[e[0]] = e[1];
            else
                a[e[0]] = e[1];
        });
        return a;
    } catch (error) {
        console.log("invalid arguments: " + error.message);
        return undefined;
    }
}


function RandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


//greeting user
//console.log(chalk.hex(data.user.color)(`Hello ${db.get("user").name}\n`));

//maybe use keyselect with rooms?
/*
animals = ['Lion', 'Elephant', 'Crocodile', 'Giraffe', 'Hippo'],
    index = rs.keyInSelect(animals, 'Which animal?');
console.log('Ok, ' + animals[index] + ' goes to your room.');*/