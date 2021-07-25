const chalk = require('chalk');
const eventManager = require('./eventManager');

const { newChannel } = require('./functions.js');

module.exports = [
    {
        config: {
            name: "online",
            description: "Show who is online",
            usage: "online",
            enabled: true
        },
        run: (server, msg, args) => {
            let onlineUsers = ''
            const userKeys = Object.keys(server.users)
            for (let i = 0; i < userKeys.length; i++) {
                const user = server.users[userKeys[i]];
                onlineUsers += chalk.hex(user.color)(user.name);
                if (i !== userKeys.length - 1) onlineUsers += ", "
            }
            msg.reply("Online: [" + onlineUsers + "]");
        }
    },

    {
        config: {
            name: "whois",
            description: "Show who is online in the channel",
            usage: "whois",
            enabled: true
        },
        run: (server, msg, args) => {
            let onlineUsers = ''
            for (const user of msg.user.channel.users) {
                onlineUsers += chalk.hex(user.color)(user.name);
                if (user !== msg.user.channel.users[msg.user.channel.users.length - 1]) onlineUsers += ", "
            }
            msg.reply(`in ${msg.user.channel.name}: [` + onlineUsers + "]");
        }
    },

    {
        config: {
            name: "help",
            description: "show all commands",
            usage: "help, help [command]",
            enabled: true
        },
        run: (server, msg, args) => {
            if (args.length > 0) {
                if (server.commands[args[0]] == undefined) return msg.reply("invalid command");
                const cmd = server.commands[args[0]].config;
                msg.reply(`${chalk.blue.bold(cmd.name)}: ${chalk.yellowBright(cmd.description)}\n${chalk.cyanBright.bold("-------------- Usage:  - ") + chalk.green(cmd.usage)}`);
            } else {
                msg.reply("Commands: [" + chalk.hex('#F4854F')(Object.keys(server.commands).join(", ")) + "]");
            }
        }
    },

    //channel stuff
    {
        config: {
            name: "channel",
            description: "your current channel",
            usage: "channel",
            enabled: true
        },
        run: (server, msg, args) => {
            msg.reply("Current channel: " + chalk.cyan(msg.user.channel.name));
        }
    },

    {
        config: {
            name: "mkchannel",
            description: "make channel",
            usage: "mkchannel [channelName]",
            enabled: true
        },
        run: (server, msg, args) => {
            if (args.length < 1) {
                return msg.reply("you have to enter a channel name!");
            }
            const channel = newChannel(args[0]);
            server.channels[args[0]] = channel;

            eventManager.Run('createchannel', { server, user: msg.user, newChannel: channel });

            msg.reply(`You created channel: ${chalk.green.bold(channel.name)}`);
        }
    },

    {
        config: {
            name: "cchannel",
            description: "change your channel",
            usage: "cchannel [channelName]",
            enabled: true
        },
        run: (server, msg, args) => {
            if (args.length < 1) {
                return msg.reply("you have to enter a channel name!");
            }

            if (server.channels[args[0]] == undefined) return msg.reply('That is not a valid channel!');

            let newChannel = server.channels[args[0]];
            let oldChannel = `${msg.user.channel.name}`;

            msg.user.socket.leave(oldChannel);
            msg.user.socket.join(newChannel.name);

            eventManager.Run('changechannel', { server, user: msg.user, newChannel, oldChannel });

            msg.user.channel = newChannel;

            newChannel.users.push(msg.user);
            const index = server.channels[oldChannel].users.indexOf(msg.user);
            if (index > -1) server.channels[oldChannel].users.splice(index, 1);

            msg.reply(`You changed to ${chalk.green.bold(newChannel.name)} from ${chalk.red.bold(oldChannel)}`);
        }
    },

    {
        config: {
            name: "lchannel",
            description: "list all channels",
            usage: "lchannel",
            enabled: true
        },
        run: (server, msg, args) => {
            let names = [];
            const keys = Object.keys(server.channels)
            for (let i = 0; i < keys.length; i++) {
                const channel = server.channels[keys[i]];
                names.push(channel.name);
            }
            msg.reply("Channels: [" + chalk.cyan(names.join(', ')) + "]");
        }
    },

    {
        config: {
            name: "version",
            description: "get the server version",
            usage: "version",
            enabled: true
        },
        run: (server, msg, args) => {
            msg.reply("Server version is: " + chalk.cyan("v" + server.version));
        }
    }
]