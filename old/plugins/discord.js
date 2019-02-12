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
        },
        {
            command: 'roleinfo',
            description: 'Shows information on a Discord role',
            usage: '<role>',
            aliases: ['role-info', 'roleinformation'],
            guild: true,
            run: async(client, ctx) => {
                if (!ctx.args[0])
                    return ctx.send(`${client.emojis.ERROR} **|** Missing \`<role\` argument.`);

                const role = await client.rest.getRole(ctx.args[0], ctx.guild);
                return ctx.embed({
                    title: `[ Role ${role.name} ]`,
                    color: role.color === 0? client.color: role.color,
                    description: stripIndents`
                        **ID**: ${role.id}
                        **Created At**: ${dateformat(role.createdAt, 'mm/dd/yyyy hh:MM:ssTT')}
                        **Position**: ${role.position - 1}
                        **Mentionable**: ${role.mentionable? 'Yes': 'No'}
                        **Hoisted**: ${role.hoisted? 'Yes': 'No'}
                        **Managed**: ${role.managed? 'Yes': 'No'}
                        **Color**: #${parseInt(role.color).toString(16)}
                    `,
                    footer: { text: client.getFooter() }
                });
            }
        },
        {
            command: 'serverinfo',
            description: 'Grabs information about a Discord guild',
            usage: '[server]',
            aliases: [
                'server-info', 
                'serverinformation', 
                'server-information', 
                'server', 
                'guild', 
                'guildinfo', 
                'guildinformation', 
                'guild-information'
            ],
            guild: true,
            run: async(client, ctx) => {
                const guild = await client.rest.getGuild(ctx.args.length > 0? ctx.args.join(' '): ctx.guild.id);
                return ctx.embed({
                    title: `[ Guild ${guild.name} ]`,
                    description: stripIndents`
                        **ID**: ${guild.id}
                        **Created At**: ${dateformat(guild.createdAt, 'mm/dd/yyyy hh:MM:ssTT')}
                        **Region**: ${guild.region}
                        **Owner**: <@${guild.ownerID}> (\`${guild.ownerID}\`)
                        **Members**: ${guild.memberCount.toLocaleString()}
                        **Roles [${guild.roles.size}]**: ${guild.roles.map(s => `<@&${s.id}>`).join(', ')}
                        **Emojis [${guild.emojis.length}]**: ${await client.rest.getGuildEmojis(guild, 25)}
                    `,
                    color: client.color,
                    footer: { text: client.getFooter() },
                    icon: { url: guild.icon? guild.iconURL: null }
                });
            }
        },
        {
            command: 'userinfo',
            description: "Grabs information about a Discord user or yourself.",
            usage: '[user]',
            aliases: ['user', 'user-info', 'user-information', 'userinformation'],
            run: async(client, ctx) => {
                const user = await client.rest.getUser(ctx.args.length > 0? ctx.args.join(' '): ctx.sender.id);
                const embed = {
                    title: `[ User ${user.username}#${user.discriminator} ]`,
                    color: client.color,
                    fields: [
                        {
                            name: 'ID', value: user.id, inline: false
                        },
                        {
                            name: 'Created At', value: dateformat(user.createdAt, 'mm/dd/yyyy hh:MM:ssTT'), inline: true
                        },
                        {
                            name: 'Bot', value: user.bot? 'Yes': 'No'
                        }
                    ],
                    thumbnail: { url: user.avatarURL || user.defaultAvatarURL }
                };

                if (ctx.guild && ctx.guild.members.has(user.id)) {
                    const member = ctx.guild.members.get(user.id);
                    if (member.nick)
                        embed.fields.push({ name: 'Nickname', value: member.nick, inline: true });

                    embed.fields.push({
                        name: 'Status', value: client.determineStatus(member.status), inline: true
                    });
                    embed.fields.push({
                        name: `Roles [${member.roles.length}]`, value: member.roles.map(s => `<@&${s}>`).join(', '), inline: true
                    });
                    embed.fields.push({
                        name: 'Mutual Guilds', value: client.guilds.filter(s => s.members.has(user.id)).map(s => `**${s.name}**`).join(', '), inline: true
                    });
                    
                    if (member.game)
                        embed.description = `${(member.game.type === 0 ? 'Playing' : member.game.type === 1 ? 'Streaming' : member.game.type === 2 ? 'Listening to' : member.game.type === 3 ? 'Watching' : '')} **${member.game.name}**`;

                    embed.fields.push({
                        name: 'Joined At', value: dateformat(member.joinedAt, 'mm/dd/yyyy hh:MM:ssTT'), inline: true
                    });

                    if (member.voiceState.channelID && msg.guild.channels.has(member.voiceState.channelID)) {
                        const voiceChannel = msg.guild.channels.get(member.voiceState.channelID);
                        embed.fields.push({
                            name: 'Voice Channel',
                            value: voiceChannel.name,
                            inline: true
                        });
                        embed.fields.push({
                            name: 'Mute',
                            value: member.voiceState.mute || member.voiceState.self_mute ? 'Yes' : 'No',
                            inline: true
                        });
                        embed.fields.push({
                            name: 'Deaf',
                            value: member.voiceState.deaf || member.voiceState.self_deaf ? 'Yes' : 'No',
                            inline: true
                        });
                    }
                }

                return ctx.embed(embed);
            }
        }
    ]
});