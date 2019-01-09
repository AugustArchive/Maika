'use strict';

const { Client } = require('eris');
const PluginManager = require('../managers/plugin-manager');
const EventManager = require('../managers/event-manager');
const SchedulerManager = require('../managers/scheduler-manager');
const DatabaseManager = require('../managers/database-manager');
const winston = require('winston');
const { MessageEmbed } = require('@maika.xyz/eris-utils');
const i18nStore = require('../stores/i18n');

i18nStore.bootstrap();

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
        this.embed = new MessageEmbed()
            .setColor(0xE67EDE)
            .setAuthor(`${this.client.user.username}#${this.client.user.discriminator}`, null, this.user.avatarURL)
            .setFooter(`Running v${require('../../package').version} | Made by auguwu & other contributors`);
        this.logger = winston.createLogger({
            transports: [new winston.transports.Console()],
            format: winston.format.combine(
                winston.format.colorize({ level: true }),
                winston.format.timestamp({ format: 'hh:MM:ss'}),
                winston.format.printf(info => `[${info.timestamp}] [${info.level}] <=> ${info.message}`)
            )
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
            process.env.LAVALINK_PASSWORD
        ].join('|'), 'gi');
        return str.replace(regex, '--snip--');
    }
};