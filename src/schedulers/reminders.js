const { Scheduler } = require('../core');

module.exports = new Scheduler({
    name: 'mutes',
    // Check every second for mutes
    interval: 1000,
    run: async(client) => {

    }
});