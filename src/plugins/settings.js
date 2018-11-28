const Plugin           = require('../structures/plugin');
const { stripIndents } = require('common-tags');

module.exports = new Plugin({
    name: 'Settings',
    embeded: ':gear: Settings',
    visible: true,
    enabled: true,
    commands: [
        {
            command: 'prefix',
            description: 'Change\'s the guild prefix or shows the current prefix',
            usage: '[prefix]',
            aliases: ['set-prefix', 'setprefix'],
            run: async (msg) => {
                const guild = await msg.bot.r.table('guilds').get(msg.guild.id).run();
                if (!msg.args[0])
                    return msg.reply(`**${msg.sender.username}**: The current prefix for \`${msg.guild.name}\` is: \`${guild.prefix}<command>\`.`);

                const member = msg.guild.members.get(msg.sender.id);
                if (!member.permission.has('manageGuild') && !msg.bot.owners.includes(msg.sender.id))
                    return msg.reply(`**${msg.sender.username}**: You must have the \`manageGuild\` permission to change the prefix!`);

                let prefix = msg.args[0];
                if (prefix.length > 15)
                    return msg.reply(`**${msg.sender.username}**: The prefix has to be lower or equal to 15.`);
                if (prefix.includes('@everyone') || prefix.includes('@here'))
                    return msg.reply(`**${msg.sender.username}**: The prefix cannot be everyone/here mentions.`);

                await msg.bot.r.table('guilds').get(msg.guild.id).update({ prefix }).run();
                return await msg.reply(`**${msg.sender.username}**: The prefix has been set to \`${prefix}\`!`);
            }
        },
        {
            command: 'mod-log',
            description: 'The modlog system',
            usage: '<"set"|"reset"|"status"> <"enabled"|"channel"> <channelID|bool>',
            aliases: ['modlog'],
            run: async (msg) => {
                const guild = await msg.bot.r.table('guilds').get(msg.guild.id).run();
                if (!msg.args[0])
                    return msg.reply(`**${msg.sender.username}**: You must provide a subcommand. (\`set\` | \`reset\` | \`status\`)`);
                if (!['status', 'reset', 'set'].includes(msg.args[0]))
                    return msg.reply(`**${msg.sender.username}**: Invalid subcommand.`);
                const member = msg.guild.members.get(msg.sender.id);
                if (!member.permission.has('manageGuild') && !msg.bot.owners.includes(msg.sender.id))
                    return msg.reply(`**${msg.sender.username}**: You must have the \`manageGuild\` permission to change the modlog system.`);

                switch (msg.args[0]) {
                    case "set": {
                        if (!msg.args[1])
                            return msg.reply(`**${msg.sender.username}**: You must provide a subsubcommand. (\`enabled\` | \`channel\`)`);
                        if (!msg.args[2])
                            return msg.reply(`**${msg.sender.username}**: You must provide a value.`);
                        if (!['enabled', 'channel'].includes(msg.args[1]))
                            return msg.reply(`**${msg.sender.username}**: Invalid subsubcommand.`);

                        switch (msg.args[1]) {
                            case "enabled": {
                                let enabled;
                                if (msg.args[2].toLowerCase() === 'true')
                                    enabled = true;
                                else
                                    enabled = false;

                                await msg.bot.r.table('guilds').get(msg.guild.id).update({ modlog: { enabled } }).run();
                                msg.reply(`**${msg.sender.username}**: I have ${(enabled) ? 'enabled' : 'disabled'} the mod-log feature.`);
                            } break;
                            case "channel": {
                                const channel = await msg.bot.finder.channel(msg.args[2], msg.guild);
                                if (!channel || channel.type === 2 || channel.type === 4) // If no channel was found or the channel is a voice or category channel
                                    return msg.reply(`**${msg.sender.username}**: No channel was found or it's not a text channel!`);

                                await msg.bot.r.table('guilds').get(msg.guild.id).update({ modlog: { channelID: channel.id } }).run();
                                msg.reply(`**${msg.sender.username}**: Channel <#${channel.id}> is now where the mod-log embeds will go to!`);
                            } break;
                        }
                    } break;
                    case "reset": {
                        if (!msg.args[1])
                            return msg.reply(`**${msg.sender.username}**: You must provide a subsubcommand. (\`enabled\` | \`channel\`)`);
                        if (!['enabled', 'channel'].includes(msg.args[1]))
                            return msg.reply(`**${msg.sender.username}**: Invalid subsubcommand.`);

                        switch (msg.args[1]) {
                            case "channel": {
                                await msg.bot.r.table('guilds').get(msg.guild.id).update({ modlog: { channelID: null } }).run();
                                msg.reply(`**${msg.sender.username}**: Ok, I have resetted the mod-log channel!`);
                            } break;
                            case "enabled": {
                                await msg.bot.r.table('guilds').get(msg.guild.id).update({ modlog: { enabled: false } }).run();
                                msg.reply(`**${msg.sender.username}**: Ok, I have resetted the mod-logging!`);
                            } break;
                        }
                    } break;
                    case "status": {
                        msg.code('ini', stripIndents`
                            # Mod Log Settings for ${msg.guild.name}
                            [modlog.enabled]: ${guild.modlog.enabled ? 'Yes' : 'No'}
                            [modlog.channel]: ${guild.modlog.channelID === null ? 'Hasn\'t been set' : guild.modlog.channelID}
                        `);
                    } break;
                }
            }
        },
        {
            command: 'logging',
            description: 'The logging feature',
            usage: '<"set"|"reset"|"view"> <"enabled"|"channel"> <channelID|bool>',
            aliases: ['logs'],
            run: async(msg) => {
                const guild = await msg.bot.r.table('guilds').get(msg.guild.id).run();
                if (!msg.args[0])
                    return msg.reply(`**${msg.sender.username}**: You must provide a subcommand. (\`set\` | \`reset\` | \`status\`)`);
                if (!['status', 'reset', 'set'].includes(msg.args[0]))
                    return msg.reply(`**${msg.sender.username}**: Invalid subcommand.`);
                const member = msg.guild.members.get(msg.sender.id);
                if (!member.permission.has('manageGuild') && !msg.bot.owners.includes(msg.sender.id))
                    return msg.reply(`**${msg.sender.username}**: You must have the \`manageGuild\` permission to change the logging system.`);

                switch (msg.args[0]) {
                    case "set": {
                        if (!msg.args[1])
                            return msg.reply(`**${msg.sender.username}**: You must provide a subsubcommand. (\`enabled\` | \`channel\`)`);
                        if (!msg.args[2])
                            return msg.reply(`**${msg.sender.username}**: You must provide a value.`);
                        if (!['enabled', 'channel'].includes(msg.args[1]))
                            return msg.reply(`**${msg.sender.username}**: Invalid subsubcommand.`);

                        switch (msg.args[1]) {
                            case "enabled": {
                                let enabled;
                                if (msg.args[2].toLowerCase() === 'true')
                                    enabled = true;
                                else
                                    enabled = false;

                                await msg.bot.r.table('guilds').get(msg.guild.id).update({ logging: { enabled } }).run();
                                msg.reply(`**${msg.sender.username}**: I have ${(enabled) ? 'enabled' : 'disabled'} the logging feature.`);
                            } break;
                            case "channel": {
                                const channel = await msg.bot.finder.channel(msg.args[2], msg.guild);
                                if (!channel || channel.type === 2 || channel.type === 4) // If no channel was found or the channel is a voice or category channel
                                    return msg.reply(`**${msg.sender.username}**: No channel was found or it's not a text channel!`);

                                await msg.bot.r.table('guilds').get(msg.guild.id).update({ logging: { channelID: channel.id } }).run();
                                msg.reply(`**${msg.sender.username}**: Channel <#${channel.id}> is now where the logging embeds will go to!`);
                            } break;
                        }
                    } break;
                    case "reset": {
                        if (!msg.args[1])
                            return msg.reply(`**${msg.sender.username}**: You must provide a subsubcommand. (\`enabled\` | \`channel\`)`);
                        if (!['enabled', 'channel'].includes(msg.args[1]))
                            return msg.reply(`**${msg.sender.username}**: Invalid subsubcommand.`);

                        switch (msg.args[1]) {
                            case "channel": {
                                await msg.bot.r.table('guilds').get(msg.guild.id).update({ logging: { channelID: null } }).run();
                                msg.reply(`**${msg.sender.username}**: Ok, I have resetted the logging channel!`);
                            } break;
                            case "enabled": {
                                await msg.bot.r.table('guilds').get(msg.guild.id).update({ logging: { enabled: false } }).run();
                                msg.reply(`**${msg.sender.username}**: Ok, I have resetted the logging feature!`);
                            } break;
                        }
                    } break;
                    case "status": {
                        msg.code('ini', stripIndents`
                            # Logging Settings for ${msg.guild.name}
                            [logging.enabled]: ${guild.logging.enabled ? 'Yes' : 'No'}
                            [logging.channel]: ${guild.logging.channelID === null ? 'Hasn\'t been set' : guild.logging.channelID}
                        `);
                    } break;
                }
            }
        }
    ]
});