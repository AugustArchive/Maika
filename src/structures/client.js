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

const { Client }        = require('eris');
const RedditFeed        = require('./feed/reddit');
const PluginRegistry    = require('./registry/plugins');
const EventRegistry     = require('./registry/events');
const FinderUtil        = require('../util/finder');
const winston           = require('winston');

module.exports = class AugustBoatClient extends Client {
    /**
     * Start. Here.
     */
    constructor() {
        super(process.env.TOKEN, {
            maxShards: 'auto',
            disableEveryone: true,
            autoreconnect: true
        });

        this.logger     = winston.createLogger({
            transports: [new winston.transports.Console()],
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.timestamp({ format: 'HH:mm:ss' }),
                winston.format.printf(
                    (info) => `[${info.timestamp}] <${info.level}>: ${info.message}`
                )
            )
        });
        this.registry   = new PluginRegistry(this);
        this.r          = require('rethinkdbdash')({ db: process.env.DB_NAME, host: process.env.DB_HOST, port: Number(process.env.DB_PORT) });
        this.events     = new EventRegistry(this);
        this.constants  = require('../util/constants');
        this.finder     = new FinderUtil(this);
        this.color      = 0xFF938D;
        this.feeds      = {
            reddit: new RedditFeed(this)
        };
        this.maintenance = false;
    }

    /**
     * Setup the bot
     * 
     * @param {SetupCallback} fn The callback
     */
    async setup(fn) {
        const message = fn();

        this.registry.setup();
        this.events.setup();
        super.connect()
            .then(() => this.logger.info(message));
    }

    /**
     * Starts all of the feeds
     * 
     * @returns {void}
     */
    startFeeds() {
        const guilds = this.r.table('guilds').run();
        for (let i = 0; i < guilds.length; i++) {
            if (guilds[i].feeds.reddit && guilds[i].feeds.reddit.enabled)
                this.feeds.reddit.start(`https://reddit.com/r/${guilds[i].feeds.reddit.subreddit}`, guilds[i].feeds.reddit.channelID);
        }
    }

    /**
     * Sets the `maintenance` mode
     * 
     * @param {boolean} maintenance The boolean
     * @returns {void}
     */
    setMaintenance(maintenance) {
        if (maintenance === false)
            this.maintenance = false;
        else {
            this.maintenance = true;
            this.setGameForMaintenance();
        }
    }

    /**
     * Edits the status when `maintenance` is true
     */
    setGameForMaintenance() {
        this.editStatus('dnd', {
            name: 'Maintenance mode enabled',
            type: 0
        });
    }
};

/** @typedef {() => string} SetupCallback */