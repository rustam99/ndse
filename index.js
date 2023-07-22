#!/usr/bin/env node
const yargs = require('yargs/yargs')
const {hideBin} = require('yargs/helpers')

const getChangedDate = (dateFormat = 'date', number = 0, operation = 'plus') => {
    if (typeof number !== 'number') return;
    if (operation !== 'plus' && operation !== 'minus') return

    const date = new Date()
    const dateMap = {
        date: {
            setFn: (number) => date.setDate(number),
            getFn: () => date.getDate()
        },
        month: {
            setFn: (number) => date.setMonth(number),
            getFn: () => date.getMonth(),
        },
        year: {
            setFn: (number) => date.setFullYear(number),
            getFn: () => date.getFullYear(),
        },
    }

    if (!Object.keys(dateMap).includes(dateFormat)) return

    const setFn = dateMap[dateFormat].setFn
    const getFn = dateMap[dateFormat].getFn

    const numberToChange = operation === 'plus' ? getFn() + number : getFn() - number

    setFn(numberToChange)

    return date.toString()
}

const isDateOptionPassed = (argv) => {
    const isPassed = argv.year || argv.month || argv.date

    if (!isPassed) throw new Error('Не передана опция')

    return isPassed
}

const commandBuilder = (yargs) => {
    return yargs
        .options(dateOptions)
        .check(isDateOptionPassed)
        .positional('number', {
            type: 'number',
            description: 'Число на которое изменять дату'
        })
}

const commandHandler = (argv, operation) => {
    if (Number.isNaN(argv.number)) throw new Error('Не верный формат числа')

    for (const key in dateOptions) {
        if (key in argv) return console.log(getChangedDate(key, argv.number, operation))
    }
}

const dateOptions = {
    year: {
        alias: 'y',
        type: 'boolean',
        description: 'Текущий год',
    },
    month: {
        alias: 'm',
        type: 'boolean',
        description: 'Текущий месяц',
    },
    date: {
        alias: 'd',
        type: 'boolean',
        description: 'Дата в календарном месяце',
    }
}

yargs(hideBin(process.argv))
    .scriptName('cdate')
    .usage('$0 <cmd> [args]')
    .command('current [option]', 'Выводит текущую дату', (yargs) => {
        return yargs.options(dateOptions)
    }, (argv) => {
        if (argv.year) return console.log(new Date().getFullYear().toString())
        if (argv.month) return console.log(new Date().getMonth().toString())
        if (argv.date) return console.log(new Date().getDate().toString())

        return console.log(new Date().toString())
    })
    .command(
        'sub [option] <number>',
        'Возвращает текущий дату - указанную дату',
        commandBuilder,
        (argv) => {
            commandHandler(argv, 'minus')
        },
    )
    .command(
        'add [option] <number>',
        'Возвращает текущий дату + указанную дату',
        commandBuilder,
        (argv) => {
            commandHandler(argv, 'plus')
        },
    )
    .parse()
