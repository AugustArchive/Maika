const request   = require('node-superfetch');
const Scheduler = require('../core/scheduler');

module.exports = new Scheduler({
    name: 'botlists',
    interval: 60 * 1000 * 1000,
    enabled: true,
    run: async(bot) => {
        // If the ID is Mafuyu
        if (bot.user.id === '508842721545289731')
            return;

        await request
            .post(`https://discordbots.org/api/bots/${bot.user.id}/stats`)
            .set('Authorization', process.env.OLIY)
            .send({ server_count: bot.guilds.size, shard_count: bot.shards.size })
        
        await request
            .post(`https://discordbotindex.com/apiv1/bot/${bot.user.id}`)
            .set('Authorization', process.env.DERPY)
            .send({ server_count: bot.guilds.size });
    }
});