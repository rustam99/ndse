const fs = require('fs');
const readline = require('readline');

const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

readlineInterface.question('Укажите путь к файлу логов: ', (path) => {
    fs.access(path, fs.constants.R_OK, async (err) => {
        if (err) {
            console.log('Не найден файл');

            return readlineInterface.close();
        }

        const readFileStream = fs.createReadStream(path, 'utf8');
        const rl = readline.createInterface({
            input: readFileStream,
            crlfDelay: Infinity,
        });

        let gameLength = 0;
        let winnerLength = 0;
        let failedLength = 0;

        for await (const line of rl) {
            const parsedLine = line.split('::');
            const statusStr = parsedLine[1];

            if (statusStr === 'Winner') {
                winnerLength++;
            } else if (statusStr === 'Failed') {
                failedLength++;
            }

            gameLength++;
        }

        console.log(`Общее количество партий: ${gameLength}`);
        console.log(`Кол-во выигранных партий: ${winnerLength}`);
        console.log(`Кол-во проигранных партий: ${failedLength}`);
        console.log(`Процентное соотношение выигранных партий: ${winnerLength / gameLength * 100}`);

        readlineInterface.close();
    });
});
