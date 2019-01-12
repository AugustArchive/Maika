const express = require('express');
const winston = require('winston');
const { readdir } = require('fs'); 
const path = require('path');

module.exports = class MaikaWebsite {
    /**
     * Create a new Maika website instance
     * @param {import('../../src/core/internal/client')} client The client
     */
    constructor(client) {
        this.client = client;
        this.app = express();
        this.app.disable('x-powered-by');
        // This is the logger for the initial website (i.e: this class only)
        // Use MaikaClient.logger for other class parts (i.e: routers & middleware)
        this.logger = winston.createLogger({
            transports: [new winston.transports.Console()],
            format: winston.format.combine(
                winston.format.colorize({ level: true }),
                winston.format.timestamp({ format: 'hh:MM:ss' }),
                winston.format.printf(
                    info => `[${info.timestamp}] [${info.level} | Website] <=> ${info.message}`
                )
            )
        });
        // ONLY USE RETHINKDB FOR USER CACHE
        // Use MongoDB for getting guilds and such
        this.r = require('rethinkdbdash')({
            db: 'Maika',
            host: process.env.RETHINKDB_HOST,
            port: 28015
        });

        this.processRouters()
            .processWebsite();
    }

    /**
     * Processes all routers
     * @returns {MaikaWebsite} Chainable instance
     */
    processRouters() {
        readdir('../website/routers', (error, files) => {
            if (error)
                this.logger.error(`Unable to build routers:\n${error.stack}`);

            files.forEach((f) => {
                const Router = require(`../routers/${f}`);
                const router = new Router(this.client);

                this.app.use(router.route, router.router);
                this.logger.info(`Added route "${router.route}" to the express middleware~`);
            });
        });

        return this;
    }

    /**
     * Processes all website middleware, components, etc
     * @returns {MaikaWebsite} chaINaBLE iNSTancE
     */
    processWebsite() {
        this
            .app
            .use(express.static(path.join(__dirname, '..', 'public')))
            .set('view engine', 'ejs')
            .set('views', path.join(__dirname, '..', 'views'));

        return this;
    }

    /**
     * Bootstrap (start) the webserver
     * @returns {void} a nOOP instance
     */
    bootstrap() {
        this.app.listen(process.env.MAFUYU_PORT || 5582, () => this.logger.info(`Connected to the webserver using port ${process.env.MAFUYU_PORT || 5582}`));
    }
};