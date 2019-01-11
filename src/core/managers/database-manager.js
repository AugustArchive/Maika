const mongoose = require('mongoose');
const { Collection } = require('@maika.xyz/eris-utils');
const { readdir } = require('fs');

module.exports = class DatabaseManager {
    /**
     * Create a new Database manager
     * @param {import('../internal/client')} client The client
     */
    constructor(client) {
        this.client = client;
        /** @type {Collection<string, mongoose.Schema>} */
        this.schemas = new Collection();
        this.m = mongoose;
    }

    /**
     * Connects to the database
     */
    async connect() {
        mongoose.Promise = global.Promise;
        await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
        mongoose
            .connection
            .on('connected', () => this.client.logger.info(`Successfully connected to the database with uri: ${process.env.DB_URI}`))
            .on('error', (error) => this.client.logger.error(`Unable to connect to the database with uri: ${process.env.DB_URI}\n${error.stack}`));
        this.loadSchemas();
    }

    /**
     * Loads the schemas
     * @returns {DatabaseManager} Instance to chain
     */
    loadSchemas() {
        readdir('./models', (error, files) => {
            if (error)
                this.client.logger.error(`Unable to load mongoose models:\n${error.stack}`);

            files.forEach((f) => {
                // Must return an object { name: 'name', schema: new mongoose.Schema() }
                const model = require(`../../models/${f}`);
                this.schemas.set(model.name, model.schema);
                mongoose.model(model.name, model.schema, model.name);
                this.client.logger.info(`Loaded the ${model.name} schema!`);
            });
        });
    }

    /**
     * Destroys the database (i.e: disconnecting)
     */
    async destroy() {
        await mongoose.connection.close(() => {
            this.client.logger.warn('Database was destroyed (maybe someone did MaikaClient#destroy function?)');
        });
    }
}