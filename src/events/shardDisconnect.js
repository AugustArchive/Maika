const kotori = require('@maika.xyz/kotori');

module.exports = class ShardDisconnectedEvent extends kotori.Event {
    constructor(client) { super(client, 'shardDisconnect'); }
    emit(error, id) {
        this.client.logger.error(`Shard #${id} - Disconnected:\n${error.stack || error}`);
    }
}