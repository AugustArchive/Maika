const { Client } = require('eris');
const PluginManager = require('../managers/plugin-manager');
const EventManager = require('../managers/event-manager');
const SchedulerManager = require('../managers/scheduler-manager');
const DatabaseManager = require('../managers/database-manager');
const AudioManager = require('../managers/audio-manager');
const Hideri = require('@maika.xyz/hideri');
const { Cluster } = require('lavalink');
const RESTClient = require('./rest');
const GuildSettings = require('../settings/guild-settings');
const RedditFeed = require('./feeds/reddit');
const RedisClient = require('./redis');

module.exports = class MaikaClient extends Client {
    constructor() {
        super(process.env.MAIKA_TOKEN, {
            maxShards: 'auto',
            disableEveryone: true,
            autoreconnect: true
        });

        this.manager = new PluginManager(this);
        this.events = new EventManager(this);
        this.schedulers = new SchedulerManager(this);
        this.database = new DatabaseManager(this);
        this.logger = Hideri.create();
        this.rest = new RESTClient(this);
        this.color = 15105758;
        this.emojis = require('../../util/objects/emojis');
        this.owners = ['280158289667555328', '229552088525438977'];
        this.settings = new GuildSettings(this);
        this.audio = new AudioManager(this);
        this.redis = new RedisClient(this, {
            uri: process.env.REDIS_URI,
            password: process.env.REDIS_PASSWORD
        });

        this.once('ready', () => {
            this.schedulers.tasks.forEach((s) => s.run(this));
            this.lavalink = new Cluster({
                nodes: [{
                    hosts: {
                        ws: `ws://${process.env.LAVALINK_HOST}:2333`,
                        rest: `http://${process.env.LAVALINK_HOST}:2333`
                    },
                    password: process.env.LAVALINK_PASSWORD,
                    shardCount: 1,
                    userID: this.user.id
                }],
                send: (guildID, packet) => {
                    const shardID = this.guildShardMap[guildID];
                    const shard = this.shards.get(shardID);
                    
                    if (!shard)
                        return;
    
                    return shard.ws.send(JSON.stringify(packet));
                }
            });
        });
    }

    async bootstrap() {
        this.manager.start();
        this.events.start();
        this.schedulers.start();
        this.database.connect();
        this.redis.connect();
        await super.connect()
            .then(() => this.logger.info("Maika is now connecting to Discord."));
    }

    /**
     * Redact private information
     * @param {string} str The result from the eval or exec commands
     * @returns {string} The tokens truncated as `--snip--`
     */
    redact(str) {
        const regex = new RegExp([
            process.env.MAIKA_TOKEN,
            process.env.WOLKE,
            process.env.PPY,
            this.token,
            process.env.LAVALINK_PASSWORD,
            process.env.LAVALINK_HOST,
            process.env.DB_URI,
            process.env.REDIS_URI,
            process.env.REDIS_PASSWORD
        ].join('|'), 'gi');
        return str.replace(regex, '--snip--');
    }

    /**
     * Delays an action for `x` many milliseconds
     * @param {number} ms Thew number to sleep
     * @returns {Promise<any>} An empty promise that it actually slept / delayed
     */
    sleep(ms) {
        return new Promise((res) => setTimeout(res(), ms));
    }

    /**
     * Destroy the Maika instance
     * @returns {Promise<void>} An empty promise
     */
    async destroy() {
        await this.disconnect({ reconnect: false });
        await this.database.destroy();
    }

    /**
     * Reboots Maika (for emergency purposes)
     * @returns {void} nOOP
     */
    async reboot() {
        this.client.logger.warn('Maika is being rebooted!');
        await this.destroy();
        await this.sleep(60 * 1000);
        this.bootstrap();
    }

    /**
     * Gets the footer
     * @returns {string} The footer text
     */
    getFooter() {
        return `Running v${require('../../../package').version} | Made by auguwu & other contributors`;
    }

    /**
     * Starts all reddit feeds
     * @returns {void}
     */
    async startRedditFeeds() {
        this
            .guilds
            .forEach(async(_) => {
                const stream = await this.settings.schema.find({ 'reddit.enabled': true }).cursor();
                stream.on('data', (gu) => {
                    const reddit = new RedditFeed(this, { subreddit: `https://reddit.com/r/${gu['reddit'].subreddit}` });
                    reddit.bootstrap({
                        channel: gu['reddit'].channelID,
                        ratelimit: 5 * 1000
                    });
                });
            });
    }

    /**
     * Determines the status of a user
     * @param {string} status The status
     * @returns {string} The status into a stirng
     */
    determineStatus(status) {
        return status === 'online'? '<:online:457289010037915660> **Online**': status === 'idle'? '<:away:457289009912217612> **Away**': status === 'dnd'? '<:dnd:457289032330772502> **Do not Disturb**': '<:offline:457289010084184066> **Offline**';
    }
};