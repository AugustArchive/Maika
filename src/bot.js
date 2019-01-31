require('dotenv').config({ path: '../.env' });
const { Client: MaikaClient } = require('./core');

const client = new MaikaClient();
client.spawn();

process.on('unhandledRejection', (error) => client.logger.error(error.stack));