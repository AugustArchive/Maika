const { Event } = require('../core');

module.exports = class MessageDeletedEvent extends Event {
    constructor(client) {
        super(client, 'messageDelete');
    }

    async emit(message) {
        if (!message.channel || !message.author)
            return;

        await this
            .client
            .redis
            .set(`deleted-${message.channel.id}`, JSON.stringify({
                user: message.author.toJSON(),
                content: message.content,
                timestamp: message.timestamp
            }), 'EX', 60 * 60);
        this.client.logger.info(`Sniped message ${message.content}!`);
    }
}