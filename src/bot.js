require('dotenv').config({ path: '../.env' });
const MaikaClient = require('./structures/client');

const client = new MaikaClient();
client.start();

process.on('unhandledRejection', e => client.logger.error(e));