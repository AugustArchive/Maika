const { stripIndents } = require('common-tags');
const { Plugin } = require('../core');
const codeblock = require('../util/codeblock');

// Keys for configuration
const keys = ['guild.prefix', 'guild.reddit.enabled', 'guild.reddit.channelID'];

module.exports = new Plugin({
    name: 'settings',
    description: 'Sets/views/resets the guild\'s settings',
    commands: [
        {
            command: 'get',
            description: 'Gets the guild\'s settings.',
            aliases: ['view', 'status'],
            guild: true,
            permissions: ['manageGuild'],
            run: async(client, ctx) => {
                const settings = await client.settings.get(ctx.guild.id);
                return ctx.embed({
                    description: codeblock('ini', stripIndents`
                        # Guild Settings for ${ctx.guild.name}
                        [guild.prefix]: ${settings['prefix']}
                        [guild.reddit.enabled]: ${settings['reddit'].enabled? 'Yes': 'No'}
                        [guild.reddit.channelID]: ${settings['reddit'].channelID === null? 'None specified.': settings['reddit'].channelID}
                    `),
                    color: client.color,
                    footer: { text: client.getFooter() }
                });
            }
        },
        {
            command: 'set',
            description: 'Sets any configuration to a new value.',
            usage: '<key> <value>',
            guild: true,
            permissions: ['manageGuild'],
            run: async(client, ctx) => {
                if (!ctx.args[0])
                    return ctx.raw(`${client.emojis['INFO']} **|** Available keys for setting configuration:`, {
                        description: `\`${keys.map(s => `\`${s}\``).join('`, `')}\``,
                        color: client.color
                    });

                if (!keys.includes(ctx.args[0].toLowerCase()))
                    return ctx.raw(`${client.emojis['INFO']} **|** Available keys for setting configuration:`, {
                        description: `\`${keys.map(s => `\`${s}\``).join('`, `')}\``,
                        color: client.color
                    });

                switch (ctx.args[0].toLowerCase()) {
                case "guild.prefix": {
                    if (!ctx.args[1])
                        return ctx.send(`${client.emojis['ERROR']} **|** No prefix was set.`);

                    const prefix = ctx.args[1];
                    if (prefix.length > 15)
                        return ctx.send(`${client.emojis['ERROR']} **|** Prefixes must be lower or equal to 15.`);

                    if (prefix.includes('@everyone') || prefix.includes('@here'))
                        return ctx.send(`${client.emojis['ERROR']} **|** I'm not here to piss off other members but no mentions in prefixes.`);

                    const promise = await client.settings.update(ctx.guild.id, {
                        prefix
                    });
                    ctx.send(`${client.emojis['OK']} **|** Prefix has been set to **${prefix}**.\n${codeblock('js', require('util').inspect(promise))}`);
                } break;
                }
            }
        }
    ]
});