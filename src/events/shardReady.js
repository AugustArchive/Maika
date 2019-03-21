const { Event } = require('@maika.xyz/kotori');

module.exports = class ShardReadyEvent extends Event {
    constructor(client) {
        super(client, 'shardReady');
    }

    emit(id) {
        this.client.logger.info(`Shard #${id} - Connected`);
    }
}