const Sequelize   = require('sequelize');
const { readdir } = require('fs');
const path        = require('path');
const { DB_URL }  = process.env;

module.exports = class Database {
    /**
     * Database OwO
     * 
     * @param {import('./client')} bot The bot client
     */
    constructor(bot) {
        this.bot = bot;
        this.db  = new Sequelize(DB_URL, { logging: false, operatorsAliases: Sequelize.Op });
    }

    async setup() {
        try {
            await this.db.authenticate();
            this.bot.logger.info("Connected to the database was successful, loading models...");

            readdir(path.join(__dirname, '..', 'models'), (error, files) => {
                if (error)
                    this.bot.logger.error(error.stack);
                files.forEach(f => {
                    const Model = require(`../models/${f}`);
                    await Model(this.db).sync({ alter: true });
                });
            });
        } catch(ex) {
            this.bot.logger.error("Unable to connect! Attempting in 5 seconds...");
            setTimeout(this.setup, 5000);
        }
    }
};