import { Client, Event } from '@maika.xyz/kotori';

export class ShardResumedEvent extends Event {
    constructor(client: Client) {
        super(client, { event: 'shardResume', emitter: 'client' });
    }

    async run(id: number) {
        console.info(`[Shard ${id}] <=> Shard resumed.`);
    }
};