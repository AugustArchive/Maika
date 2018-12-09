module.exports = class MessageCollector {
    /**
     * Construct the MessageCollector singleton
     * 
     * @param {import('./client')} bot The bot client
     */
    constructor(bot) {
        this.collectors = {};
        bot.on('messageCreate', this.verify.bind(this));
    }

    /**
     * Verifies the message
     * 
     * @param {import('eris').Message} msg The message
     */
    async verify(msg) {
        if (!msg.author)
            return;

        const collector = this.collectors[msg.channel.id + msg.author.id];
        if (collector.filter(msg))
            collector.accept(msg);
    }

    /**
     * Await an message to get an output
     * 
     * @param {(msg: import('eris').Message) => boolean} fn The filter to execute in the verify function
     * @param {{ channel: import('eris').AnyGuildChannel; user: import('eris').User; timeout?: number; }} options The required options to execute it successfully
     * @returns {Promise<import('eris').Message>} The message awaited.
     */
    awaitMessage(fn, options) {
        const { channel, user, timeout } = options;
        return new Promise((accept) => {
            const collector = this.collectors[channel.id + user.id];
            if (collector)
                delete this.collectors[channel.id + user.id];

            this.collectors[channel.id + user.id] = { fn, accept };
            setTimeout(() => accept.bind(null, false), timeout);
        });
    }
};