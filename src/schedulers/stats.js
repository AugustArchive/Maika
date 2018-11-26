const Scheduler = require('../structures/scheduler');
const fetch     = require('node-fetch');

// Bot lists:
// - Discord Bot Index
// Soon to be in:
// - Bots on Discord: Brussell
// - Discord Bot List v2: luke
// - bots.discord.pw: meew
// - Discord Bot List: Oliy (even tho he big succ)
// - Discord Bot Labs: Tony qt
module.exports = new Scheduler({
    name: 'stats',
    interval: 900000,
    enabled: false,
    run(bot) {
        fetch(`https://discordbotindex.com/apiv1/bot/${bot.user.id}`, { 
            method: 'POST',
            headers: {
                'User-Agent': bot.constants.USER_AGENT,
                Authorization: process.env.DBI
            },
            body: {
                server_count: bot.guilds.size
            }
        }).then(async(result) => {
            if (result.ok)
                await result.json();
            throw result;
        }).then(() => bot.logger.info(`Posted statistics to Discord Bot Index!`));
    }
});