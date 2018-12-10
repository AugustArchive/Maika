const Sequelize   = require('sequelize');
const { readdir } = require('fs');

const db = new Sequelize(process.env.DB_URL, {
    logging: false,
    operatorsAliases: Sequelize.Op
});

module.exports = class PostgreSQL {
    /**
     * Construct the Database class
     * 
     * @param {import('./client')} bot The bot client
     */
    constructor(bot) {
        this.bot = bot;
    }

    async start() {
        try {
            await db.authenticate();
            this.bot.logger.info('Connection to PostgreSQL has been established successfully!');
            await this.registerSchemas();
        } catch(ex) {
            this.bot.logger.info('Unable to connect to PostgreSQL:\n' + ex.stack + "\nReconnecting in 5 seconds...");
            setTimeout(this.start, 5000);
        }
    }

    /**
     * Registers all of the schemas
     * 
     * @returns {void}
     */
    registerSchemas() {
        readdir('./models', (error, files) => {
            if (error)
                this.bot.logger.error(error.stack);
            files.forEach(async(d) => {
                const Schema = require(`../models/${d}`);
                Schema.sync({ alter: true });
            });
        });
    }

    static get database() {
        return db;
    }
};