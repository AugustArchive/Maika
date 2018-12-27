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

const fetch               = require('node-fetch');
const { entities, valid } = require('../../deps');

module.exports = class RedditFeed {
    /**
     * The reddit feed
     * 
     * @param {import('../client')} bot The bot client
     */
    constructor(bot) {
        this.bot = bot;
        this.intervals = {};
        this.dates = {};
        this.options = {
            method: 'GET',
            headers: {
                'User-Agent': this.bot.constants.USER_AGENT,
                'content-type': 'application/json'
            }
        };
    }

    /**
     * Validates the reddit URL
     * 
     * @param {string} sub The subreddit
     * @returns {boolean}
     */
    async validateSubreddit(sub) {
        const req = await fetch(`${sub}/about.json`, this.options);
        const res = await req.json();

        if (res.error === 404 || res.data.over18)
            return false;
        else
            return true;
    }

    /**
     * Start the feed
     * 
     * @param {string} url The url
     * @param {string} channelID The channel ID
     */
    async start(url, channelID) {
        const reddit = await this.validateSubreddit(url);
        if (reddit) {
            this.intervals[channelID] = setInterval(async() => {
                const req = await fetch(`${url}/new.json?limit=1`, this.options);
                const res = await req.json();
                for (let i = 0; i < res.data.children.reverse().length; i++) {
                    const post = res.data.children.reverse()[i].data;
                    if (!this.dates[channelID] || post.created_utc > this.dates[channelID].last) {
                        this.dates[channelID] = { last: post.created_utc };
                        if (post.over_18)
                            return;
                        this.bot.createMessage(channelID, { embed: {
                            url: `https://redd.it/${post.id}`,
                            title: `${post.link_fair_text ? `[${post.link_flair_text}] ` : ""}${entities.decodeHTML(post.title)}`,
                            color: this.bot.constants.FeedColors.REDDIT,
                            image: { url: valid.isUri(post.url) ? entities.decodeHTML(post.url) : null },
                            description: `${post.is_self ? decodeHTML(post.selftext.length > 253 ? post.selftext.slice(0, 253).concat('...') : post.selftext) : ''}`,
                            footer: {
                                text:`${post.is_self ? 'self post' : 'link post'} by ${post.author} | ${this.bot.user.username}'s Reddit Feed`
                            },
                            timestamp: new Date(post.created_utc * 1000)
                        }});
                    }
                    this.dates[channelID] ? ++this.dates[channelID].last : null;
                }
            }, Number(process.env.RATELIMIT));
        }
    }
};