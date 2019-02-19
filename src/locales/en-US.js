const { Language } = require('@maika.xyz/kotori');

module.exports = class EnglishUSLocale extends Language {
    constructor(client) {
        super(client, {
            code: 'en-US',
            full: 'English (United States)',
            flag: ':flag_us:',
            translator: '280158289667555328',
            completion: 100,
            language: {
                // Error-like messages
                INVALID_USAGE: (usage) => `:name_badge: **|** Invalid usage. \`${usage}\`.`,
                API_ERROR: (error) => `:x: **|** \`${error.message}\`. Try again later...`,

                // Generic Responses
                FOOTER_ID: (id) => `ID: ${id}`,
                CREATED_AT: 'Created At',
                GLOBAL_YES: 'Yes',
                GLOBAL_NO: 'No',

                // Commands (soon since this isn't done yET)
                COMMAND_EVAL_TOO_LONG: (url) => `:ok_hand: **|** Result was too long for a Discord embed, so I posted to hastebin!\n\`${url}\``,
                COMMAND_EVAL_SUCCESS: (ms) => `:tada: Took ${ms}ms to evaluate.`,
                COMMAND_EVAL_FAILED: (ms) => `:pensive: Took ${ms}ms to evaluate.`,
                COMMAND_EXEC_ERROR: (stderr) => `:pensive: **|** Script failed:\n\`\`\`sh\n${stderr}\`\`\``,
                COMMAND_EXEC_SUCCESS: (stdout) => `:tada: **|** Script was successful:\n\`\`\`sh\n${stdout}\`\`\``,
                COMMAND_EXEC_NO_RESULT: ':ok_hand: **|** No result occured.',
                COMMAND_AVATAR_TITLE: (user) => `[ ${user.tag}'s Avatar ]`,
                COMMAND_CHANNELINFO_TITLE: (channel) => `[ Channel ${channel} ]`,
                COMMAND_CHANNELINFO_TYPE: 'Channel Type',
                COMMAND_CHANNELINFO_NSFW: 'NSFW',
                COMMAND_CHANNELINFO_TOPIC: 'Channel Topic',
                COMMAND_CHANNELINFO_TOPIC_NONE: 'No channel topic specified',
                COMMAND_CHANNELINFO_GUILD: 'Guild',
                COMMAND_CHANNELINFO_GUILD_VALUE: (guild) => `${guild.name} (\`${guild.id}\`)`,
                COMMAND_CHANNELINFO_CATEGORY: 'Category',
                COMMAND_CHANNELINFO_CATEGORY_VALUE: (channel) => `${channel.name} (\`${channel.id}\`)`,
                COMMAND_CHANNELINFO_USERS_CONNECTED: 'Users Connected',
                COMMAND_CHANNELINFO_USER_LIMIT: 'User Limit',
                COMMAND_MESSAGEINFO_AUTHOR: 'Author',
                COMMAND_ROLEINFO_TITLE: (role) => `[ Role ${role} ]`,
                COMMAND_ROLEINFO_MANAGED: 'Managed',
                COMMAND_ROLEINFO_HOISTED: 'Hoisted',
                COMMAND_ROLEINFO_MENTIONABLE: 'Mentionable',
                COMMAND_ROLEINFO_POSITION: 'Position',
                COMMAND_ROLEINFO_HEXADECIMAL: 'Hex Color'
            }
        });
    }
}