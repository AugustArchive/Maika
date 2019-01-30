const { Scheduler } = require('../core');

module.exports = new Scheduler({
    name: 'mutes',
    // Check every minute for mutes
    interval: 60 * 1000,
    run: async(client) => {

    }
});