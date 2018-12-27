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

const { readdir } = require('fs');

module.exports = class EventRegistry {
    /**
     * The event registry
     * 
     * @param {import('../client')} bot The bot client
     */
    constructor(bot) {
        this.bot = bot;
    }

    /**
     * Handles all of the events
     * 
     * @param {import('../event')} event The event class
     */
    handle(event) {
        const fun = async(...args) => {
            try {
                await event.run(...args);
            } catch(ex) {
                this.bot.logger.error(ex.stack);
            }
        };

        if (event.emitter === 'on')
            this.bot.on(event.event, fun);
        else if (event.emitter === 'once')
            this.bot.once(event.event, fun);
    }

    /**
     * Setups all of the events
     */
    setup() {
        readdir('./events', (error, files) => {
            if (error)
                this.bot.logger.error(error.stack);

            files.forEach(f => {
                const Event = require(`../../events/${f}`);
                const e = new Event(this.bot);

                this.handle(e);
            });
        });
    }
};