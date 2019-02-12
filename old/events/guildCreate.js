const { Event } = require('../core');

module.exports = class GuildJoinedEvent extends Event {
    constructor(client) {
        super(client, 'guildCreate');
    }

    emit(guild) {
        this.client.logger.verbose(`Joined ${guild.name} (${guild.id})`);
        this.client.settings.create(guild.id);
        this.client.createMessage(process.env.LOG_CHANNEL, {
            content: `${this.client.emojis.INFO} **|** Joined ${guild.name}!`,
            embed: {
                description: require('common-tags').stripIndents`
                    **ID**: ${guild.id}
                    **Channels**: ${guild.channels.size}
                    **Roles**: ${guild.roles.map(s => s.name).join(', ')}
                    **Members**: ${guild.memberCount}
                `,
                color: this.client.color
            }
        });
    }
}