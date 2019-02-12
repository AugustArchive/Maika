const { Event } = require('../core');

module.exports = class ShardReadyEvent extends Event {
    constructor(client) {
        super(client, 'shardReady');
    }

    emit(id) {
        this.client.logger.verbose(`Shard #${id} is ready to be launched!`);
    }
}