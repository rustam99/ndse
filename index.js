const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});
const http = require('http');

let API_KEY = '';

try {
    const { API_KEY: apiKey } = require('./config.js');

    API_KEY = apiKey;
} catch (e) {
    console.log('Не найден модуль config');

    process.exit();
}

readline.question('Введите город: ', (city) => {
    try {
        if (!city) {
            console.log('Не введен город');

            return readline.close();
        }

        http.get(`http://api.weatherstack.com/current?access_key=${API_KEY}&query=${city}`, (res) => {
            if (res.statusCode !== 200) return console.log(`Ошибка запроса, статус код ${res.statusCode}`);

            let data = '';

            res.setEncoding('utf8');

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('error', (err) => {
                console.log('Ошибка!');
                console.log(err);

                readline.close();
            });

            res.on('end', () => {
                try {
                    data = JSON.parse(data);

                    if (!data.request && !data.success) {
                        console.log('Что-то пошло не так');
                        console.log(`Код ошибки: ${data.error.code}`);
                        console.log(`Информация: ${data.error.info}`);
                    } else {
                        console.log(`Город - ${data.location.name}`);
                        console.log(`Температура в городе - ${data.current.temperature} °c`);
                        console.log(`Скорость ветра - ${data.current.wind_speed} kmph`);
                        console.log(`Давление - ${data.current.pressure} mb`);
                        console.log(`Влажность - ${data.current.humidity}`);
                        console.log(`Видимость - ${data.current.visibility}`);

                        const weather = data.current.weather_descriptions.join(', ');

                        console.log(`Погодные услвоия - ${weather}`);
                    }

                    readline.close();
                } catch (e) {
                    console.log(e);

                    readline.close();
                }
            });
        });
    } catch (e) {
        console.log(e);
    }
});

