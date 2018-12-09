const { readdir }    = require('fs');
const EventProcessor = require('../processors/events');

module.exports = class EventRegistry {
    /**
     * Construct a new EventRegistry class
     * 
     * Methods:
     *  - `EventRegistry.start(): void`: Start the event process
     * 
     * @param {import('../client')} bot The bot client
     */
    constructor(bot) {
        this.bot       = bot;
        this.processor = new EventProcessor(bot);
    }

    /**
     * Start the event process
     */
    async start() {}
};