const { Event } = require('../core');

module.exports = class ShardResumedEvent extends Event {
    constructor(client) {
        super(client, 'shardResume');
    }

    emit(id) {
        this.client.logger.info(`Shard #${id} has resumed!`);
    }
}