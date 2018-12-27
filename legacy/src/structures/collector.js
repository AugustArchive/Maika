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

module.exports = class MessageCollector {
    /**
     * The message collector
     * 
     * @param {import('./client')} bot The bot client
     */
    constructor(bot) {
        this.collectors = {};
        bot.on('messageCreate', this.verify.bind(this));
    }

    /**
     * Verify if the message is the awaited message
     * 
     * @param {import('eris').Message} msg The message class
     */
    verify(msg) {
        if (!msg.author)
            return;

        const collector = this.collectors[msg.channel.id + msg.author.id];
        if (collector && collector.filter(msg))
            collector.accept(msg);
    }

    /**
     * Await an message
     * 
     * @param {(msg: import('eris').Message) => boolean} filter The filter function
     * @param {{ channelID: string; userID: string; timeout?: number; }} options The other options
     * @returns {Promise<import('eris').Message>}
     */
    async awaitMessages(filter, options) {
        const { channelID, userID, timeout } = options;
        return new Promise(accept => {
            if (this.collectors[channelID + userID])
                delete this.collectors[channelID + userID];

            this.collectors[channelID + userID] = { filter, accept };

            setTimeout(accept.bind(null, false), timeout);
        });
    }
};