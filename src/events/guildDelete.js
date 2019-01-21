const { Event } = require('../core');

module.exports = class GuildLeftEvent extends Event {
    constructor(client) {
        super(client, 'guildDelete');
    }

    emit(guild) {
        this.client.logger.verbose(`Joined ${guild.name} (${guild.id})`);
        this.client.settings.delete(guild.id);
        this.client.createMessage(process.env.LOG_CHANNEL, {
            content: `${this.client.emojis.INFO} **|** Left ${guild.name}...`
        });
    }
}