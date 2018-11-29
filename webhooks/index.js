const express = require('express');
const winston = require('winston');

const app    = express();
const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.colorize({ level: true }),
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf(i => `[WebhookServer] [${i.level}] >> ${i.message}`)
    )
});

app
    .get('/patreon', (req, res) => {
        
    }).listen(5590, () => logger.info('Listening on port 5590!'));