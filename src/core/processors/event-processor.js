module.exports = class EventProcessor {
    /**
     * Create a new Event processor instance to process all emitted events
     * @param {import('../internal/client')} client THe client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Process the events from the Event manager
     * @param {import('../internal/event')} event The event to process
     */
    process(event) {
        const func = async(...args) => {
            try {
                await event.emit(...args);
            } catch(ex) {
                this.client.logger.error(`Event ${event.event} errored:\n${ex.stack}`);
            }
        };

        this.client.on(event.event, func);
    }
}