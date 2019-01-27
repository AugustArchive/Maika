const { stripIndents } = require('common-tags');
const Permissions = require('../util/permissions');
const { Linter } = require('eslint');
const { Plugin } = require('../core');

module.exports = new Plugin({
    name: 'util',
    description: 'Very useful commands',
    commands: [
        {
            command: 'botperms',
            description: (client) => `Checks ${client.user.username}'s permissions in a channel.`,
            aliases: ['botpermissions'],
            run: (client, ctx) => {
                const me = ctx.guild.members.get(client.user.id);
                return ctx.embed({
                    title: `[ ${client.user.username}'s Permissions ]`,
                    description: stripIndents`
                        **Create Instant Invite**: ${Permissions.has(me, 'createInstantInvite')? 'Yes': 'No'}
                        **Kick Members**: ${Permissions.has(me, 'kickMembers')? 'Yes': 'No'}
                        **Ban Members**: ${Permissions.has(me, 'banMembers')? 'Yes': 'No'}
                        **Manage Channels**: ${Permissions.has(me, 'manageChannels')? 'Yes': "No"}
                        **Manage Guild**: ${Permissions.has(me, 'manageGuild')? 'Yes': "No"}
                        **Add Reactions**: ${Permissions.has(me, 'addReactions')? 'Yes': 'No'}
                        **View Audit Logs**: ${Permissions.has(me, 'viewAuditLogs')? 'Yes': 'No'}
                        **Priority Speaker**: ${Permissions.has(me, 'voicePrioritySpeaker')? 'Yes': 'No'}
                        **Read Messages**: ${Permissions.has(me, 'readMessages')? 'Yes': 'No'}
                        **Send Messages**: ${Permissions.has(me, 'sendMessages')? 'Yes': 'No'}
                        **Send Text to Speech Messages**: ${Permissions.has(me, 'sendTTSMessages')? 'Yes': 'No'}
                        **Manage Messages**: ${Permissions.has(me, 'manageMessages')? 'Yes': 'No'}
                        **Embed Links**: ${Permissions.has(me, 'embedLinks')? 'Yes': 'No'}
                        **Attach Files**: ${Permissions.has(me, 'attachFiles')? 'Yes': 'No'}
                        **Read Mesage History**: ${Permissions.has(me, 'readMessageHistory')? 'Yes': 'No'}
                        **Mention Everyone**: ${Permissions.has(me, 'mentionEveryone')? 'Yes': 'No'}
                        **External Emojis**: ${Permissions.has(me, 'externalEmojis')? 'Yes': 'No'}
                        **Connect to VC**: ${Permissions.has(me, 'voiceConnect')? 'Yes': 'No'}
                        **Speak in VC**: ${Permissions.has(me, 'voiceSpeak')? 'Yes': 'No'}
                        **Mute Members**: ${Permissions.has(me, 'voiceMuteMembers')? 'Yes': 'No'}
                        **Deafen Members**: ${Permissions.has(me, 'voiceDeafenMembers')? 'Yes': 'No'}
                        **Use VAD**: ${Permissions.has(me, 'voiceUseVAD')? 'Yes': 'No'}
                        **Change Nickname**: ${Permissions.has(me, 'changeNickname')? 'Yes': 'No'}
                        **Manage Nicknames**: ${Permissions.has(me, 'manageNicknames')? 'Yes': 'No'}
                        **Manage Roles**: ${Permissions.has(me, 'manageRoles')? 'Yes': 'No'}
                        **Manage Webhooks**: ${Permissions.has(me, 'manageWebhooks')? 'Yes': 'No'}
                        **Manage Emojis**: ${Permissions.has(me, 'manageEmojis')? 'Yes': 'No'}
                    `,
                    color: client.color,
                    footer: { text: client.getFooter() }
                });
            }
        },
        {
            command: 'choose',
            description: (client) => `Let ${client.user.username} choose to do what`,
            usage: '<answer1 | answer2...>',
            aliases: ['pick'],
            run: (client, ctx) => {
                if (!ctx.args[0])
                    return ctx.send(`${client.emojis.ERROR} **|** Missing \`<answer1 | answer2...>\` argument.`);

                if (!ctx.args.join('').includes('|'))
                    return ctx.send(`${client.emojis.ERROR} **|** Split the choices with a \`|\`.`);

                let chosen = ctx
                    .args
                    .join(' ')
                    .split('|')
                    .filter(x => x && x != ' ');

                return ctx.send(`${client.emojis.INFO} **|** I choose **${chosen[Math.floor(Math.random() * chosen.length)].trim()}**.`);
            }
        },
        {
            command: 'discrim',
            description: 'Searches up a discriminator of your choice and lists the users who have it.',
            usage: '<discrim>',
            aliases: ['discriminator', 'discrim-info'],
            run: (client, ctx) => {
                let discrim = 0000;
                let users = [];

                if (!ctx.args[0])
                    discrim = ctx.sender.discriminator;
                else {
                    if (isNaN(ctx.args[0]) || ctx.args[0].length != 4)
                        return ctx.send(`${client.emojis.ERROR} **|** Invalid discriminator.`);
                    
                    discrim = ctx.args[0];
                }

                const map = client.users.filter(u => u.discriminator === discrim);
                map.forEach(user => users.push(`${user.username}#**${user.discriminator}**`));

                return ctx.embed({
                    description: stripIndents`
                        **Users who have the #${discrim} discriminator**:

                        ${users.join('\n')}
                    `,
                    color: client.color,
                    footer: { text: client.getFooter() }
                });     
            }
        },
        {
            command: 'eslint',
            description: 'Lint any JavaScript code and will be successful or not.',
            usage: '<script>',
            aliases: ['lint-code', 'lint'],
            async run(client, ctx) {
                if (!ctx.args[0])
                    return ctx.send(`${client.emojis.ERROR} **|** Missing \`<script>\` argument.`);

                const message = await ctx.send(`${client.emojis.INFO} **|** Now linting script...`);
                const linter = new Linter();
                const input = ctx.args.slice(0).join(' ');
                const output = linter.verify(input, {
                    env: {
                        es6: true,
                        node: true
                    },
                    extends: 'eslint:recommended',
                    parserOptions: {
                        sourceType: 'module',
                        ecmaVersion: 2018
                    }
                });

                if (output.length < 1)
                    return message.edit(`${client.emojis.YAY} **|** No errors occured.`);
                
                await message.delete();
                ctx.raw(`${client.emojis.WARNING} **|** Errors occured; view embed for results:`, {
                    title: 'ESLint Results - Error',
                    description: stripIndents`
                        **An error occured while linting the code.**

                        **Message**: ${output[0].message}
                        **Location**: Line ${output[0].line}, Column ${output[0].column}
                        **Is Fatal**: ${output[0].fatal? 'Yes': 'No'}
                    `,
                    color: client.color,
                    footer: { text: client.getFooter() }
                });
            }
        },
        {
            command: 'hti',
            description: 'Convert hexadecimals into integers',
            usage: '<#hex>',
            aliases: ['hextoint', 'htoi'],
            run(client, ctx) {
                if (!ctx.args[0])
                    return ctx.send(`${client.emojis.ERROR} **|** Missing \`<#hex>\` argument.`);

                const int = parseInt(ctx.args.join('').replace('#', ''), 16);
                return ctx.send(`${client.emojis.INFO} **|** Hexadecimal \`${ctx.args.join('')}\` returns \`${int}\`.`);
            }
        },
        {
            command: 'ith',
            description: 'Convert integers to hexadecimals',
            usage: '<int>',
            aliases: ['inttohex', 'itoh'],
            run(client, ctx) {
                if (!ctx.args[0])
                    return ctx.send(`${client.emojis.ERROR} **|** Missing \`<int>\` argument.`);

                const hex = parseInt(ctx.args.join('')).toString(16);
                return ctx.send(`${client.emojis.INFO} **|** Integer \`${ctx.args.join('')}\` returns \`#${hex}\`.`);
            }
        },
        {
            command: 'moderators',
            description: 'Grabs a list of online, offline, away, or dnd moderators.',
            aliases: ['list-mods', 'mods'],
            async run(client, ctx) {
                const message = await ctx.send(`${client.emojis.INFO} **|** Fetching moderators...`);
                const started = Date.now();

                // Check for "online" moderators
                let online = [];
                ctx
                    .guild
                    .members
                    .filter(s => s.status === 'online' && s.permission.has('banMembers') && !s.bot)
                    .forEach(mem => online.push(`<:online:457289010037915660> **${mem.user.username}#${mem.user.discriminator}**`));

                // Check for "away" moderators
                let away = [];
                ctx
                    .guild
                    .members
                    .filter(s => s.status === 'idle' && s.permission.has('banMembers') && !s.bot)
                    .forEach(mem => away.push(`<:away:457289009912217612> **${mem.user.username}#${mem.user.discriminator}**`));
                    
                // Check for "do not disturb" moderators
                let dnd = [];
                ctx
                    .guild
                    .members
                    .filter(s => s.status === 'dnd' && s.permission.has('banMembers') && !s.bot)
                    .forEach(mem => dnd.push(`<:dnd:457289032330772502> **${mem.user.username}#${mem.user.discriminator}**`));

                // Check for "offline" moderators
                let offline = [];
                ctx
                    .guild
                    .members
                    .filter(s => s.status === 'offline' && s.permission.has('banMembers') && !s.bot)
                    .forEach(mem => offline.push(`<:offline:457289010084184066> **${mem.user.username}#${mem.user.discriminator}**`));

                // Finish
                await message.delete();
                return ctx.embed({
                    title: `Availiable moderators in ${ctx.guild.name}:`,
                    description: stripIndents`
                        **Online**:
                        ${online.join('\n')}

                        **Away**:
                        ${away.join('\n')}

                        **Do Not Disturb**:
                        ${dnd.join('\n')}

                        **Offline**:
                        ${offline.join('\n')}
                    `,
                    color: client.color,
                    footer: { text: `Took ${Date.now() - started}ms to gather data | ${client.getFooter()}`}
                });
            }
        },
        {
            command: 'permissions',
            description: 'Grabs your permissions.',
            aliases: ['myperms', 'perms'],
            run: (client, ctx) => {
                const me = ctx.guild.members.get(ctx.sender.id);
                return ctx.embed({
                    title: `[ ${me.user.username}'s Permissions ]`,
                    description: stripIndents`
                        **Create Instant Invite**: ${Permissions.has(me, 'createInstantInvite')? 'Yes': 'No'}
                        **Kick Members**: ${Permissions.has(me, 'kickMembers')? 'Yes': 'No'}
                        **Ban Members**: ${Permissions.has(me, 'banMembers')? 'Yes': 'No'}
                        **Manage Channels**: ${Permissions.has(me, 'manageChannels')? 'Yes': "No"}
                        **Manage Guild**: ${Permissions.has(me, 'manageGuild')? 'Yes': "No"}
                        **Add Reactions**: ${Permissions.has(me, 'addReactions')? 'Yes': 'No'}
                        **View Audit Logs**: ${Permissions.has(me, 'viewAuditLogs')? 'Yes': 'No'}
                        **Priority Speaker**: ${Permissions.has(me, 'voicePrioritySpeaker')? 'Yes': 'No'}
                        **Read Messages**: ${Permissions.has(me, 'readMessages')? 'Yes': 'No'}
                        **Send Messages**: ${Permissions.has(me, 'sendMessages')? 'Yes': 'No'}
                        **Send Text to Speech Messages**: ${Permissions.has(me, 'sendTTSMessages')? 'Yes': 'No'}
                        **Manage Messages**: ${Permissions.has(me, 'manageMessages')? 'Yes': 'No'}
                        **Embed Links**: ${Permissions.has(me, 'embedLinks')? 'Yes': 'No'}
                        **Attach Files**: ${Permissions.has(me, 'attachFiles')? 'Yes': 'No'}
                        **Read Mesage History**: ${Permissions.has(me, 'readMessageHistory')? 'Yes': 'No'}
                        **Mention Everyone**: ${Permissions.has(me, 'mentionEveryone')? 'Yes': 'No'}
                        **External Emojis**: ${Permissions.has(me, 'externalEmojis')? 'Yes': 'No'}
                        **Connect to VC**: ${Permissions.has(me, 'voiceConnect')? 'Yes': 'No'}
                        **Speak in VC**: ${Permissions.has(me, 'voiceSpeak')? 'Yes': 'No'}
                        **Mute Members**: ${Permissions.has(me, 'voiceMuteMembers')? 'Yes': 'No'}
                        **Deafen Members**: ${Permissions.has(me, 'voiceDeafenMembers')? 'Yes': 'No'}
                        **Use VAD**: ${Permissions.has(me, 'voiceUseVAD')? 'Yes': 'No'}
                        **Change Nickname**: ${Permissions.has(me, 'changeNickname')? 'Yes': 'No'}
                        **Manage Nicknames**: ${Permissions.has(me, 'manageNicknames')? 'Yes': 'No'}
                        **Manage Roles**: ${Permissions.has(me, 'manageRoles')? 'Yes': 'No'}
                        **Manage Webhooks**: ${Permissions.has(me, 'manageWebhooks')? 'Yes': 'No'}
                        **Manage Emojis**: ${Permissions.has(me, 'manageEmojis')? 'Yes': 'No'}
                    `,
                    color: client.color,
                    footer: { text: client.getFooter() }
                });
            }
        },
        {
            command: 'suggest',
            description: "Suggests a random plugin or command you never tried.",
            usage: '[--plugin | --command]',
            aliases: ['suggest-plugin', 'suggest-command'],
            run: (client, ctx) => {
                if (!ctx.args[0])
                    return ctx.raw(`${client.emojis.INFO} **|** \`suggest\` subcommands:`, {
                        description: stripIndents`
                            \`--plugin\`: Suggests a random plugin.
                            \`--command\`: Suggests a random command.
                        `,
                        color: client.color,
                        footer: { text: client.getFooter() }
                    });

                if (!['--plugin', '--command'].includes(ctx.args[0]))
                    return ctx.raw(`${client.emojis.INFO} **|** \`suggest\` subcommands:`, {
                        description: stripIndents`
                            \`--plugin\`: Suggests a random plugin.
                            \`--command\`: Suggests a random command.
                        `,
                        color: client.color,
                        footer: { text: client.getFooter() }
                    });

                switch (ctx.args[0]) {
                    case '--plugin': {
                        const randomized = client.manager.plugins.random();
                        ctx.send(stripIndents`
                            ${client.emojis.INFO} **|** Have you ever used the \`${randomized.name}\` plugin?
                            *${randomized.description}*

                            Has ${randomized.commands.size} commands inside of the \`${randomized.name}\` plugin.
                        `);
                    } break;
                    case '--command': {
                        const randomizedPlugin = client.manager.plugins.random();
                        const randomizedCommand = randomizedPlugin.commands.random();

                        ctx.send(stripIndents`
                            ${client.emojis.INFO} **|** Have you ever used the \`${randomizedCommand.command}\` command?
                            *${typeof randomizedCommand.description === 'function'? randomizedCommand.description(client): randomizedCommand.description}*

                            In the \`${randomizedPlugin.name}\` plugin.
                        `);
                    } break;
                }
            }
        }
    ]
});