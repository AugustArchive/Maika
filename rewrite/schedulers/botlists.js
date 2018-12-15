const fetch = require('node-fetch');
const Scheduler = require('../core/scheduler');

module.exports = new Scheduler({
    name: 'botlists',
    interval: 60 * 1000 * 1000,
    enabled: true,
    run: async(bot) => {
        // If the ID is Mafuyu
        if (bot.user.id === '508842721545289731')
            return;

        await fetch(`https://discordbots.org/api/bots/${bot.user.id}/stats`, {
            method: 'POST',
            body: { server_count: bot.guilds.size, shard_count: bot.shards.size },
            headers: { 'User-Agent': 'Maika/DiscordBot (https://github.com/MaikaBot/Maika)', 'Authorization': process.env.OLIY }
        });
        await fetch(`https://discordbotindex.com/apiv1/bot/${bot.user.id}`, {
            method: 'POST',
            body: { server_count: bot.guilds.size },
            headers: { 'User-Agent': 'Maika/DiscordBot (https://github.com/MaikaBot/Maika)', 'Authorization': process.env.DERPY }
        });
    }
});