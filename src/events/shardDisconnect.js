const { Event } = require('../core');

module.exports = class ShardDisconnectedEvent extends Event {
    constructor(client) {
        super(client, 'shardDisconnect');
    }

    emit(error, id) {
        this.client.logger.warn(`Shard #${id} has died because of an error:\n${error.stack}`);
    }
}