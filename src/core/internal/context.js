const { stripIndents } = require('common-tags');
const MessageCollector = require('./collector');
const UserSettings = require('../settings/user-settings');

module.exports = class CommandContext {
    /**
     * Create a new command context instance
     * @param {import('./client')} client The client
     * @param {import('eris').Message} msg The message
     * @param {string[]} args The args that was from the message create event
     */
    constructor(client, msg, args) {
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
        return this.message.channel.guild;
    }

    /**
     * The channel
     * @returns {import('eris').TextableChannel}
     */
    get channel() {
        return this.message.channel;
    }

    /**
     * Gets the user's settings
     * @returns {UserSettings}
     */
    get userSettings() {
        return new UserSettings(this.client);
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
     * @param {import('eris').EmbedOptions} content The embed
     * @returns {PromisedMessage}
     */
    embed(content) {
        return this.message.channel.createMessage({ embed: content });
    }

    /**
     * Send an embed with content
     * @param {string} content The content to send
     * @param {import('eris').EmbedOptions} embed The embed to send
     * @returns {PromisedMessage}
     */
    raw(content, embed) {
        return this.message.channel.createMessage({
            content, 
            embed
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
        return channel.createMessage(content);
    }

    /**
     * Sends a codeblock in the current channel
     * @param {string} lang The language
     * @param {string} content The content to send
     * @returns {PromisedMessage}
     */
    code(lang, content) {
        return this.send(`\`\`\`${lang || null}\n${content}\`\`\``);
    }

    /**
     * Send a message & await an message
     * @param {IAwait} options The awaiting message options
     * @returns {PromisedMessage}
     */
    async awaitReply(options) {
        this.send(stripIndents`
            :warning: **|** ${options.prompts.start}
            You have ${options.info.timeout} seconds to answer the following question.
            Reply with \`cancel\` to cancel this entry.
        `);
        const message = await this.collector.awaitMessage(options.filter, options.info);

        if (!message.content)
            return this.send(`${this.client.emojis.OK} **|** ${options.prompts.noContent}`);
        if (['cancel'].includes(message.content))
            return this.send(`${this.client.emojis.OK} **|** ${options.prompts.cancelled}`);

        return message;
    }
}

/**
 * @typedef {Promise<import('eris').Message>} PromisedMessage
 */

/**
 * @typedef {Object} IAwait
 * @prop {AwaitPrompts} prompts The prompts the say
 * @prop {import('./collector').AwaitMessageInfo} info The options
 * @prop {(msg: import('eris').Message) => boolean} filter The filter
 */

/**
 * @typedef {Object} AwaitPrompts
 * @prop {string} start The starter prompt
 * @prop {string} cancelled The cancelled prompt
 * @prop {string} noContent If the user didn't provide with content
 */