'use strict';

const MessageCollector = require('./collector');

module.exports = class CommandContext {
    /**
     * Create a new command context instance
     * @param {import('./client')} client The client
     * @param {import('eris').Message} msg The message
     * @param {string[]} args The args that was from the message create event
     */
    constructor(client, msg, args) {
        Object.assign(this, msg);
        this.client = client;
        this.message = msg;
        this.args = args;
    }

    /**
     * The message collector instance
     * @returns {MessageCollector}
     */
    get collector() {
        return new MessageCollector(this.client);
    }

    /**
     * The sender of the message
     * @returns {import('eris').User}
     */
    get sender() {
        return this.message.author;
    }

    /**
     * The guild member
     * @returns {import('eris').Member}
     */
    get member() {
        return this.guild.members.get(this.sender.id);
    }

    /**
     * The guild
     * @returns {import('eris').Guild}
     */
    get guild() {
        return this.channel.guild;
    }

    /**
     * Send a message to the current channel
     * @param {string} content The content to send
     * @returns {PromisedMessage}
     */
    send(content) {
        return this.message.channel.createMessage(content);
    }

    /**
     * Send an embed w/o content
     * @param {import('@maika.xyz/eris-utils').MessageEmbed} content The embed
     * @returns {PromisedMessage}
     */
    embed(content) {
        return this.message.channel.createMessage({ embed: content.build() });
    }

    /**
     * Send an embed with content
     * @param {string} content The content to send
     * @param {import('@maika.xyz/eris-utils').MessageEmbed} embed The embed to send
     * @returns {PromisedMessage}
     */
    raw(content, embed) {
        return this.message.channel.createMessage({
            content, 
            embed: embed.build()
        });
    }

    /**
     * Send a message to a user
     * @param {string} content The content to send
     * @param {import('eris').User} [user=this.sender] The user
     * @returns {PromisedMessage}
     */
    async dm(content, user = this.sender) {
        const channel = await user.getDMChannel();
        channel.createMessage(content);
    }
}

/**
 * @typedef {Promise<import('eris').Message>} PromisedMessage
 */