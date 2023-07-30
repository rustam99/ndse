const fs = require('fs');
const path = require('path');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function getRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

const min = 1;
const max = 2;
let logFileName = ''

const getLogPath = () => path.join(__dirname, `${logFileName}.txt`);

const writeLog = (data) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(getLogPath(), `${data}\n`, (err) => {
            if (err) return reject(err);

            return resolve();
        });
    });
}

const prepareGame = () => {
    return new Promise((resolve) => {
        readline.question('Введите название Лог файла: ', (name) => {
            logFileName = name || 'log';

            return resolve();
        });
    });
}

const getNum = (str) => {
    const num = parseInt(str);

    if (Number.isNaN(num)) throw new Error('Не число');
    if (num !== 1 && num !== 2) throw new Error('Не верные числа');

    return num;
}

const getLogString = (status) => {
    return `${new Date().toString()}::${status ? 'Winner' : 'Failed'}`
}

const setResult = (randomNumber, userNumber) => {
    const isWinner = randomNumber === userNumber;
    const logString = getLogString(isWinner);

    writeLog(logString).catch(() => console.log('Не удачная попытка записи в лог файл'));
}

const logStart = () => console.log('Выберите 1 (орел) или 2 (решка)');

prepareGame().then(() => {
    logStart();

    readline.on('line', (str) => {
        try {
            const userNumber = getNum(str);
            const randomNumber = getRandom(min, max);

            setResult(randomNumber, userNumber);

            if (userNumber === randomNumber) {
                console.log('Победа')
            } else {
                console.log('Поражение');
            }

            logStart();
        } catch (e) {
            console.log('Не верный формат');
            logStart();
        }
    });
})
