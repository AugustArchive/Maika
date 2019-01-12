const Router = require('../lib/router');
const { humanize } = require('@maika.xyz/miu');

module.exports = class MainRouter extends Router {
    constructor(client) {
        super(client, '/');
    }

    run() {
        this
            .router
            .get('/', (_, res) => res.render('index.ejs', { user: this.client.user }))
            .get('/discord', (_, res) => res.redirect('https://discord.gg/7TtMP2n'))
            .get('/github', (_, res) => res.redirect('https://github.com/MaikaBot'))
            .get('/statistics', (_, res) => res.render('statistics.ejs', {
                guilds: this.client.guilds.size,
                users: this.client.users.size,
                channels: Object.keys(this.client.channelGuildMap).length,
                shards: this.client.shards.size,
                uptime: humanize(Date.now() - this.client.startTime)
            }));
    }
}