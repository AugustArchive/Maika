const { Event } = require('../core');
module.exports = class ReadyEvent extends Event {
    constructor(client) {
        super(client, 'ready');
    }

    emit() {
        if (!this.client.user.bot) {
            this.client.logger.warn('Hello! You\'re running Maika as a selfuser bot, Maika is not a user/selfbot! Destroying...');
            this.client.destroy();
        }

        for (const s of this.client.shards.map(_ => _))
            this.client.editStatus('online', {
                name: `${process.env.MAIKA_PREFIX}help | [${s.id}] | ${this.client.guilds.size} Guild${this.client.guilds.size > 1 ? 's' : ''}`
            });

        this.client.logger.info('Maika successfully connected to Discord OwO');
        // this.client.startAllFeeds();
    }
}