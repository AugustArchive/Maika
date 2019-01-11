'use strict';

const { Scheduler } = require('../core');
const { post } = require('axios');

module.exports = new Scheduler({
    name: 'botlists',
    interval: (80 * 1000),
    run: async (client) => {
        // If the user ID is Mafuyu
        if (client.user.id === '508842721545289731')
            return;

        await post(`https://discord.boats/api/bots/${client.user.id}`, {
            headers: {
                Authorization: process.env.UNTO,
                'User-Agent': 'Maika/DiscordBot (https://github.com/MaikaBot/Maika)'
            },
            data: { server_count: client.guilds.size }
        }).then(_ => this.client.logger.info(`Posted ${client.guilds.size} guilds to discord.boats!`));

        await post(`https://discordbotindex.com/apiv1/bots/${client.user.id}`, {
            headers: {
                Authorization: process.env.DERPY,
                'User-Agent': 'Maika/DiscordBot (https://github.com/MaikaBot/Maika)'
            },
            data: { server_count: client.guilds.size }
        }).then(_ => this.client.logger.info(`Posted ${client.guilds.size} guilds to Discord Bot Index!~`));
    }
});