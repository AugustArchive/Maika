const { Plugin, ModLogEntry } = require('../core');
const { stripIndents } = require('common-tags');

module.exports = new Plugin({
    name: 'moderation',
    description: 'Moderation tools to keep your server clean.',
    commands: [
        {
            command: 'ban',
            description: 'Bans a user from the current guild.',
            usage: '<user> [reason]',
            aliases: ['bean', 'banne'],
            guild: true,
            permissions: ['banMembers'],
            run: async(client, ctx) => {
                if (!ctx.args[0])
                    return ctx.send(`${client.emojis.ERROR} **|** Provide a user.`);

                const user = await client.rest.getUser(ctx.args[0]);
                if (user.id === ctx.sender.id)
                    return ctx.send(`${client.emojis.ERROR} **|** You cannot ban yourself but nice try.`);
                
                if (user.id === client.user.id)
                    return ctx.send(`${client.emojis.ERROR} **|** You cannot ban me! Nice try.`);

                const message = await ctx.awaitReply({
                    prompts: {
                        start: `Are you sure you wanna ban \`${user.username}#${user.discriminator}\`?`,
                        noContent: `Will not ban \`${user.username}#${user.discriminator}\`. *Your slience gave it away...*`,
                        cancelled: `Cancelled entry. Will not ban \`${user.username}#${user.discriminator}\`.`
                    },
                    filter: (msg) => msg.author.id === ctx.sender.id,
                    info: {
                        channelID: ctx.channel.id,
                        userID: ctx.sender.id,
                        timeout: 60
                    }
                });

                if ('yes' in message.content) {
                    const entry = new ModLogEntry(client, {
                        victim: user,
                        moderator: ctx.sender,
                        reason: ctx.args[1]? ctx.args.slice(1).join(' '): 'No reason provided.',
                        guild: ctx.guild,
                        action: 'BAN'
                    });
    
                    try {
                        ctx.dm(stripIndents`
                            :pencil: **You been banned from ${ctx.guild.name}!**
                            Reason: ${ctx.args[1]? ctx.args.slice(1).join(' '): 'No reason provided.'}
                            Contact \`${ctx.sender.username}#${ctx.sender.discriminator}\` to get *maybe* unbanned.
                        `, user);
    
                        await ctx.guild.banMember(user.id, 7, ctx.args[1]? ctx.args.slice(1).join(' '): 'No reason provided.');
                        entry.post();
                        await message.delete();
                        return ctx.send(`${client.emojis.OK} **|** Successfully banned <@${user.id}>.`);
                    } catch(ex) {
                        await ctx.guild.banMember(user.id, 7, ctx.args[1]? ctx.args.slice(1).join(' '): 'No reason provided.');
                        entry.post();
                        await message.delete();
                        return ctx.send(`${client.emojis.OK} **|** Successfully banned <@${user.id}>.`);
                    }
                } else if ('no' in message.content) {
                    await message.delete();
                    ctx.send(`${client.emojis.OK} **|** OK, will not ban the user.`);
                }
            }
        },
        {
            command: 'dehoist',
            description: 'Dehoists a user. (Hoisting is when a user\'s nickname is like `!Maika` for an example)',
            aliases: ['decancer'],
            guild: true,
            permissions: ['banMembers'],
            run: async (client, ctx) => {
                const hoistSearcher = /^[^\w\s\d]/;
                const members = ctx.guild.members.filter((mem) => {
                    return hoistSearcher.exec(mem.nick || mem.username);
                });

                const promises = [];
                const failed = 0;
                for (const member of members) {
                    promises.push(
                        member.edit({ nick: 'hoister' })
                            .catch(() => failed++)
                    );
                }

                if (!promises[0])
                    return ctx.send(`${client.emojis.INFO} **|** No names has "hoister" related names.`);

                const message = await ctx.awaitReply({
                    filter: (msg) => msg.author.id === ctx.sender.id,
                    prompts: {
                        start: `Are you sure you wanna dehoist ${members.length - 1} members?`,
                        noContent: `Your slience says you don't wanna dehoist ${members.length - 1} members`,
                        cancelled: `Will not dehoist ${members.length - 1} members`
                    },
                    info: {
                        channelID: ctx.channel.id,
                        userID: ctx.sender.id,
                        timeout: 60
                    }
                });

                if (['yes'].includes(message.content)) {
                    await message.delete();
                    await Promise.all(promises);
                    return ctx.raw(`${client.emojis.OK} **|** Dehoisting Results:`, {
                        description: stripIndents`
                            **Successful**: ${members.length - failed}
                            **Failure**: ${failed}
                        `,
                        color: client.color
                    });
                }
                
                if (['no'].includes(message.content)) {
                    await message.delete();
                    return ctx.send(`${client.emojis.OK} **|** Will not dehoist ${members.length - 1} members.`);
                }
            }
        },
        {
            command: 'kick',
            description: 'Kick a user from the current guild',
            usage: '<user> [reason]',
            aliases: ['boot'],
            guild: true,
            permissions: ['kickMembers'],
            run: async(client, ctx) => {
                if (!ctx.args[0])
                    return ctx.send(`${client.emojis.ERROR} **|** Missing \`<user>\` argument.`);

                const user = await client.rest.getUser(ctx.args[0]);
                if (user.id === ctx.sender.id)
                    return ctx.send(`${client.emojis.ERROR} **|** You cannot kick yourself but nice try.`);
                    
                if (user.id === client.user.id)
                    return ctx.send(`${client.emojis.ERROR} **|** You cannot kick me! Nice try.`);
    
                const message = await ctx.awaitReply({
                    prompts: {
                        start: `Are you sure you wanna kick \`${user.username}#${user.discriminator}\`?`,
                        noContent: `Will not kick \`${user.username}#${user.discriminator}\`. *Your slience gave it away...*`,
                        cancelled: `Cancelled entry. Will not kick \`${user.username}#${user.discriminator}\`.`
                    },
                    filter: (msg) => msg.author.id === ctx.sender.id,
                    info: {
                        channelID: ctx.channel.id,
                        userID: ctx.sender.id,
                        timeout: 60
                    }
                });
    
                if (['yes'].includes(message.content)) {
                    const entry = new ModLogEntry(client, {
                        victim: user,
                        moderator: ctx.sender,
                        reason: ctx.args[1]? ctx.args.slice(1).join(' '): 'No reason provided.',
                        guild: ctx.guild,
                        action: 'KICK'
                    });
        
                    try {
                        ctx.dm(stripIndents`
                                :pencil: **You been kicked from ${ctx.guild.name}!**
                                Reason: ${ctx.args[1]? ctx.args.slice(1).join(' '): 'No reason provided.'}
                                You can rejoin the server but obey the rules.
                            `, user);
        
                        await ctx.guild.kickMember(user.id, 7, ctx.args[1]? ctx.args.slice(1).join(' '): 'No reason provided.');
                        entry.post();
                        await message.delete();
                        return ctx.send(`${client.emojis.OK} **|** Successfully kicked <@${user.id}>.`);
                    } catch(ex) {
                        await ctx.guild.kickMember(user.id, 7, ctx.args[1]? ctx.args.slice(1).join(' '): 'No reason provided.');
                        entry.post();
                        await message.delete();
                        return ctx.send(`${client.emojis.OK} **|** Successfully kicked <@${user.id}>.`);
                    }
                } 
                    
                if (['no'].includes(message.content)) {
                    await message.delete();
                    ctx.send(`${client.emojis.OK} **|** OK, will not kick the user.`);
                }
            }
        },
        {
            command: 'lock',
            description: 'Locks the channel if spam occurs',
            usage: '[channel] [reason]',
            aliases: ['lock-channel'],
            guild: true,
            permissions: ['manageChannels'],
            run: async(client, ctx) => {
                const channel = await client.rest.getChannel(ctx.args.length > 0? ctx.args.join(' '): ctx.channel.id);
                if (!channel)
                    return ctx.send(`${client.emojis.WARN} **|** Channel doesn't exist?`);

                if (channel.type === 0)
                    return ctx.send(`${client.emojis.ERROR} **|** Provide a text channel.`);

                let previous = channel.permissionOverwrites.has(ctx.guild.id)? channel.permissionOverwrites.get(ctx.guild.id): { json: {}, allow: 0, deny: 0 };
                if (previous.json.sendMessages === false)
                    return ctx.send(`${client.emojis.WARN} **|** Channel \`#${channel.name}\` is already locked. :|`);

                await channel.createMessage(`**This channel is being locked... (${ctx.args[1]? ctx.args.slice(1).join(" "): 'No reason provided.'})**`);
                channel.editPermission(ctx.args.id, previous.allow & ~2048, pervious.deny | 2048, 'role', ctx.args[1]? ctx.args.slice(1).join(" "): 'No reason provided.')
                    .then(() => ctx.send(`${client.emojis.OK} **|** Channel is now locked, no more normies.`))
                    .catch(() => ctx.send(`${client.emojis.WARN} **|** Hello, I don't have permission to lock \`${channel.name}\`.`));
            }
        },
        {
            command: 'unban',
            description: 'Unban the user',
            usage: '<user> [reason]',
            aliases: ['unbanne'],
            guild: true,
            permissions: ['banMembers'],
            run: async(client, ctx) => {
                if (!ctx.args[0])
                    return ctx.send(`${client.emojis.ERROR} **|** You must provide a user ID.`);

                ctx
                    .guild
                    .getBan(ctx.args[0])
                    .then((ban) => {
                        ctx
                            .guild
                            .unbanMember(ban.user.id, ctx.args[1]? ctx.args.slice(1).join(" "): 'No reason provided.')
                            .then(() => ctx.send(`${client.emojis['OK']} **|** \`${ban.user.username}#${ban.user.discriminator}\` was unbanned from the server.`))
                            .catch(() => ctx.send(`${client.emojis['ERROR']} **|** Unable to unbanned from the server, make sure I have the right permissions.`));
                    }).catch((error) => {
                        if (error.message.toString() === 'DiscordRESTError [10026]: Unknown Ban')
                            return ctx.send(`${client.emojis['ERROR']} **|** User is not banned.`);

                        return ctx.send(`${client.emojis['ERROR']} **|** Couldn't get the user's ban, provide a valid Discord user id.`);
                    });
            }
        },
        {
            command: 'unlock',
            description: 'Unlock the channel if the channel was locked.',
            usage: '<channel> [reason]',
            guild: true,
            permissions: ['manageChannels'],
            run: async(client, ctx) => {
                if (!ctx.args[0])
                    return ctx.send(`${client.emojis['ERROR']} **|** Provide a channel ID that is locked.`);

                const channel = await client.rest.getChannel(ctx.args[0]);
                if (!channel)
                    return ctx.send(`${client.emojis.WARN} **|** Channel doesn't exist?`);
    
                if (channel.type === 0)
                    return ctx.send(`${client.emojis.ERROR} **|** Provide a text channel.`);
    
                let previous = channel.permissionOverwrites.has(ctx.guild.id)? channel.permissionOverwrites.get(ctx.guild.id): { json: {}, allow: 0, deny: 0 };
                if (previous.json.sendMessages === true)
                    return ctx.send(`${client.emojis.WARN} **|** Channel \`#${channel.name}\` is already unlocked. :|`);

                channel.editPermission(ctx.guild.id, previous.allow | 2048, previous.deny, 'role')
                    .then(() => ctx.send(`${client.emojis['OK']} **|** Successfully unlocked the channel.`))
                    .catch(() => ctx.send(`${client.emojis['ERROR']} **|** Do I have permissions to unlock the channel?`));
            }
        }
    ]
});