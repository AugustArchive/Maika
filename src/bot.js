require('dotenv').config({ path: '../.env' });
const { Client: MaikaClient } = require('./core');

const client = new MaikaClient();
client.bootstrap();

process.on('unhandledRejection', (error) => client.logger.error(error.stack));