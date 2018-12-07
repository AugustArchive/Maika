const Processor = require('../processor');

module.exports = class CommandProcessor extends Processor {
    /**
     * The command processor is the processor to process commands
     * 
     * Methods:
     *  - `CommandProcessor.process(msg: Eris.Message) => void`: The process function is where the magic happens. It's an overidden function from the `BaseProcessor` class.
     * 
     * @param {import('../client')} bot The bot client
     */
    constructor(bot) {
        super(bot);
    }

    /**
     * Process all of the command related messages
     * 
     * @param {import('eris').Message} msg The message from the event emitted
     * @returns {void} A void function of the command running
     */
    async process(msg) {}
}