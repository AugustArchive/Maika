'use strict';

const mongoose = require('mongoose');
const { Collection } = require('@maika.xyz/eris-utils');

module.exports = class DatabaseManager {
    /**
     * Create a new Database manager
     * @param {import('../internal/client')} client The client
     */
    constructor(client) {
        this.client = client;
        /** @type {Collection<string, mongoose.Schema>} */
        this.schemas = new Collection();
    }
}