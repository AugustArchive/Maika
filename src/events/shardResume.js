const Kotori = require('@maika.xyz/kotori');

module.exports = class ShardResumedEvent extends Kotori.Event {
    constructor(client) {
        super(client, 'shardResume');
    }

    emit(id) {
        this.client.logger.info(`Shard #${id} - Resumed`);
    }
}