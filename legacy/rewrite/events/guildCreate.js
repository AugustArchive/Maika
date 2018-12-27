const Event = require('../core/event');

module.exports = new Event({
    event: 'guildCreate',
    emitter: 'on',
    run: (client, guild) => {
        client.logger.info(`Joined ${guild.name} (${guild.id})`);
        for (const s of bot.shards.map(sh => sh))
            bot.editStatus('online', {
                name: `x;help | [${s.id}] | ${bot.guilds.size} Guild${bot.guilds.size > 1 ? 's' : ''}`,
                type: 0
            });
    }
});