//I have a general folder for all the packages for all the commands/events
const chalk = require('../../packages/node_modules/chalk');

module.exports = (server, user, newChannel, oldChannel) => {
    oldChannel.send("Left the channel", chalk.hex(user.color)(user.name));
    newChannel.send("Joined the channel", chalk.hex(user.color)(user.name));
}