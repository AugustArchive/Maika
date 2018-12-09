module.exports = class MaikaScheduler {
    /**
     * Construct the Maika scheduler class
     * 
     * @param {SchedulerInfo} info The info
     */
    constructor(info) {
        this.name = info.name;
        this.interval = info.interval;
        this.run = info.run;
    }
};

/**
 * @typedef {object} SchedulerInfo
 * @prop {string} name The scheduler name
 * @prop {number} interval The number of seconds the scheduler should be running
 * @prop {(bot: import('./client')) => void} run The run function
 */