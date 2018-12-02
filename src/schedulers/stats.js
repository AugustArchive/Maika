const Scheduler = require('../structures/scheduler');

// Bot lists:
// - Discord Bot Index
// Soon to be in:
// - Bots on Discord: Brussell
// - Discord Bot List v2: luke
// - bots.discord.pw: meew
// - Discord Bot Labs: Tony qt
module.exports = new Scheduler({
    name: 'stats',
    interval: 900000,
    enabled: false,
    run(bot) {
        await bot.http.post(`https://discordbotindex.com/apiv1/bot/${bot.user.id}`)
            .set()
            .agent(bot.constants.USER_AGENT)
            .send({ server_count: bot.guilds.size })
            .execute();
    }
});