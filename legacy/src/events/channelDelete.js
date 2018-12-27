const Event            = require('../structures/event');
const { stripIndents } = require('common-tags');

module.exports = class ChannelDeletedEvent extends Event {
    constructor(bot) {
        super(bot, {
            event: 'channelDelete',
            emitter: 'on'
        });
    }

    async run(channel) {
        const guild = this.bot.guilds.get(this.bot.channelGuildMap[channel.id]);
        const data  = await this.bot.r.table('guilds').get(guild.id).run();

        if (data.logging.enabled && guild.channels.has(data.logging.channelID) && guild.channels.get(data.logging.channelID).permissionsOf(this.bot.user.id).has('sendMessages'))
            guild.channels.get(data.logging.channelID).createMessage({
                embed: {
                    description: stripIndents`
                        Channel **${channel.name}** was deleted
                    `,
                    color: this.bot.color
                }
            });
    }
};