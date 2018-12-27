const { readdir } = require('fs');
const { Collection } = require('eris');

module.exports = class SchedulerRegistry {
    /** @param {import('../client')} bot The bot client */
    constructor(bot) {
        this.bot = bot;
        /** @type {Collection<import('../scheduler')>} */
        this.tasks = new Collection();
    }

    setup() {
        readdir('./schedulers', (error, files) => {
            if (error)
                this.bot.logger.error(error.stack);
            files.forEach(async d => {
                const scheduler = require(`../../schedulers/${d}`);
                if (!scheduler.info.enabled)
                    return;
                
                await this.handle(scheduler);
            });
        });
    }

    /**
     * Handles the scheduler
     * 
     * @param {import('../scheduler')} scheduler The scheduler interface
     */
    async handle(scheduler) {
        await scheduler.info.run(this.bot);
        this.tasks.set(scheduler.info.name, scheduler);
        setInterval(scheduler.info.run(this.bot), scheduler.interval);
    }
};