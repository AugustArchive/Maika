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

                const response = await ctx.awaitReply({
                    content: `Are you sure you wanna ban ${user.username}#${user.discriminator}?`,
                    filter: (msg) => msg.author.id === ctx.sender.id,
                    info: {
                        channelID: ctx.channel.id,
                        userID: ctx.sender.id,
                        timeout: 60
                    }
                });

                if (!response.content)
                    return response.edit(`${client.emojis.OK} **|** Will not ban \`${user.username}#${user.discriminator}\`. *Your slience gave it away...*`);
                if (['cancel'].includes(response.content))
                    return response.edit(`${client.emojis.OK} **|** Cancelled entry. Will not ban \`${user.username}#${user.discriminator}\`.`);

                const entry = new ModLogEntry(client, {
                    victim: user,
                    moderator: ctx.sender,
                    reason: ctx.args[1]? ctx.args.slice(0).join(' '): 'No reason provided.',
                    guild: ctx.guild,
                    action: 'BAN'
                });

                try {
                    ctx.dm(stripIndents`
                        :pencil: **You been banned from ${ctx.guild.name}!**
                        Reason: ${ctx.args[1]? ctx.args.slice(0).join(' '): 'No reason provided.'}
                        Contact \`${ctx.sender.username}#${ctx.sender.discriminator}\` to get *maybe* unbanned.
                    `, user);

                    await ctx.guild.banMember(user.id, 7, ctx.args[1]? ctx.args.slice(0).join(' '): 'No reason provided.');
                    entry.post();
                } catch(ex) {
                    await ctx.guild.banMember(user.id, 7, ctx.args[1]? ctx.args.slice(0).join(' '): 'No reason provided.');
                    entry.post();
                }
            }
        }
    ]
});