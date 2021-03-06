const os = require("os");
const fs = require("fs");
const rs = require('readline-sync');
const chalk = require('chalk');
const figlet = require('figlet');
const NeuDB = require('./lib/NeuDB.js');

const colors = require('./lib/colors.js').safe;

const version = 0.6;

const saveFolder = GetSavePath();

const data = { name: "", color: "#ffffff", beep: true, dataPath: saveFolder };

const db = new NeuDB({ data, autoSave: true, filePath: saveFolder + '/chat', asBinary: true });
module.exports.db = db;


console.log(`\nversion: ${chalk.cyan("v" + version)}`);
if (db.get("name") == "") {
    db.set("name", rs.question("enter your name: "));
    db.set('color', RandomColor());
} else {
    console.log(chalk.hex(db.get('color'))(db.get("name")) + " Logged in. ");
}

//const isServer = rs.keyInYN('Do you want to be the server?')

const MainMenu = (args = undefined) => {
    const menuOptions = ['client', 'server', 'edit', 'exit()'];
    let mode;

    const checkArgs = !(args == undefined);
    if (checkArgs && args['mode'] !== undefined && menuOptions.length > args['mode']) {
        mode = menuOptions[args['mode'] - 1]
    } else {
        mode = menuOptions[
            rs.keyInSelect(menuOptions, 'What do you want to do ' + chalk.hex(db.get('color'))(db.get("name")), {
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
        //console.log(boxen(text, { borderColor: 'blue' }))//using 'boxen' package
        console.log(text)
    }


    switch (mode) {
        case 'client':
            let connUrl;
            if (checkArgs && args['uri'] !== undefined)
                connUrl = args['uri'];
            else
                connUrl = rs.question("server to connect to: (http://localhost:80) ", { defaultInput: "http://localhost:80" });

            const user = db.get();
            const client = { name: user.name, color: user.color, version }

            require("./lib/socket-client.js")(connUrl, client);
            break;

        case 'server':
            if (!fs.existsSync(saveFolder)) fs.mkdirSync(saveFolder);

            let port;
            if (checkArgs && args['port'] !== undefined && args['port'] < 65535)
                port = args['port'];
            else
                port = rs.questionInt("server port: (80) ", { defaultInput: 80 });

            require("./lib/socket-server.js").start(port, version);
            break;
        case menuOptions[2]:
            //console.log("Work in progress");
            const opts = ['name', 'color', 'sound']

            const choice = opts[
                rs.keyInSelect(opts, 'What do you want to edit? ')
            ];

            switch (choice) {
                case 'name':
                    db.set("name", rs.question("enter your name: "));
                    break;
                case 'color':
                    ChangeColor();
                    break;
                case 'sound':
                    db.set("beep", rs.keyInYN('Do you want Sounds enabled?'));
                    break;
                default:
                    break;
            }

            MainMenu();
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

function ChangeColor() {
    console.log("Changing color..")
    const maxLength = 9;
    let shortenedList = Shuffle(colors);
    const sliceNum = Math.floor(Math.random() * colors.length - maxLength);
    shortenedList = shortenedList.slice(sliceNum, sliceNum + maxLength);
    const result = rs.keyInSelect(
        shortenedList.map(x => chalk.hex(x.value)(x.name.replace('_', " "))),
        'What color do you want to pick ' + chalk.hex(db.get('color'))(db.get("name"))
    );
    if (result == -1) {
        console.log("Keeping current color!");
    } else {
        const color = shortenedList[result];
        db.set('color', color.value);
        console.log("Color Set to: " + chalk.hex(db.get('color'))(color.name));
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

function GetSavePath() {
    let _path = '';
    if (os.platform() == 'win32') {
        const homeDir = os.homedir();
        _path = homeDir + "/Documents";
    } else {
        if (os.userInfo().username == 'root') throw new Error('Do not run as root!');

        _path = '/home/' + os.userInfo().username;
    }
    console.log(_path);

    if (!fs.existsSync(_path)) fs.mkdirSync(_path);

    return _path + '/cmdChat';
}

function Shuffle(array) {
    return array.sort((a, b) => 0.5 - Math.random());
}

//greeting user
//console.log(chalk.hex(data.user.color)(`Hello ${db.get("user").name}\n`));

//maybe use keyselect with rooms?
/*
animals = ['Lion', 'Elephant', 'Crocodile', 'Giraffe', 'Hippo'],
    index = rs.keyInSelect(animals, 'Which animal?');
console.log('Ok, ' + animals[index] + ' goes to your room.');*/