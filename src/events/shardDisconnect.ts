import { Client, Event } from '@maika.xyz/kotori';

export class ShardDisconnectedEvent extends Event {
    constructor(client: Client) {
        super(client, { event: 'shardDisconnect', emitter: 'client' });
    }

    async run(error: Error, id: number) {
        console.warn(`[Shard ${id}] <=> Shard was disconnected!\n${error.stack}`);
    }
};