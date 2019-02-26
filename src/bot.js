console.clear();
require('dotenv').config({ path: '../.env' });
const Kotori = require('@maika.xyz/kotori');
const path   = require('path');
const build  = require('./build');

const bot = Kotori.create({
    token: process.env.MAIKA_TOKEN,
    prefix: process.env.MAIKA_PREFIX,
    commands: path.join(__dirname, 'commands'),
    events: path.join(__dirname, 'events'),
    schedulers: path.join(__dirname, 'schedulers'),
    languages: path.join(__dirname, 'locales'),
    dbURL: process.env.DB_URL,
    nodes: [
        { 
            host: process.env.LAVALINK_HOST,
            port: 2333,
            password: process.env.LAVALINK_PASSWORD 
        }
    ],
    disableEveryone: true,
    defaultImageFormat: 'png',
    getAllUsers: true,
    disableEvents: {
        TYPING_START: true
    },
    maxShards: 'auto',
    owners: ['280158289667555328', '229552088525438977'],
    fileOptions: { path: path.join(__dirname, 'tmp/logs.txt') }
});

bot.logger.info(`Starting build ${build.mode[0]} (${build.mode[1]})`);
bot.start();

process.on('unhandledRejection', (reason, promise) => bot.logger.error(`Unhandled Promise:\n\n${require('util').inspect(promise)}\n${reason}`));