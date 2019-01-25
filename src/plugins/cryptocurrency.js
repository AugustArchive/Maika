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
            run: (client, ctx) => {
                if (!ctx.args[0] || !['us', 'eu'].includes(ctx.args[0]))
                    return ctx.send(ctx.translate('commands.cryptocurrency.bitcoin.missing'));
                else {
                    ctx.send('soon:tm:');
                }
            }
        }
    ]
});