module.exports = class MaikaScheduler {
    /**
     * Create a new Maika scheduler instance
     * @param {MaikaSchedulerInfo} info The info
     */
    constructor(info) {
        this.name = info.name;
        this.interval = info.interval;
        this.run = info.run;
    }
}

/**
 * @typedef {Object} MaikaSchedulerInfo
 * @prop {string} name The scheduler name
 * @prop {number} interval The interval to execute
 * @prop {(client: import('./client')) => Promise<void>} run The run function
 */