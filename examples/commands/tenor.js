const chalk = require('chalk');
const TenorClient = require('node-tenor.js');
const client = new TenorClient('<API KEY>');

module.exports = {
    config: {
        name: "tenor",
        description: "send a tenor gif",
        usage: "tenor [search tags]",
        enabled: true
    },
    run: (server, msg, args) => {

        client.search(args.join(' '))
            .then((gifs) => {
                const gif = gifs.results[0];
                
                if (gif.title == "") {
                    const url = gif.itemurl.split('/');
                    gif.title = url[url.length - 1].split('-').join(' ')
                    if (gif.title.length > 24)
                        gif.title = gif.title.substring(0, 24) + '...';
                }
                msg.send(chalk.green(gif.title) + ": " + chalk.blueBright(gif.url));
            })
            .catch((error) => {
                msg.reply("something went wrong :(");
                console.log(error);
            });

    }
}
