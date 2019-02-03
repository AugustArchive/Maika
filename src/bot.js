console.clear();
const Hideri = require('@maika.xyz/hideri');
const { Client: MaikaClient } = require('./core');

/** @type {import('@maika.xyz/hideri').Hideri.Logger} */
const logger = Hideri.create();

logger.info('  Starting Maika...');
require('dotenv').config({ path: '../.env' });

logger.info('  Starting discord client...');
const client = new MaikaClient();
client.spawn();

process.on('unhandledRejection', (error) => client.logger.error(error.stack));