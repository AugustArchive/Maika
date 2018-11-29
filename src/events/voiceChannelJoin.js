const Event = require('../structures/event');

module.exports = class VoiceChannelJoinEvent extends Event {
    constructor(bot) {
        super(bot, { event: 'voiceChannelJoin', emitter: 'on' });
    }

    async run(member, vc) {
        const settings = await this.bot.r.table('guilds').get(member.guild.id).run();
        if (
            vc.type === 2 &&
            settings.logging.enabled &&
            member.guild.channels.has(settings.logging.channelID) &&
            member.guild.channels.get(settings.logging.channelID).permissionsOf(this.bot.user.id).has('sendMessages')
        ) member.guild.channels.get(settings.logging.channelID).createMessage({
            embed: {
                description: `**${member.user.username}#${member.user.discriminator}** joined **${vc.name}**`,
                color: this.bot.color
            }
        });
    }
};