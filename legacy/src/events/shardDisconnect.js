const Event = require('../structures/event');

module.exports = class ShardDisconnectedEvent extends Event {
    constructor(bot) {
        super(bot, {
            event: 'shardDisconnect',
            emitter: 'on'
        });
    }

    run(error, id) {
        this.bot.logger.warn(`Shard #${id} has been disconnected... (${error})`);
    }
};