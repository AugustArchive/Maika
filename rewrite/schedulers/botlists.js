const request   = require('node-superfetch');
const Scheduler = require('../core/scheduler');

module.exports = new Scheduler({
    name: 'botlists',
    interval: 60 * 1000 * 1000,
    enabled: false,
    run: async(bot) => {
        await request
            .post(`https://discordbots.org/api/bots/${bot.user.id}/stats`)
            .set('Authorization', process.env.OLIY);
        
        await request
            .post(`https://discordbotindex.com/apiv1/bot/${bot.user.id}`)
            .set('Authorization', process.env.KIRB);
    }
});