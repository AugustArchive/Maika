const mongoose = require('mongoose');

module.exports = class DatabaseManager {
    /**
     * Create a new Database manager
     * @param {import('../internal/client')} client The client
     */
    constructor(client) {
        this.client = client;
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
    }

    /**
     * Destroys the database (i.e: disconnecting)
     */
    async destroy() {
        await mongoose.connection.close(() => {
            this.client.logger.warn('Database was destroyed for an odd reason... :(');
        });
    }
}