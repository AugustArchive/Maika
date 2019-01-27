const { stripIndents } = require('common-tags');
const { dateformat } = require('@maika.xyz/miu');
const { Plugin } = require('../core');

module.exports = new Plugin({
    name: 'discord',
    description: 'Useful discord-related commands.',
    commands: [
        {
            command: 'channelinfo',
            description: 'Grabs information about a Discord text, voice, or categorial channel.',
            usage: '[channel]',
            aliases: ['channel', 'channel-info', 'discord-channel'],
            guild: true,
            run: async(client, ctx) => {
                const channel = await client.rest.getChannel(ctx.args.length > 0? ctx.args.join(' '): ctx.channel.id, ctx.guild);
                let embed = {
                    title: `[ Channel ${channel.type === 0 ? `#${channel.name}` : channel.name} ]`,
                    fields: [
                        {
                            name: 'ID', value: channel.id, inline: false
                        },
                        {
                            name: 'Created At', value: dateformat(channel.createdAt, 'mm/dd/yyyy hh:MM:ssTT')
                        },
                        {
                            name: 'Type', value: channel.type === 0? 'Text': channel.type === 2? 'Voice': channel.type === 4? 'Category': 'Unknown'
                        }
                    ],
                    color: client.color,
                    footer: { text: `Requested by ${ctx.sender.username} | ${client.getFooter()}` }
                };


            }
        }
    ]
});