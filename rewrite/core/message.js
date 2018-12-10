const MessageCollector = require('./collector');

module.exports = class CommandMessage {
    /**
     * Construct the CommandMessage class
     * 
     * @param {import('./client')} bot The bot client
     * @param {import('eris').Message} message The event message
     * @param {string[]} args The command arguments
     */
    constructor(bot, message, command, args) {
        Object.assign(this, message);

        this.bot = bot;
        this.message = message;
        this.args = args;
        /** @type {import('eris').Guild} */
        this.guild  = this.message.channel.guild;
        this.sender = this.message.author;
        this.member = this.message.member || this.guild.members.get(this.sender.id);
        this.collector = new MessageCollector(bot);
    }

    /**
     * Reply with a message
     * 
     * @param {string} content The content to send
     * @returns {Promise<import('eris').Message>}
     */
    reply(content) { return this.message.channel.createMessage(content); }

    /**
     * Reply with a embed
     * 
     * @param {import('eris').EmbedOptions} content The content
     * @returns {Promise<import('eris').Message>}
     */
    embed(content) {
        return this.message.channel.createMessage({ embed: content });
    }
};