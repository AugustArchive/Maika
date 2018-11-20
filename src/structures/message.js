/*
 * Copyright (c) 2018-present auguwu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const MessageCollector = require('./collector');

module.exports = class CommandMessage {
    /**
     * The command message
     * 
     * @param {import('./client')} bot The bot client
     * @param {{ msg: import('eris').Message; args: string[]; prefix: string; }} options The other options
     */
    constructor(bot, options) {
        this.bot = bot;
        this.msg = options.msg;
        this.args = options.args;
        this.prefix = options.prefix;
    }

    /** @returns {import('eris').Guild} */
    get guild() {
        return this.msg.channel.guild;
    }

    /** @returns {MessageCollector} */
    get collector() {
        return new MessageCollector(this.bot);
    }

    /** @returns {import('eris').User} */
    get sender() {
        return this.msg.author;
    }

    /**
     * Send a message to a text channel
     * 
     * @param {string} content The content
     * @returns {Promise<import('eris').Message>}
     */
    send(content) {
        return this.msg.channel.createMessage(content);
    }

    /**
     * Send a codeblock to a text channel
     * 
     * @param {string} lang The language
     * @param {string} content The content
     * @returns {Promise<import('eris').Message>}
     */
    async code(lang, content) {
        return this.send(`\`\`\`${lang || ''}\n${content}\`\`\``);
    }

    /**
     * Send a DM to the current sender
     * 
     * @param {string} content The content
     * @returns {Promise<import('eris').Message>}
     */
    async dm(content) {
        const channel = await this.sender.getDMChannel();
        return channel.createMessage(content);
    }

    /**
     * Send an embed to a text channel
     * 
     * @param {import('eris').EmbedOptions} content The embed
     * @returns {Promise<import('eris').Message>}
     */
    async embed(content) {
        return this.msg.channel.createMessage({ embed: content });
    }
};