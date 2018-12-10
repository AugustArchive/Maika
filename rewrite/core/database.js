const Sequelize   = require('sequelize');
const { readdir } = require('fs');

const db = new Sequelize(process.env.DB_URL, { logging: true, operatorsAliases: Sequelize.Op });

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
            this.bot.logger.info('Unable to connect to PostgreSQL: ' + ex.stack + "\nReconnecting in 5 seconds...");
            setTimeout(this.start, 5000);
        }
    }

    /**
     * Registers all of the schemas
     * 
     * @returns {void}
     */
    registerSchemas() {
        readdir('./schema', (error, files) => {
            if (error)
                this.bot.logger.error(error.stack);
            files.forEach(async f => await require('../schema/' + f).sync({ alter: true }));
        });
    }

    static get database() {
        return db;
    }
};