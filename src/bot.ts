require('dotenv').config({ path: '../.env' });
import Kotori from '@maika.xyz/kotori';
import path from 'path';

const token = process.env.MAIKA_TOKEN as string;
const prefix = process.env.MAIKA_PREFIX as string;
const lavalink = {
    host: (process.env.LAVALINK_HOST) as string,
    port: 2333,
    password: (process.env.LAVALINK_PASSWORD) as string
};
const mongodbURI = process.env.DB_URL as string;

const bot = Kotori.create({
    token,
    prefix,
    commands: path.join(__dirname, 'commands'),
    events: path.join(__dirname, 'events'),
    schedulers: path.join(__dirname, 'schedulers'),
    languages: path.join(__dirname, 'locales'),
    dbURL: mongodbURI,
    owners: [''],
    lavalink
});

bot.start();

process.on('unhandledRejection', (error: any) => bot.logger.error(`  Unhandeled Promise:\n${error.stack}`));