import { Client, Event } from '@maika.xyz/kotori';

export class ShardReadyEvent extends Event {
    constructor(client: Client) {
        super(client, { event: 'shardReady', emitter: 'client' });
    }

    async run(id: number) {
        console.info(`[Shard ${id}] <=> Shard became online.`);
    }
};