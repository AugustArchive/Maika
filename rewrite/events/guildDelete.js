const Event = require('../core/event');

module.exports = new Event({
    event: 'guildDelete',
    emitter: 'on',
    run: (client, guild) => {
        client.logger.info(`Left ${guild.name} (${guild.id})`);
        for (const s of client.shards.map(sh => sh))
            client.editStatus('online', {
                name: `x;help | [${s.id}] | ${client.guilds.size} Guild${client.guilds.size > 1 ? 's' : ''}`,
                type: 0
            });
    }
});