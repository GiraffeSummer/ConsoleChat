const chalk = require('chalk');
module.exports = {
    config: {
        name: "help",
        description: "show all commands",
        usage: "help",
        enabled: true
    },
    run: (server, msg, args) => {
        if (args.length > 0) {

        }

        msg.send("Commands: [" + chalk.hex('#F4854F')(Object.keys(server.commands).join(", ")) + "]");
    }
}