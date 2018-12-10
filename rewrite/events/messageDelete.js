const Event = require('../core/event');

module.exports = new Event({
    event: 'messageDelete',
    emitter: 'on',
    run: (client, msg) => {
        if (!msg.author || !msg.channel.guild)
            return;

        client.cache.set(`delete-${msg.channel.id}`, {
            channelID: msg.channel.id,
            author: msg.author.toJSON(),
            content: msg.embeds.length > 0 ? msg.embed[0] : msg.content,
            timestamp: msg.timestamp
        });
    }
});