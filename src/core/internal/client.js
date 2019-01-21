const { Client } = require('eris');
const PluginManager = require('../managers/plugin-manager');
const EventManager = require('../managers/event-manager');
const SchedulerManager = require('../managers/scheduler-manager');
const DatabaseManager = require('../managers/database-manager');
const Hideri = require('@maika.xyz/hideri');
const { Collection } = require('@maika.xyz/eris-utils');
const { Cluster } = require('lavalink');
const RESTClient = require('./rest');
const Webserver = require('../../../website/server');
const GuildSettings = require('../settings/guild-settings');

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
        this.logger = new Hideri.Logger();
        this.rest = new RESTClient(this);
        /** @type {Collection<string, import('./audio/audio-player')>} */
        this.players = new Collection();
        this.website = Webserver(this);
        this.color = 0xE67EDE;
        this.emojis = require('../../util/objects/emojis');
        this.owners = ['280158289667555328', '229552088525438977'];
        this.settings = new GuildSettings(this);

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
            process.env.RETHINKDB_HOST
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
     * Gets the normal embed
     * @returns {import('@maika.xyz/eris-utils').MessageEmbed} The message embed
     */
    getFooter() {
        return `Running v${require('../../../package').version} | Made by auguwu & other contributors`;
    }
};