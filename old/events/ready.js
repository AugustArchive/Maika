const { Event } = require('../core');
const { Statuses } = require('../assets/game-statuses');

module.exports = class ReadyEvent extends Event {
    constructor(client) {
        super(client, 'ready');

        this.current = Statuses[Math.floor(Math.random() * Statuses.length)];
    }

    async emit() {
        if (!this.client.user.bot) {
            this.client.logger.warn('This client is not a self or a userbot; destroying client!..');
            await this.client.destroy();
        }

        this.client.logger.info(`  Maika has successfully connected to Discord! Ready to serve ${this.client.guilds.size} guilds with ${this.client.users.size} users~`);
        this.client.startRedditFeeds();
        for (const shard of this.client.shards.map(s => s)) {
            this.client.logger.info(`  Setting game status for Shard #${shard.id}..`);
            this.client.editStatus('online', {
                name: this.current.name
                    .replace('{{prefix}}', process.env.MAIKA_PREFIX)
                    .replace('{{shard}}', shard.id),
                type: this.current.type
            });
            setInterval(() => {
                this.client.logger.info(`  Setting game status for Shard #${shard.id}..`);
                this.client.editStatus('online', {
                    name: this.current.name
                        .replace('{{prefix}}', process.env.MAIKA_PREFIX)
                        .replace('{{shard}}', shard.id),
                    type: this.current.type
                });
            }, 120000);
        }
    }
}