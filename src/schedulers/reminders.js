const { Scheduler } = require('@maika.xyz/kotori');
const Schema        = require('../models/reminder');

module.exports = class ReminderScheduler extends Scheduler {
    constructor(client) {
        super(client, {
            name: 'reminders',
            interval: 60000,
            disabled: true
        });
    }

    async run() {
        Schema
            .find({ due: Date.now() }, (error, results) => {
                console.log(results);
            });
    }
};