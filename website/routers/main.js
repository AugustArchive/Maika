const Router = require('../interfaces/router');

module.exports = class MainRouter extends Router {
    constructor(bot) { super(bot, '/'); }
    run() {
        this
            .router
            .get('/', (_, res) => res.render('index.ejs'))
            .get('/invite', (_, res) => res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${this.bot.user.id}&scope=bot`))
            .get('/discord', (_, res) => res.redirect('https://discord.gg/7TtMP2n'))
            .get('/statistics', (_, res) => res.render('statistics.ejs', {
                guilds: this.bot.guilds.size,
                users: this.bot.users.size,
                plugins: this.bot.registry.plugins.size,
                shards: this.bot.shards.size,
                channels: Object.keys(this.bot.channelGuildMap).length,
                memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
            }));
    }
};