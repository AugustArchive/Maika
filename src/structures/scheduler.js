module.exports = class MaikaScheduler {
    /** @param {SchedulerInfo} info The scheduler information */
    constructor(info) {
        this.info = info;
    }
}

/**
 * @typedef {Object} SchedulerInfo
 * @prop {string} name The scheduler name
 * @prop {number} interval The number of milliseconds to run it
 * @prop {boolean} enabled Whenther or not the scheduler should be enabled
 * @prop {(bot: IBot) => void} run The run function
 */

/** @typedef {import('./client')} IBot */