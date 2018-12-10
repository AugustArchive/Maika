const Event = require('../core/event');

module.exports = new Event({
    event: 'ready',
    emitter: 'on',
    run: (bot) => {
        bot.logger.info(`${bot.user.username}#${bot.user.discriminator} has connected swiftly to Discord!`);
        for (const s of bot.shards.map(sh => sh))
            bot.editStatus('online', {
                name: `x;help | [${s.id}] | ${bot.guilds.size} Guild${bot.guilds.size > 1 ? 's' : ''}`,
                type: 0
            });
    }
});