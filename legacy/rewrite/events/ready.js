const Event = require('../core/event');

module.exports = new Event({
    event: 'ready',
    emitter: 'on',
    run: (client) => {
        client.logger.info(`${client.user.username}#${client.user.discriminator} has connected swiftly to Discord!`);
        for (const s of client.shards.map(sh => sh))
            client.editStatus('online', {
                name: `x;help | [Shard ${s.id}] | ${client.guilds.size} Guild${client.guilds.size > 1 ? 's' : ''}`,
                type: 0
            });

        client.schedulers.tasks.forEach(s => client.schedulers.processor.process(s));
    }
});