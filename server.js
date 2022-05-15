const events = require("events");
const fs = require("fs");
const readline = require("readline");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const inquirer = require("inquirer");
const _ = require("lodash");

const records = [];
const listTokes = [];

const filteredToken = (line) => {
    console.log("line___", line);
    console.log('_.split(line, ",", 3)[2]', _.split(line, ",", 3)[2]);
    return _.uniq(listTokes.push(_.split(line, ",", 3)[2]));
};

(async function processLineByLine() {
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream("transactions.csv", { encoding: "utf8" }),
            crlfDelay: Infinity,
        });

        rl.on("line", (line) => {
            // console.log(`Line from file: ${line}`);
            filteredToken(line);

            // console.log("result__", result);
        });

        await events.once(rl, "close");

        console.log("Reading file line by line with readline done.");
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    } catch (err) {
        console.error(err);
    }
})();

// const csvWriter = createCsvWriter({
//     path: `${}.csv`,
//     header: ["TIMESTAMP", "TRANSACTION_TYPE", "TOKEN", "AMOUNT"],
// });
