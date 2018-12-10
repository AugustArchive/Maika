const request   = require('../core/http/request');
const Scheduler = require('../core/scheduler');

module.exports = new Scheduler({
    name: 'botlists',
    interval: 60 * 1000 * 1000,
    run: async(bot) => {
        await request
            .post(`https://discordbots.org/api/bots/${bot.user.id}/stats`)
            .addHeader('Authorization', process.env.OLIY)
            .execute();
        
        await request
            .post(`https://discordbotindex.com/apiv1/bot/${bot.user.id}`)
            .addHeader('Authorization', process.env.KIRB)
            .execute();
    }
});