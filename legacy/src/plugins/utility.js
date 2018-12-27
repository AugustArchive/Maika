const Plugin           = require('../structures/plugin');
const { fetch }        = require('../util/permissions');
const { stripIndents } = require('common-tags');

/**
 * Gets the permission
 * 
 * @param {import('eris').Member} member The member
 * @param {String} perm The permission
 */
const get = (member, perm) => fetch(member, perm);

module.exports = new Plugin({
    name: 'Util',
    embeded: ':gear: Utility',
    visible: true,
    enabled: true,
    commands: [
        {
            command: 'botpermissions',
            description: 'Grabs my permissions',
            aliases: ['botperms', 'bot-perms'],
            guild: true,
            run: async (bot, msg) => {
                const me = msg.guild.members.get(bot.user.id);
                return await msg.embed({
                    description: stripIndents`
                        **Create Instant Invite**: ${(get(me, 'createInstantInvite')) ? 'Yes' : 'No'}
                        **Kick Members**: ${get(me, 'createInstantInvite') ? 'Yes' : 'No'}
                        **Ban Members**: ${get(me, 'banMembers') ? 'Yes' : 'No'}
                        **Manage Channels**: ${get(me, 'manageChannels') ? 'Yes' : "No"}
                        **Manage Guild**: ${get(me, 'manageGuild') ? 'Yes' : "No"}
                        **Add Reactions**: ${get(me, 'addReactions') ? 'Yes' : 'No'}
                        **View Audit Logs**: ${get(me, 'viewAuditLogs') ? 'Yes' : 'No'}
                        **Priority Speaker**: ${get(me, 'voicePrioritySpeaker') ? 'Yes' : 'No'}
                        **Read Messages**: ${get(me, 'readMessages') ? 'Yes' : 'No'}
                        **Send Messages**: ${get(me, 'sendMessages') ? 'Yes' : 'No'}
                        **Send Text to Speech Messages**: ${get(me, 'sendTTSMessages') ? 'Yes' : 'No'}
                        **Manage Messages**: ${get(me, 'manageMessages') ? 'Yes' : 'No'}
                        **Embed Links**: ${get(me, 'embedLinks') ? 'Yes' : 'No'}
                        **Attach Files**: ${get(me, 'attachFiles') ? 'Yes' : 'No'}
                        **Read Mesage History**: ${get(me, 'readMessageHistory') ? 'Yes' : 'No'}
                        **Mention Everyone**: ${get(me, 'mentionEveryone') ? 'Yes' : 'No'}
                        **External Emojis**: ${get(me, 'externalEmojis') ? 'Yes' : 'No'}
                        **Connect to VC**: ${get(me, 'voiceConnect') ? 'Yes' : 'No'}
                        **Speak in VC**: ${get(me, 'voiceSpeak') ? 'Yes' : 'No'}
                        **Mute Members**: ${get(me, 'voiceMuteMembers') ? 'Yes' : 'No'}
                        **Deafen Members**: ${get(me, 'voiceDeafenMembers') ? 'Yes' : 'No'}
                        **Use VAD**: ${get(me, 'voiceUseVAD') ? 'Yes' : 'No'}
                        **Change Nickname**: ${get(me, 'changeNickname') ? 'Yes' : 'No'}
                        **Manage Nicknames**: ${get(me, 'manageNicknames') ? 'Yes' : 'No'}
                        **Manage Roles**: ${get(me, 'manageRoles') ? 'Yes' : 'No'}
                        **Manage Webhooks**: ${get(me, 'manageWebhooks') ? 'Yes' : 'No'}
                        **Manage Emojis**: ${get(me, 'manageEmojis') ? 'Yes' : 'No'}
                    `,
                    color: bot.color
                });
            }
        },
        {
            command: 'discrim',
            description: 'Grabs a list of any users that I know that have the same discriminator as you, senpai!',
            usage: '[discrim]',
            aliases: ['discriminator'],
            async run(bot, msg) {
                let discrim = 0000;
                let users = [];

                if (!msg.args[0])
                    discrim = msg.sender.discriminator;
                else {
                    if (isNaN(msg.args[0]) || msg.args[0].length != 4)
                        return msg.reply(`**${msg.sender.username}**: Invalid discriminator.`);
                    else
                        discrim = msg.args[0];
                }

                const userMap = bot.users.filter(u => u.discriminator === discrim);
                userMap.forEach(s => users.push(`${s.username}#${s.discriminator}`));

                return await msg.code('fix', users.join('\n'));
            }
        },
        {
            command: 'moderators',
            description: 'Gives a list of all of the moderators',
            aliases: ['mods-online', 'mods'],
            guild: true,
            async run(bot, msg) {
                const moderators = [];
                const mods = msg.guild.members.filter(m => m.permission.has('banMembers') && !m.bot);
                mods.forEach(f => moderators.push(`${f.username}#${f.discriminator} (${f.status})`));
                return await msg.code('fix', moderators.join('\n'));
            }
        }
    ]
});