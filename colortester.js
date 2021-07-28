//Tool to test for safe console colors
const rs = require('readline-sync');
const chalk = require('chalk');

const colors = require('./lib/colors').all;

let safe = []

for (const color of colors) {
    console.clear();
    console.log(chalk.hex(color.value)("this is color: " + color.name));
    let is_safe = rs.keyInYN('Save?');
    if (is_safe) {
        safe.push(color);
    }
}

console.log(safe);

SaveJson(safe,"./safeColors.json")

function SaveJson(json, location) {
    let data = JSON.stringify(json, null, 4);
    fs.writeFileSync(location, data);
}