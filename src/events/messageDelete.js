const { Event } = require('../core');

module.exports = class MessageDeletedEvent extends Event {
    constructor(client) {
        super(client, 'messageDelete');
    }

    run(message) {
        if (!message.channel || !message.author)
            return;

        this
            .client
            .redis
            .set(`deleted-${message.id}`, JSON.stringify({
                author: message.author.toJSON(),
                content: message.content,
                timestamp: message.timestamp,
                channel: message.channel
            }), 'EX', 60 * 60);
        this.client.logger.info(`Sniped message ${message.content}!`);
    }
}