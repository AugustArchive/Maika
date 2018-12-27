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

const { Client }                         = require('eris');
const RedditFeed                         = require('./feed/reddit');
const PluginRegistry                     = require('./registry/plugins');
const EventRegistry                      = require('./registry/events');
const SchedulerRegistry                  = require('./registry/schedulers');
const FinderUtil                         = require('../util/finder');
const winston                            = require('winston');
const MaikaWebsite                       = require('../../website/interfaces/website');

module.exports = class MaikaClient extends Client {
    /**
     * Start. Here.
     */
    constructor() {
        super(process.env.TOKEN, {
            maxShards: 'auto',
            disableEveryone: true,
            autoreconnect: true
        });

        this.logger = winston.createLogger({
            transports: [new winston.transports.Console()],
            format: winston.format.combine(
                winston.format.colorize({ level: true }),
                winston.format.timestamp({ format: 'HH:mm:ss' }),
                winston.format.printf(
                    (info) => `[Maika] [${info.level}] >> ${info.message}`
                )
            )
        });
        this.registry = new PluginRegistry(this);
        this.r = require('rethinkdbdash')({ db: process.env.DB_NAME, host: process.env.DB_HOST, port: 28015 });
        this.events = new EventRegistry(this);
        this.constants = require('../util/constants');
        this.finder = new FinderUtil(this);
        this.color = 0xCB4A6F;
        this.feeds = {
            reddit: new RedditFeed(this)
        };
        this.maintenance = 'no';
        this.schedulers = new SchedulerRegistry(this);
        this.owners = ['280158289667555328'];
        this.website = new MaikaWebsite(this);
        this.http = require('../util/http');
        this.announcement = 'Disabled the `search` and `marriage` plugins until a fix is solved.';
    }

    /**
     * Setup the bot
     * 
     * @param {SetupCallback} fn The callback
     */
    async setup(fn) {
        this.registry.setup();
        this.events.setup();
        this.schedulers.setup();
        super.connect()
            .then(() => this.logger.info(fn()));
    }

    /**
     * Starts all of the feeds
     * 
     * @returns {void}
     */
    startFeeds() {
        const guilds = this.r.table('guilds').run();
        for (let i = 0; i < guilds.length; i++)
            if (guilds[i].reddit_feed.enabled)
                this.feeds.reddit.start(`https://reddit.com/r/${guilds[i].reddit_feed.subreddit}`, guilds[i].reddit_feed.channelID);
    }

    /**
     * Sets the `maintenance` mode
     * 
     * @param {"yes" | "no"} maintenance The maintenace mode
     * @returns {void}
     */
    setMaintenance(maintenance) {
        if (maintenance === "no")
            this.maintenance = "no";
        else {
            this.maintenance = "yes";
            this.editStatus('dnd', {
                name: 'Cleaning Cafe Stile',
                type: 0
            });
        }
    }
};

/** @typedef {() => string} SetupCallback */