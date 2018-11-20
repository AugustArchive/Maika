const Event = require('../structures/event');
const { stripIndents } = require('common-tags');

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
        this.bot.startFeeds();
        this.bot.setMaintenance(false);
        this.bot.editStatus('online', { name: `x;help | ${this.bot.guilds.size} Guild${this.bot.guilds.size > 1 ? "s" : ""}`, type: 0 });
    }
};