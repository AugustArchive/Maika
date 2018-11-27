const Event             = require('../structures/event');
const { PlayerManager } = require('vertbot-eris-lavalink');
const { stripIndents }  = require('common-tags');
const nodes             = require('../util/lavalink-nodes');

module.exports = class ReadyEvent extends Event {
    constructor(bot) {
        super(bot, {
            event: 'ready',
            emitter: "on"
        });
    }

    run() {
        this.bot.logger.info(stripIndents`
            ${this.bot.user.username}#${this.bot.user.discriminator} has connected to Discord!
        
            GUILDS  : ${this.bot.guilds.size}
            USERS   : ${this.bot.users.size}
            CHANNELS: ${Object.keys(this.bot.channelGuildMap).length}
            SHARDS  : ${this.bot.shards.size}
            PLUGINS : ${this.bot.registry.plugins.size}
        `);
        this.bot.createMessage(process.env.LOG_CHANNEL, {
            embed: {
                description: stripIndents`
                    **${this.bot.user.username}#${this.bot.user.discriminator}** has connected to Discord!
                    \`\`\`diff
                    + GUILDS  : ${this.bot.guilds.size}
                    + USERS   : ${this.bot.users.size}
                    + CHANNELS: ${Object.keys(this.bot.channelGuildMap).length}
                    + SHARDS  : ${this.bot.shards.size}
                    + PLUGINS : ${this.bot.registry.plugins.size}
                    \`\`\`
                `,
                color: this.bot.color
            }
        });
        if (!(this.bot.voiceConnections instanceof PlayerManager))
            this.bot.voiceConnections = new PlayerManager(this.bot, nodes, {
                userId: this.bot.user.id,
                numShards: this.bot.shards.size
            });
        this.bot.startFeeds();
        this.bot.setMaintenance(false);
        this.bot.editStatus('online', { name: `x;help | ${this.bot.guilds.size} Guild${this.bot.guilds.size > 1 ? "s" : ""}`, type: 0 });
        this
            .bot
            .website
            .setApplicationRoot()
            .setRouters()
            .start();
    }
};