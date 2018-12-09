const Processor      = require('../processor');
const { Collection } = require('eris');

module.exports = class RatelimitProcessor extends Processor {
    /**
     * Construct the Ratelimit processor
     * 
     * @param {import('./client')} bot The bot client
     */
    constructor(bot) {
        super(bot);

        /** @type {Collection<Collection<number>>} */
        this.ratelimits = new Collection();
    }

    /**
     * Process the ratelimit processor
     * 
     * @param {import('../message')} msg The command message
     */
    async process(msg) {
        const now = Date.now();
        const timestamps = this.ratelimits.get(msg.command.command);
        const amount = (msg.command.ratelimit) * 1000;

        if (!timestamps.has(msg.sender.id)) {
            timestamps.set(msg.sender.id, now);
            setTimeout(() => timestamps.delete(msg.sender.id), amount);
        } else {
            const time = timestamps.get(msg.sender.id) + amount;
            if (now < time)
                return msg.reply(`You must wait \`${((time - now) / 1000).toFixed(1)}\` more second${((time - now) / 1000) > 1 ? "s" : ''} before executing the command \`${msg.command.command}\`.`);

            timestamps.set(msg.sender.id, now);
            setTimeout(() => timestamps.delete(msg.sender.id), amount);
        }
    }
};