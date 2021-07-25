const express = require('express');
const router = express.Router();

module.exports = (params) => {
    const { version } = params;
    router.get('/', function (req, res, next) {
        res.end(mainPage(version));
    });

    return router;
}

function mainPage(version) {
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Terminal chat</title>
      </head>
      <body>
        <h2>Welcome to Terminal Chat</h2>
        <div>
          You want to download the app from
          <a href="https://github.com/GiraffeSummer/ConsoleChat/releases/latest"
            >Here</a
          ><br />
          and then connect to this url!
        </div><br>
        <div >Running version: <span style="color:blue">v${version}</span></div>
      </body>
    </html>
    `
}