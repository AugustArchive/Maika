const { Scheduler } = require('../core');
const { post } = require('axios');

module.exports = new Scheduler({
    name: 'statistics',
    interval: 10 * 1000,
    run: async (client) => {
        if (client.user.id === '508842721545289731')
            return;

        await post('https://maikabot.xyz/api/stats', {
            headers: {
                Authorization: process.env.MAIKA_API,
                'User-Agent': 'Maika/DiscordBot'
            },
            data: {
                guilds: client.guilds.size,
                users: client.users.size,
                channels: Object.keys(client.channelGuildMap).length,
                uptime: Date.now() - client.startTime,
                memory: null,
                queue: null
            }
        }).then(_ => client.logger.info('Posted statistics to Maika\'s api!'));
    }
});