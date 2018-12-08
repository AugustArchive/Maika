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
    process(event) {
        const fn = async(...args) => {
            try {
                await event.run(this.bot, ...args);
            } catch(ex) {
                this.bot.logger.error(`Event ${event.event} has errored:\n${ex.stack}`);
            }
        };

        if (event.emitter === 'on')
            this.bot.on(event.event, fn);
        else if (event.emitter === 'once')
            this.bot.once(event.event, fn);
        else
            throw new RangeError("Invalid emitter.");
    }
};