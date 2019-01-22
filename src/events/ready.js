const { Event } = require('../core');
const statues = require('../assets/game-statuses');

module.exports = class ReadyEvent extends Event {
    constructor(client) {
        super(client, 'ready');

        this.current = statues.Statuses[Math.floor(Math.random() * statues.Statuses.length)];
    }

    emit() {
        if (!this.client.user.bot) {
            this.client.logger.warn('Hello! You\'re running Maika as a selfuser bot, Maika is not a user/selfbot! Destroying...');
            this.client.destroy();
        }

        this.client.editStatus('online', {
            name: this.current.name.replace('{{prefix}}', process.env.MAIKA_PREFIX),
            type: this.current.type
        });
        this.client.logger.info('Maika successfully connected to Discord OwO');
        // this.client.startRedditFeeds();
        // this.client.startTwitchFeeds();
        this.client.website.bootstrap();
        setTimeout(() => {
            this.client.editStatus('online', {
                name: this.current.name,
                type: this.current.type
            });
        }, 60 * 1000);
    }
}