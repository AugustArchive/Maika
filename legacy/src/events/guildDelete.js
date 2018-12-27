const Event            = require('../structures/event');
const { stripIndents } = require('common-tags');

module.exports = class GuildLeftEvent extends Event {
    constructor(bot) {
        super(bot, {
            event: 'guildDelete',
            emitter: 'on'
        });
    }

    run(guild) {
        this.bot.logger.info(`Left ${guild.name} (${guild.id})`);
        this.bot.r.table('guilds').get(guild.id).delete().run();
        this.bot.createMessage(process.env.LOG_CHANNEL, {
            embed: {
                description: stripIndents`
                    Left **${guild.name}**
                `,
                color: this.bot.color
            }
        });
        this.bot.editStatus('online', { name: `x;help | ${this.bot.guilds.size} Guild${this.bot.guilds.size > 1 ? "s" : ""}`, type: 0 });
    }
};