const Event = require('../structures/event');

module.exports = class ShardResumedEvent extends Event {
    constructor(bot) {
        super(bot, {
            event: 'shardResume',
            emitter: 'on'
        });
    }

    run(id) {
        this.bot.logger.warn(`Shard #${id} has been resumed!`);
    }
};