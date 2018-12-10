const { readdir }        = require('fs');
const { Collection }     = require('eris');
const SchedulerProcessor = require('../processors/schedulers');

module.exports = class SchedulerRegistry {
    /**
     * Construct the Scheduler registry 
     * 
     * @param {import('../client')} bot The bot client
     */
    constructor(bot) {
        this.bot = bot;
        this.processor = new SchedulerProcessor(bot);
        /** @type {Collection<import('../scheduler')>} */
        this.tasks = new Collection();
    }

    async start() {
        readdir('./schedulers', (error, files) => {
            if (error)
                this.bot.logger.error(`Unable to load schedulers:\n${error.stack}`);

            this.bot.logger.info(`Loading ${files.length} schedulers!`);
            files.forEach(f => {
                const scheduler = require(`../../schedulers/${f}`);
                if (!scheduler.enabled)
                    return;
                this.tasks.set(scheduler.name, scheduler);
                this.processor.process(scheduler);
            });
        });
    }
};