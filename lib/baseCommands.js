const chalk = require('chalk');
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
            name: "help",
            description: "show all commands",
            usage: "help",
            enabled: true
        },
        run: (server, msg, args) => {
            if (args.length > 0) { }

            msg.reply("Commands: [" + chalk.hex('#F4854F')(Object.keys(server.commands).join(", ")) + "]");
        }
    }
]