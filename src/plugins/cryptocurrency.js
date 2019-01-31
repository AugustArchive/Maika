const { stripIndents } = require('common-tags');
const { Plugin } = require('../core');
const { get } = require('axios');

module.exports = new Plugin({
    name: 'crytocurrency',
    description: 'Grabs information about any cryptocurrency.',
    commands: [
        {
            command: 'bitcoin',
            description: 'Grabs information about how much is BitCoin worth.',
            usage: '<"us" | "eu">',
            aliases: ['btc'],
            run: async (client, ctx) => {
                if (!ctx.args[0] || !['us', 'eu'].includes(ctx.args[0]))
                    return ctx.send(`${client.emojis.ERROR} **|** Missing \`us\` or \`eu\` locale.`);
                
                if (!['us', 'eu'].includes(ctx.args[0]))
                    return ctx.send(`${client.emojis.ERROR} **|** Invalid region. Must chose \`us\` or \`eu\`.`);

                switch(ctx.args[0]) {
                case "us": {
                    try {
                        const res = await get('https://www.bitstamp.net/api/v2/ticker/btcusd', {
                            headers: { 'User-Agent': 'Maika/DiscordBot' }
                        });

                        await ctx.embed({
                            title: 'Bitcoin US',
                            description: stripIndents`
                                    :black_medium_square: **1 Bitcoin**: $${parseInt(res.data.high).toFixed(0)}
                                    :black_medium_square: **Highest Value**: $${parseInt(res.data.high).toFixed(0)}
                                `,
                            color: client.color,
                            footer: { text: client.getFooter() }
                        });
                    } catch(ex) {
                        ctx.send(`${client.emojis.ERROR} **|** An error occured while grabbing bitcoin values: \`${ex.message}\`. Try again later.`);
                    }
                } break;
                case "eu": {
                    try {
                        const res = await get('https://www.bitstamp.net/api/v2/ticker/btceur', {
                            headers: { 'User-Agent': 'Maika/DiscordBot' }
                        });

                        await ctx.embed({
                            title: 'Bitcoin Europe',
                            description: stripIndents`
                                    :black_medium_square: **1 Bitcoin**: €${parseInt(res.data.high).toFixed(0)}
                                    :black_medium_square: **Highest Value**: €${parseInt(res.data.high).toFixed(0)}
                                `,
                            color: client.color,
                            footer: { text: client.getFooter() }
                        });
                    } catch(ex) {
                        ctx.send(`${client.emojis.ERROR} **|** An error occured while grabbing bitcoin values: \`${ex.message}\`. Try again later.`);
                    }
                } break;
                }
            }
        }
    ]
});