const MessageCollector = require('./collector');

module.exports = class CommandMessage {
    /**
     * Construct the CommandMessage class
     * 
     * @param {import('./client')} bot The bot client
     * @param {import('eris').Message} message The event message
     * @param {string[]} args The command arguments
     */
    constructor(bot, message, args) {
        Object.assign(this, message);

        this.bot = bot;
        this.message = message;
        this.args = args;
        /** @type {import('eris').Guild} */
        this.guild  = this.message.channel.guild;
        this.sender = this.message.author;
        this.member = this.guild.members.get(this.sender.id) || null;
        this.me = this.guild.members.get(bot.user.id) || null;
        this.collector = new MessageCollector(bot);
        this.prefix = bot.settings.get(this.guild, 'prefix', process.env.MAIKA_PREFIX);
    }

    /**
     * Reply with a message
     * 
     * @param {string} content The content to send
     * @returns {PromisedMessage}
     */
    reply(content) { return this.message.channel.createMessage(content); }

    /**
     * Reply with a embed
     * 
     * @param {RawMessage} content The content
     * @returns {PromisedMessage}
     */
    embed(content) { return this.message.channel.createMessage({ embed: content }); }

    /**
     * Sends a "raw" discord message with a embed attached with it
     * 
     * @param {string} content The content to send
     * @param {RawMessage} embed The embed to send
     * @returns {PromisedMessage}
     */
    rawReply(content, embed) { return this.message.channel.createMessage({ content, embed }); }
};

/**
 * @typedef {import('eris').EmbedOptions} RawMessage
 */

/**
 * @typedef {Promise<import('eris').Message>} PromisedMessage
 */