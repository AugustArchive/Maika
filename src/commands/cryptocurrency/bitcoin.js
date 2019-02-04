const { Command } = require('../../core');
const { stripIndents } = require('common-tags');
const { get } = require('axios');

module.exports = class BitcoinCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'bitcoin',
            description: 'Grabs information about how much is BitCoin worth.',
            usage: '<"us" | "eu">',
            aliases: ['btc'],
            category: 'Cryptocurrency'
        });
    }

    /**
     * Run the `bitcoin` command
     * @param {import('../../core/internal/context')} ctx The command context
     */
    async run(ctx) {
        if (!ctx.args[0] || !['us', 'eu'].includes(ctx.args[0]))
            return ctx.send(`${client.emojis.ERROR} **|** Missing \`us\` or \`eu\` locale.`);

        switch (ctx.args[0]) {
            case 'us': {
                try {
                    const { data } = await get('https://www.bitstamp.net/api/v2/ticker/btcusd');
                    return ctx.embed({
                        title: 'Bitcoin US',
                        description: stripIndents`
                            :black_medium_square: **1 Bitcoin**: $${parseInt(data.last).toFixed(0)}
                            :black_medium_square: **Highest Value**: $${parseInt(data.high).toFixed(0)}
                        `,
                        color: this.client.color
                    });
                } catch(ex) {
                    ctx.send(`${client.emojis.ERROR} **|** An error occured while grabbing bitcoin values: \`${ex.message}\`. Try again later.`);
                }
            } break;
            case 'eu': {
                try {
                    const { data } = await get('https://www.bitstamp.net/api/v2/ticker/btceur');
                    return ctx.embed({
                        title: 'Bitcoin US',
                        description: stripIndents`
                            :black_medium_square: **1 Bitcoin**: €${parseInt(data.last).toFixed(0)}
                            :black_medium_square: **Highest Value**: €${parseInt(data.high).toFixed(0)}
                        `,
                        color: this.client.color
                    });
                } catch(ex) {
                    ctx.send(`${client.emojis.ERROR} **|** An error occured while grabbing bitcoin values: \`${ex.message}\`. Try again later.`);
                }
            } break;
        }
    }
};