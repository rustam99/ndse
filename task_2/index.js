#!/usr/bin/env node

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function getRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

const min = 0
const max = 100
const number = getRandom(min, max)

const checkNumber = (input) => {
    if (typeof input !== 'number' || Number.isNaN(input)) throw new Error('Не число')

    if (number > input) {
        console.log('Больше')
        return false
    }

    if (number < input) {
        console.log('Меньше')
        return false
    }

    console.log(`Отгадано число ${input}`)
    return true
}

console.log(`Загадано число в диапазоне от ${min} до ${max}`)

readline.on('line', (line) => {
    try {
        const number = parseInt(line)
        const isRight = checkNumber(number)

        if (isRight) readline.close()
    } catch (e) {
        console.log('Не верный формат числа')
    }
});
