const Plugin           = require('../structures/plugin');
const fetch            = require('node-fetch');
const { stripIndents } = require('common-tags');

module.exports = new Plugin({
    name: 'Crypto',
    embeded: ':dollar: Cryptocurrency',
    visible: true,
    enabled: true,
    commands: [
        {
            command: 'bitcoin',
            description: 'Get\'s BTC statistics',
            usage: '<"us"|"eu">',
            aliases: ['btc'],
            async run(msg) {
                if (!msg.args[0])
                    return msg.reply(`**${msg.sender.username}**: You must provide a region.`);
                if (!['us', 'eu'].includes(msg.args[0]))
                    return msg.reply(`**${msg.sender.username}**: Invalid region.`);

                switch (msg.args[0]) {
                    case "us": {
                        try {
                            const req = await fetch('https://www.bitstamp.net/api/v2/ticker/btcusd', { method: 'GET', headers: { 'User-Agent': msg.bot.constants.USER_AGENT } });
                            const res = await req.json();

                            await msg.embed({
                                description: stripIndents`
                                    :black_medium_square: **1 BTC**: ${parseInt(res.last).toLocaleString()}
                                    :black_medium_square: **High Value**: ${parseInt(res.high).toLocaleString()}
                                `,
                                color: msg.bot.color
                            });
                        } catch(ex) {
                            return msg.reply(msg.bot.constants.Strings.ERROR(msg, ex));
                        }
                    } break;
                    case "eu": {
                        try {
                            const requ = await fetch('https://www.bitstamp.net/api/v2/ticker/btceur', { method: 'GET', headers: { 'User-Agent': msg.bot.constants.USER_AGENT } });
                            const resp = await requ.json();

                            await msg.embed({
                                description: stripIndents`
                                    :black_medium_square: **1 BTC**: ${parseInt(resp.last).toLocaleString()}
                                    :black_medium_square: **High Value**: ${parseInt(resp.high).toLocaleString()}
                                `,
                                color: msg.bot.color
                            });
                        } catch(ex) {
                            return msg.reply(msg.bot.constants.Strings.ERROR(msg, ex));
                        }
                    }
                }
            }
        }
    ]
});
