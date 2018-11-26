const Plugin           = require('../structures/plugin');
const { dateformat }   = require('../deps');
const { stripIndents } = require('common-tags');

module.exports = new Plugin({
    name: 'Discord',
    embeded: '<:discord:514626557277503488> Discord Information',
    visible: true,
    enabled: true,
    commands: [{
        command: 'channelinfo',
        description: 'Grabs information about a Discord text/voice/category channel',
        usage: '[channel]',
        aliases: ['channel-info', 'channelinformation', 'channel'],
        category: 'Discord Information',
        async run(msg) {
            const channel = await msg.bot.finder.channel(msg.args.length > 0 ? msg.args.join(' ') : msg.channel.id, msg.guild);
            let embed = {
                title: `Channel ${(channel.type === 0) ? `#${channel.name}` : channel.name}`,
                color: msg.bot.color,
                fields: [
                    {
                        name: 'ID', value: channel.id, inline: false
                    },
                    {
                        name: 'Created At', value: dateformat(channel.createdAt, 'mm/dd/yyyy hh:MM:ss TT'), inline: true
                    },
                    {
                        name: 'Channel Type', value: (channel.type === 0) ? 'Text' : (channel.type === 2) ? 'Voice' : (channel.type === 4) ? 'Category' : 'Unknown', inline: true
                    }
                ]
            };

            if (channel.type === 0)
                embed.fields.push({ name: 'NSFW', value: (channel.nsfw) ? "Yes" : "No", inline: true });
            if (!msg.guild || !msg.guild.channels.has(channel.id))
                embed.fields.push({ name: 'Guild', value: msg.bot.guilds.get(msg.bot.channelGuildMap[channel.id]).name, inline: true });
            if (channel.type !== 4 && channel.parentID)
                embed.fields.push({ name: 'Category', value: channel.guild.channels.get(channel.parentID).name, inline: true });
            if (channel.type === 2)
                embed.fields.push({ name: 'Users Connected', value: channel.voiceMembers.size, inline: true }, { name: 'User Limit', value: channel.userLimit, inline: true });

            return await msg.embed(embed);
        }
    },
    {
        command: 'emojis',
        description: 'Grabs all of the emojis from the guild',
        aliases: ['emojilist'],
        category: 'Discord Information',
        async run(msg) {
            const emojis = await msg.bot.finder.emojis(msg.guild);
            return msg.embed({
                description: emojis,
                color: msg.bot.color
            });
        }
    },
    {
        command: 'id',
        description: 'Gives your or another user\'s Discord ID.',
        usage: '[user]',
        aliases: ['user-id', 'userid', 'userID', 'userId'],
        async run(msg) {
            const user = await msg.bot.finder.user(msg.args.length > 0 ? msg.args.join(' ') : msg.sender.id);
            return msg.reply(`**${msg.sender.username}**: ${(user.id === msg.sender.id) ? `Your id is: \`${msg.sender.id}\`` : `${user.username}#${user.discriminator}'s ID: \`${user.id}\``}`);
        }
    },
    {
        command: 'message',
        description: 'Grabs information about a Discord message',
        usage: '<channelID:messageID>',
        aliases: ['messageID', 'messageId', 'messageinfo'],
        async run(msg) {
            if (!msg.args[0])
                return msg.reply(`**${msg.sender.username}**: \`<channelID:messageID>\` argument hasn't passed.`);

            try {
                const args = msg.args[0].split(':');
                const message = await msg.bot.finder.message({ channelID: args[0], messageID: args[1] });

                return msg.embed({
                    description: stripIndents`
                        **${message.content}**
                        \`\`\`diff
                        + Author: ${message.author.username} (${message.author.id})
                        + Created At: ${dateformat(message.createdAt, 'mm/dd/yyyy hh:MM:ss TT')}
                        + Channel: ${message.channel.name}
                        \`\`\`
                    `,
                    color: msg.bot.color
                });
            } catch(ex) {
                return msg.reply(`**${msg.sender.username}**: \`${ex}\`.`);
            }
        }
    },
    {
        command: 'roleinfo',
        description: 'Grabs information about a Discord role',
        usage: '<role>',
        aliases: ['role-info', 'role-information', 'role'],
        async run(msg) {
            if (!msg.args[0])
                return msg.reply(`**${msg.sender.username}**: You must supply a role ID, mention, or name.`);

            const role = await msg.bot.finder.role(msg.args[0], msg.guild);
            return await msg.embed({
                title: `Role ${role.name}`,
                color: (role.color === 0 ? msg.bot.color : role.color),
                fields: [
                    {
                        name: 'ID', value: role.id, inline: false
                    },
                    {
                        name: 'Created At', value: dateformat(role.createdAt, 'mm/dd/yyyy hh:MM:ss TT'), inline: true
                    },
                    {
                        name: 'Position', value: role.position - 1, inline: true
                    },
                    {
                        name: 'Mentionable', value: (role.mentionable ? 'Yes' : 'No'), inline: true
                    },
                    {
                        name: 'Hoisted', value: (role.hoist ? 'Yes' : 'No'), inline: true
                    },
                    {
                        name: 'Managed', value: (role.managed ? 'Yes' : 'No'), inline: true
                    },
                    {
                        name: 'Color', value: `#${parseInt(role.color).toString(16)}`, inline: true
                    }
                ]
            });
        }
    },
    {
        command: 'serverinfo',
        description: 'Grabs information about the current guild or a guild called by an argument.',
        usage: '[server]',
        aliases: ['guildinfo', 'guild-info'],
        async run(msg) {
            const guild = await msg.bot.finder.guild(msg.args.length > 0 ? msg.args.join(' ') : msg.guild.id);
            return await msg.embed({
                title: `Guild ${guild.name}`,
                color: msg.bot.color,
                fields: [
                    {
                        name: 'ID', value: guild.id, inline: false
                    },
                    {
                        name: 'Created At', value: dateformat(guild.createdAt, 'mm/dd/yyyy hh:MM:ss TT'), inline: true
                    },
                    {
                        name: 'Region', value: guild.region, inline: true
                    },
                    {
                        name: 'Guild Owner', value: `<@${guild.ownerID}>`, inline: true
                    },
                    {
                        name: 'Members', value: guild.memberCount.toLocaleString(), inline: true
                    },
                    {
                        name: 'Channels', value: guild.channels.size, inline: true
                    },
                    {
                        name: `Roles [${guild.roles.size}]`, value: guild.roles.map(s => `<@&${s.id}>`).join(', '), inline: false
                    },
                    {
                        name: `Emojis [${guild.emojis.length}]`, value: (await msg.bot.finder.emojis(guild, 25)), inline: true
                    }
                ],
                thumbnail: { url: guild.icon ? guild.iconURL : null }
            });
        }
    },
    {
        command: 'userinfo',
        description: 'Grabs information about yourself or another user.',
        usage: '[user]',
        aliases: ['user-info'],
        async run(msg) {
            const user = await msg.bot.finder.user(msg.args.length > 0 ? msg.args.join(' ') : msg.sender.id);
            const embed = {
                title: `User ${user.username}#${user.discriminator}`,
                color: msg.bot.color,
                fields: [
                    {
                        name: 'ID', value: user.id, inline: false
                    },
                    {
                        name: 'Created At', value: dateformat(user.createdAt, 'mm/dd/yyyy hh:MM:ss TT'), inline: true
                    },
                    {
                        name: 'Bot', value: (user.bot ? "Yes" : "No"), inline: true
                    }
                ],
                thumbnail: { url: user.avatarURL || user.defaultAvatarURL }
            };

            if (msg.guild && msg.guild.members.has(user.id)) {
                const member = msg.guild.members.get(user.id);
                if (member.nick)
                    embed.fields.push({ name: 'Nickname', value: member.nick, inline: true });
                
                embed.fields.push({ name: 'Status', value: (member.status === 'online' ? "Online" : member.status === 'idle' ? 'Away' : member.status === 'dnd' ? 'Do Not Disturb' : 'Offline'), inline: true });
                embed.fields.push({ name: `Roles [${member.roles.length}]`, value: member.roles.map(s => `<@&${s}>`).join(', '), inline: true });
                if (member.game)
                    embed.description = `${(member.game.type === 0 ? 'Playing' : member.game.type === 1 ? 'Streaming' : member.game.type === 2 ? 'Listening to' : member.game.type === 3 ? 'Watching' : '')} **${member.game.name}**`;
                embed.fields.push({ name: 'Joined At', value: dateformat(member.joinedAt, 'mm/dd/yyyy hh:MM:ss TT'), inline: true });
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

            return await msg.embed(embed);
        }
    }]
});