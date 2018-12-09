const BaseProcessor = require('../processor');

module.exports = class SchedulerProcessor extends BaseProcessor {
    /**
     * Construct the SchedulerProcessor class
     * 
     * @param {import('../client')} bot The bot client
     */
    constructor(bot) {
        super(bot);
    }

    /**
     * Process the schedulers
     * 
     * @param {import('../scheduler')} task The task
     * @returns {void}
     */
    async process(task) {
        setTimeout(() => task.run(this.bot), task.interval);
    }
}