const Processor = require('../processor');

module.exports = class EventProcessor extends Processor {
    /**
     * The event processor is where Maika processes the events that Maika uses
     * 
     * @param {import('../client')} bot The bot client
     */
    constructor(bot) {
        super(bot);
    }

    /**
     * Process the event
     * 
     * @param {import('../event')} event The event
     * @returns {void}
     */
    process(event) {}
};