const chalk = require('chalk');
module.exports = {
    config: {
        name: "test",
        description: "test",
        usage: "test",
        enabled: true
    },
    run: (server, msg, args) => {
        msg.send("args: [" + chalk.green(args.join(", ")) + "]");
    }
}