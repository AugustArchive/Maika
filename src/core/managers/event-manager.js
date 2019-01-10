'use strict';

const { readdir } = require('fs');
const EventProcessor = require('../processors/event-processor');

module.exports = class EventManager {
    /**
     * Create a new instance of the Event manager to handle emitted events
     * @param {import('../internal/client')} client The client
     */
    constructor(client) {
        this.client = client;
        this.processor = new EventProcessor(client);
    }

    /**
     * Start loading the events
     */
    start() {
        readdir('./events', (error, files) => {
            if (error)
                this.client.logger.error(`Unable to load events:\n${error.stack}`);

            this.client.logger.info(`Now loading ${files.length} events~...`);
            files.forEach(f => {
                const Event = require(`../../events/${f}`);
                const event = new Event(this.client);
                this.client.logger.info(`Loaded the ${event.event} event!`);
                this.processor.process(event);
            });
        });
    }
}