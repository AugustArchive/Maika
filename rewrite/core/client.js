const { Client, Collection } = require('eris');
const CommandRegistry = require('./registry/commands');
const EventRegistry = require('./registry/events');
const SchedulerRegistry = require('./registry/schedulers');
const Database = require('./database');
const winston = require('winston');
const RESTClient = require('./rest');
const SettingsProvider = require('./providers/settings');
const { humanize } = require('@maika.xyz/miu');
const { formatMemory } = require('../util/string');

module.exports = class MaikaClient extends Client {
    constructor() {
        super(process.env.MAIKA_TOKEN, {
            maxShards: 'auto',
            disableEveryone: true,
            autoreconnect: true
        });

        this.registry = new CommandRegistry(this);
        this.events = new EventRegistry(this);
        this.schedulers = new SchedulerRegistry(this);
        this.rest = new RESTClient(this);
        this.database = new Database(this);
        this.settings = new SettingsProvider();
        this.cache = new Collection();
        this.color = 0xE67EDE;
        this.owners = ['280158289667555328', '229552088525438977', '145557815287611393'];
        this.maintenance = false;
        this.logger = winston.createLogger({
            transports: [new winston.transports.Console()],
            format: winston.format.combine(
                winston.format.colorize({ level: true }),
                winston.format.timestamp({ format: 'HH:mm:ss' }),
                winston.format.printf(
                    (info) => `[${info.timestamp}] [${info.level}] <=> ${info.message}`
                )
            )
        });
    }

    async start() {
        this.registry.start();
        this.events.start();
        this.schedulers.start();
        this.database.start();
        super.connect()
            .then(() => this.logger.info('Maika is currently connecting via WS...'));
    }

    /**
     * Set the bot (not) into maintenance
     * 
     * @param {boolean} mat A boolean if it is
     */
    setMaintenance(mat) {
        if (!mat) {
            this.maintenance = false;
            this.editStatus('online', {
                name: `x;help | ${this.guilds.size} Guild${this.guilds.size > 1 ? "s" : ""}`, type: 0
            });
        } else {
            this.maintenance = true;
            this.editStatus('dnd', {
                name: 'Cleaning Cafe Stile | Maintenance Mode enabled', type: 0
            });
        }
    }

    /**
     * Grabs the uptime of Maika
     * @returns {string} The humanized uptime
     */
    getUptime() { return humanize(Date.now() - this.startTime); }

    /**
     * Grabs every statistics of Maika
     */
    getStatistics() {
        return {
            guilds: this.guilds.size,
            users: this.users.size,
            channels: Object.keys(this.channelGuildMap).length,
            commands: this.registry.commands.size,
            messagesSeen: this.registry.statistics.messagesSeen,
            commandUsage: () => {
                const used = Object
                    .keys(this.registry.statistics.commandUsages)
                    .sort((a, b) => {
                        if (this.registry.statistics.commandUsages[a] < this.registry.statistics.commandUsages[b])
                            return 1;
                        if (this.registry.statistics.commandUsages[b] < this.registry.statistics.commandUsages[a])
                            return -1;
                        
                        return 0;
                    });
                return {
                    command: used[0] || 'None',
                    uses: this.registry.statistics.commandUsages[used[0]] || 0
                };
            },
            commandsExecuted: this.registry.statistics.commandsExecuted,
            uptime: this.getUptime(),
            memory: formatMemory(process.memoryUsage().heapUsed)
        };
    }
};