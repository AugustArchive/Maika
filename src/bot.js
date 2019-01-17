require('dotenv').config({ path: '../.env' });

if (process.platform === 'win32')
    process.title = '-= Maika =-';

const { Client: MaikaClient } = require('./core');

const client = new MaikaClient();
client.bootstrap();

process.on('unhandledRejection', (error) => client.logger.error(error.stack));