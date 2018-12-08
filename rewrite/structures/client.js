const { Client: DiscordClient } = require('eris');
const CommandRegistry           = require('./registry/commands');
const EventRegistry             = require('./registry/events');
const SchedulerRegistry         = require('./registry/schedulers');
const Database                  = require('./database');
const winston                   = require('winston');
const FinderUtil                = require('../util/finder');

module.exports = class MaikaClient extends DiscordClient {
    constructor() {
        super(process.env.MAIKA_TOKEN, {
            maxShards: 'auto',
            disableEveryone: true,
            autoreconnect: true
        });

        this.registry     = new CommandRegistry(this);
        this.events       = new EventRegistry(this);
        this.schedulers   = new SchedulerRegistry(this);
        this.finder       = new FinderUtil(this);
        this.database     = new Database(this);
        this.color        = 0xE67EDE;
        this.http         = require('./http/request');
        this.owners       = ['280158289667555328', '229552088525438977', '145557815287611393'];
        this.maintenance  = false;
        this.announcement = '0.1.0 released today!';
        this.logger       = winston.createLogger({
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
};