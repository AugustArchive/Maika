const { stripIndents } = require('common-tags');
const { dateformat } = require('@maika.xyz/miu');
const { elipisis } = require('../util/string');
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
                            name: 'ID', value: channel.id
                        },
                        {
                            name: 'Created At', value: dateformat(channel.createdAt, 'mm/dd/yyyy hh:MM:ssTT'), inline: true
                        },
                        {
                            name: 'Type', value: channel.type === 0? 'Text': channel.type === 2? 'Voice': channel.type === 4? 'Category': 'Unknown', inline: true
                        }
                    ],
                    color: client.color,
                    footer: { text: `Requested by ${ctx.sender.username} | ${client.getFooter()}` }
                };

                if (channel.type === 0)
                    embed.fields.push({
                        name: 'NSFW', value: channel.nsfw? 'Yes': 'No', inline: true
                    },
                    {
                        name: 'Topic', value: channel.topic? elipisis(channel.topic, 1350): 'No topic available.', inline: true
                    });

                if (!ctx.guild || !ctx.guild.channels.has(channel.id)) {
                    const guild = client.guilds.get(client.channelGuildMap[channel.id]);
                    embed.fields.push({
                        name: 'Guild', value: `${guild.name} (\`${guild.id}\`)`, inline: true
                    });
                }

                if (channel.type !== 4 && channel.parentID) {
                    const category = channel.guild.channels.get(channel.parentID);
                    embed.fields.push({
                        name: 'Category', value: category.name, inline: true
                    });
                }

                if (channel.type === 2)
                    embed.fields.push({
                        name: 'Users Connected', value: channel.voiceMembers.size, inline: true
                    },
                    {
                        name: 'User Limit', value: channel.userLimit, inline: true
                    });

                return ctx.embed(embed);
            }
        },
        {
            command: 'emojis',
            description: 'Lists the emojis of the current guild.',
            aliases: ['emojilist', 'list-emojis', 'listemojis'],
            guild: true,
            run: async(client, ctx) => {
                const emojis = await client.rest.getGuildEmojis(ctx.guild, 75);
                return ctx.embed({
                    description: emojis,
                    color: client.color,
                    footer: { text: client.getFooter() }
                });
            }
        },
        {
            command: 'messageinfo',
            description: 'Grabs information about a Discord message.',
            usage: '<channelID:messageID>',
            aliases: ['message-info', 'message'],
            run: async(client, ctx) => {
                if (!ctx.args[0])
                    return ctx.send(`${client.emojis.ERROR} **|** Missing \`<channelID:messageID>\` argument.`);

                const arg = ctx.args[0].split(':');

                try {
                    const message = await client.rest.getMessage({
                        channelID: arg[0],
                        messageID: arg[1]
                    });

                    return ctx.embed({
                        description: stripIndents`
                            **${message.content}**

                            **Channel**: ${message.channel.name}
                            **Author**: ${message.author.username}#${message.author.discriminator}
                            **Created At**: ${dateformat(message.createdAt, 'mm/dd/yyyy hh:MM:ssTT')}
                        `,
                        color: client.color,
                        footer: { text: client.getFooter() }
                    });
                } catch(ex) {
                    ctx.send(`${client.emojis.ERROR} **|** Unknown message id.`);
                }
            }
        }
    ]
});