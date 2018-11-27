const express     = require('express');
const path        = require('path');
const winston     = require('winston');
const { readdir } = require('fs');

module.exports = class MaikaWebsite {
    /**
     * Construct the MaikaWebsite
     * 
     * @param {import('../../src/structures/client')} bot The bot client
     */
    constructor(bot) {
        this.bot        = bot;
        this.app        = express();
        this.app.disable('x-powered-by');
        this.logger     = winston.createLogger({
            transports: [new winston.transports.Console()],
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.timestamp({ format: 'HH:mm:ss' }),
                winston.format.printf(
                    info => `[${info.timestamp}] [${info.level}] >> ${info.message}`
                )
            )
        });
        this.port       = Number(process.env.FRONTEND_PORT);
    }

    /**
     * Sets the application root stuff
     * 
     * @returns {MaikaWebsite}
     */
    setApplicationRoot() {
        this
            .app
            .use(express.static(path.join(__dirname, '..', 'static')))
            .use((req, _, next) => {
                this.logger.info(`${req.method} | ${req.url}`);
                next();
            })
            .set('view engine', 'ejs')
            .set('views', path.join(__dirname, '..', 'views'));

        return this;
    }

    /**
     * Setups the routers
     * 
     * @returns {MaikaWebsite}
     */
    setRouters() {
        readdir('./routers', (error, files) => {
            if (error)
                this.logger.error(error.stack);
            files.forEach(f => {
                const Router = require(`../routers/${f}`);
                const router = new Router(this.bot);

                this.app.use(router.route, router.router);
                this.logger.info(`Loaded route "${router.route}"`);
            });
        });
    }

    /**
     * Starts the website
     */
    start() { this.app.listen(this.port, () => this.logger.info(`Listening on port ${this.port}`)); }
};