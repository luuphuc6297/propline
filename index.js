const inquirer = require("inquirer");
const fs = require("fs");

let arrToken = {};

load = async (fileName) => {
    console.time(__filename);
    let last = "";
    const readable = fs.createReadStream(fileName, { encoding: "utf8" });
    for await (const chunk of readable) {
        const arr = last.concat(chunk).split("\n");
        console.log("last____", last);
        if (Object.keys(arrToken).length === 0) arr.shift();
        last = arr.pop();
        arr.forEach((record) => {
            const tempRecord = record.split(",");
            const date = new Date(tempRecord[0] * 1000);
            if (
                !arrToken[tempRecord[2]] ||
                date.getFullYear() !== arrToken[tempRecord[2]][arrToken[tempRecord[2]].length - 1]
            ) {
                !arrToken[tempRecord[2]]
                    ? (arrToken[tempRecord[2]] = [date.getFullYear()])
                    : arrToken[tempRecord[2]].push(date.getFullYear());
                this[`${tempRecord[2]}-${date.getFullYear()}`] = fs.createWriteStream(
                    `${tempRecord[2]}-${date.getFullYear()}.log`
                );
            }
            this[`${tempRecord[2]}-${date.getFullYear()}`].write(record.concat("\n"));
        });
    }
    console.timeEnd(__filename);
};

inquirer.registerPrompt("date", require("inquirer-date-prompt"));

const selectPrompt = {
    type: "list",
    name: "question",
    message: `${new inquirer.Separator()}\nPick one to query`,
    choices: [
        {
            value: 1,
            name: "Given no parameters, return the latest portfolio value per token in USD",
        },
        {
            value: 2,
            name: "Given a token, return the latest portfolio value for that token in USD",
        },
        {
            value: 3,
            name: "Given a date, return the portfolio value per token in USD on that date",
        },
        {
            value: 4,
            name: "Given a date and a token, return the portfolio value of that token in USD on that date",
        },
        "Exit",
    ],
};

const tokenPrompt = {
    name: "token",
    message: "Given a token: ",
};

const dataPrompt = {
    type: "date",
    name: "date",
    message: "Given a date: ",
    filter: (d) => Math.floor(d.getTime() / 1000),
    locale: "en-US",
    format: { month: "short", hour: undefined, minute: undefined },
    clearable: true,
};

main = () => {
    inquirer.prompt(selectPrompt).then(async (select) => {
        console.log(select);
        switch (select.question) {
            case 1:
                await question1();
                main();
                break;
            case 2:
                question2();
                break;
            case 3:
                question3();
                break;
            case 4:
                question4();
                break;
            default:
                process.exit();
        }
    });
};

async function question1() {
    for (const token in arrToken) {
        console.log(token);
        const readable = fs.createReadStream(`${token}-${arrToken[token][0]}.log`, { encoding: "utf8" });
        for await (const chunk of readable) {
            console.log(chunk.slice(0, chunk.indexOf("\n")));
            break;
        }
    }
}

function question2() {
    inquirer.prompt(tokenPrompt).then((answers) => {
        console.log(answers);
    });
}

function question3() {
    inquirer.prompt(dataPrompt).then((answers) => {
        console.log(answers);
    });
}

function question4() {
    inquirer.prompt([tokenPrompt, dataPrompt]).then((answers) => {
        console.log(answers);
    });
}

load("transactions.csv");
main();
