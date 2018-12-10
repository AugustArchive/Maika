require('dotenv').config({ path: '../.env' });
const MaikaClient = require('./core/client');

const client = new MaikaClient();
client.start();

process.on('unhandledRejection', e => client.logger.error(`ehh? ${e.stack}`));