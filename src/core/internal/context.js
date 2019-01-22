const MessageCollector = require('./collector');
const GuildSchema = require('../../models/guild');
const UserSchema = require('../../models/user');

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
        this.send(options.content);
        const message = await this.collector.awaitMessage(options.filter, options.options);
        return message;
    }

    /**
     * Gets the user settings
     * @param {string} userID The user ID
     */
    async getUserSettings(userID) {
        const user = UserSchema.findOne({ userID });
        const q = await user.lean().exec();

        if (!q) {
            const query = new UserSchema({ userID });
            query.save();
            this.client.logger.verbose(`Added user ${userID} to the database!`);
        }

        return q;
    }

    /**
     * Updates the guild settings
     * @param {MaikaDocumentOptions} options The options to update
     */
    updateGuildSettings(options) {
        GuildSchema
            .update(options.condition, options.document, options.callback)
            .exec();
    }

    /**
     * Updates the user settings
     * @param {MaikaDocumentOptions} options The options to update
     */
    updateUserSettings(options) {
        UserSchema
            .update(options.condition, options.document, options.callback)
            .exec();
    }
}

/**
 * @typedef {Promise<import('eris').Message>} PromisedMessage
 */

/**
 * @typedef {Object} IAwait
 * @prop {string} content The content to send
 * @prop {import('./collector').AwaitMessageInfo} info The options
 * @prop {(msg: import('eris').Message) => boolean} filter The filter
 */

/**
 * @typedef {Object} MaikaDocumentOptions
 * @prop {any} condition The condition
 * @prop {any} document The document to insert
 * @prop {(error: Error, data: any) => void} callback The callback
 */