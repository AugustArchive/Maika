module.exports = class MaikaScheduler {
    /**
     * Construct the Maika scheduler class
     * 
     * @param {SchedulerInfo} info The info
     */
    constructor(info) {
        this.name = info.name;
        this.interval = info.interval;
        this.enabled = info.enabled;
        this.run = info.run;
    }
};

/**
 * @typedef {object} SchedulerInfo
 * @prop {string} name The scheduler name
 * @prop {number} interval The number of seconds the scheduler should be running
 * @prop {boolean} enabled If the scheduler should be enabled
 * @prop {(bot: import('./client')) => void} run The run function
 */