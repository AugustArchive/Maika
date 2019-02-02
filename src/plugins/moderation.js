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
    
                        await ctx.guild.banMember(user.id, 7, ctx.args[1]? ctx.args.slice(0).join(' '): 'No reason provided.');
                        entry.post();
                        await message.delete();
                        return ctx.send(`${client.emojis.OK} **|** Successfully banned <@${user.id}>.`);
                    } catch(ex) {
                        await ctx.guild.banMember(user.id, 7, ctx.args[1]? ctx.args.slice(0).join(' '): 'No reason provided.');
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
                const members = ctx.guild.members.filter((mem) => hoistSearcher.exec(mem.nick || mem.username));
                if (!members)
                    return ctx.send(`${client.emojis.INFO} **|** No users needed to be dehoisted.`);

                const promises = [];
                const failed = 0;
                for (const member of members) {
                    promises.push(
                        member.edit({ nick: 'hoister' })
                            .catch(() => failed++)
                    );
                }

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
                    await message.edit(`${client.emojis.OK} **|** Dehoisting ${members.length - 1} users... (May take a while; depends on server size)`);
                    await Promise.all(promises);
                    await message.delete();
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
        
                        await ctx.guild.banMember(user.id, 7, ctx.args[1]? ctx.args.slice(0).join(' '): 'No reason provided.');
                        entry.post();
                        await message.delete();
                        return ctx.send(`${client.emojis.OK} **|** Successfully kicked <@${user.id}>.`);
                    } catch(ex) {
                        await ctx.guild.banMember(user.id, 7, ctx.args[1]? ctx.args.slice(0).join(' '): 'No reason provided.');
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
            command: 'mute',
            description: 'Mutes the user if their being too loud for my ears.',
            usage: '<user> [reason]',
            aliases: ['mute-member'],
            guild: true,
            permissions: ['manageChannels'],
            run: async(client, ctx) => {
                if (!ctx.args[0])
                    return ctx.send(`${client.emojis.ERROR} **|** Provide a user.`);

                const user = await client.rest.getUser(ctx.args[0]);
                if (user.id === ctx.sender.id)
                    return ctx.send(`${client.emojis.ERROR} **|** You cannot kick yourself but nice try.`);
                    
                if (user.id === client.user.id)
                    return ctx.send(`${client.emojis.ERROR} **|** You cannot kick me! Nice try.`);

                const message = await ctx.awaitReply({
                    prompts: {
                        start: `Are you sure you wanna mute \`${user.username}#${user.discriminator}\`?`,
                        noContent: `Will not mute \`${user.username}#${user.discriminator}\`. *Your slice gave it away..*`,
                        cancelled: `Cancelled entry. Will not mute \`${user.username}#${user.discriminator}\`.`
                    },
                    filter: (mes) => mes.author.id === ctx.sender.id,
                    info: {
                        channelID: ctx.channel.id,
                        userID: ctx.sender.id,
                        timeout: 60
                    }
                });

                if ('yes'.includes(message.content)) {
                    const entry = new ModLogEntry(client, {
                        action: 'MUTE',
                        victim: user,
                        moderator: ctx.sender,
                        reason: ctx.args[1]? ctx.args.slice(1).join(' '): 'No reason provided.',
                        guild: ctx.guild
                    });


                }
            }
        }
    ]
});