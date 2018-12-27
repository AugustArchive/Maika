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
    async start() {
        readdir('./events', (error, files) => {
            if (error)
                this.bot.logger.error(`Unable to load events:\n${error.stack}`);

            this.bot.logger.info(`Now loading ${files.length} events!`);
            files.forEach(f => {
                const event = require(`../../events/${f}`);
                this.processor.process(event);
            });
        });
    }
};