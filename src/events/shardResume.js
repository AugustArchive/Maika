const Event = require('../structures/event');

module.exports = class ShardResumedEvent extends Event {
    constructor(bot) {
        super(bot, {
            event: 'shardResume',
            emitter: 'on'
        });
    }

    run(id) {
        this.bot.logger.info(`Shard #${id} has been resumed!`);
    }
};