const { Collection } = require('@maika.xyz/eris-utils');
const { readdir } = require('fs');

module.exports = class SchedulerManager {
    /**
     * Create a new instance of the Scheduler manager to process all schedulers
     * @param {import('../internal/client')} client The client
     */
    constructor(client) {
        this.client = client;
        /** @type {Collection<string, import('../internal/scheduler')>} */
        this.tasks = new Collection();
    }

    /**
     * Start doing processors
     */
    start() {
        readdir('./schedulers', (error, files) => {
            if (error)
                this.client.logger.error(`Unable to load schedulers:\n${error.stack}`);

            this.client.logger.info(`Now loading ${files.length} schedulers~...`);
            files.forEach(f => {
                const scheduler = require(`../../schedulers/${f}`);
                this.tasks.set(scheduler.name, scheduler);
                this.client.logger.info(`Loaded scheduler: ${scheduler.name}!~`);
            });
        });
    }
}