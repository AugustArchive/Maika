const axios = require('axios');
const { validurl } = require('@maika.xyz/miu');
const { elipisis } = require('../../../util/string');

module.exports = class RedditFeed {
    /**
     * Construct the Reddit feed instance
     * @param {import('../client')} client THe client
     * @param {{ subreddit: string; }} options THe options to cover
     */
    constructor(client, options) {
        this.client = client;
        this.options = Object.assign({}, options);

        /**
         * The interval cache feed
         * @type {{ [x: string]: NodeJS.Timeout }} 
         */
        this.intervals = {};

        /**
         * Date cache
         * @type {{ [x: string]: { last: string; } }}
         */
        this.dates = {};

        this.fetch = {
            headers: {
                'User-Agent': "Maika/DiscordBot",
                'Content-Type': 'application/json'
            }
        };
    }

    /**
     * Validates the subreddit
     * @returns {boolean} If it exists or not (or it could be NSFW)
     */
    async validate() {
        const { data } = await axios.get(`${this.options.subreddit}/about.json`, this.fetch);
        if (resp.data.error === 404 || data.data.over18)
            return false;
        else
            return true;
    }

    /**
     * Starts ("bootstraps") the feed
     * @param {BootstrapInfo} info The information to do
     * @returns {void} Does the feed
     */
    async bootstrap(info) {
        const reddit = await this.validate();
        const { channelID, interval } = info;

        if (reddit)
            this.intervals[channelID] = setInterval(async() => {
                const { data } = await axios.get(`${this.url}/nsfw.json?limit=1`, this.fetch);

                for (let i = 0; i < data.data.children.reverse().length; i++) {
                    const post = data.data.reverse()[i].data;
                    if (!this.dates[channelID] || post.created_utc > this.dates[channelID].last) {
                        this.dates[channelID] = { last: post.created_utc };
                        if (post.over_18) {
                            this.client.logger.warn('Post is NSFW; not posting...');
                            return;
                        }
                        this.client.createMessage(channelID, {
                            content: `:pencil: **|** New reddit post!`,
                            embed: {
                                title: post.link_fair_text ? `[${post.link_flair_text}] `: '' + post.title,
                                color: 0xFF0000,
                                image: { url: validurl.isUri(post.url) ? post.url: null },
                                description: post.is_self ? elipisis(post.selftext, 253): post.selftext,
                                footer: {
                                    text: `${post.is_self? 'self post': 'link post'} by ${post.author}`
                                }
                            }
                        });
                        this.dates[channelID]? ++this.dates[channelID].last: null;
                    }
                }
            }, interval);
    }
};

/**
 * @typedef {Object} BootstrapInfo
 * @prop {string} channelID The channel ID
 * @prop {number} interval The interval number
 */