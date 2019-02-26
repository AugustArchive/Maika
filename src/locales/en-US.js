const { Language, Util: { isFunction } } = require('@maika.xyz/kotori');
const { stripIndents }                   = require('common-tags');

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
                LIMIT_NAN: ':x: **|** The argument didn\'t provide a number.',
                TOO_HIGH: (equal, arg) => `:x: **|** The value has to be lower or equal to ${equal}, received ${arg}.`,
                TOO_LOW: (equal, arg) => `:x: **|** The value has to be higher or equal to ${equal}, received ${arg}.`,

                // Commands
                COMMAND_EVAL_TOO_LONG: (url) => `:ok_hand: **|** Result was too long for a Discord embed, so I posted to hastebin!\n\`${url}\``,
                COMMAND_EVAL_SUCCESS: (ms) => `:tada: Took ${ms}ms to evaluate.`,
                COMMAND_EVAL_FAILED: (ms) => `:pensive: Took ${ms}ms to evaluate.`,
                COMMAND_EXEC_ERROR: (stderr) => `:pensive: **|** Script failed:\n\`\`\`sh\n${stderr}\`\`\``,
                COMMAND_EXEC_SUCCESS: (stdout) => `:tada: **|** Script was successful:\n\`\`\`sh\n${stdout}\`\`\``,
                COMMAND_EXEC_NO_RESULT: ':ok_hand: **|** No result occured.',
                COMMAND_AVATAR_TITLE: (user) => `[ ${user.tag}'s Avatar ]`,
                COMMAND_CHANNELINFO_TITLE: (channel) => `[ Channel ${channel} ]`,
                COMMAND_CHANNELINFO_TYPE: '❯ Channel Type',
                COMMAND_CHANNELINFO_NSFW: '❯ NSFW',
                COMMAND_CHANNELINFO_TOPIC: '❯ Channel Topic',
                COMMAND_CHANNELINFO_TOPIC_NONE: 'No channel topic specified',
                COMMAND_CHANNELINFO_GUILD: '❯ Guild',
                COMMAND_CHANNELINFO_GUILD_VALUE: (guild) => `${guild.name} (\`${guild.id}\`)`,
                COMMAND_CHANNELINFO_CATEGORY: '❯ Category',
                COMMAND_CHANNELINFO_CATEGORY_VALUE: (channel) => `${channel.name} (\`${channel.id}\`)`,
                COMMAND_CHANNELINFO_USERS_CONNECTED: '❯ Users Connected',
                COMMAND_CHANNELINFO_USER_LIMIT: '❯ User Limit',
                COMMAND_MESSAGEINFO_AUTHOR: '❯ Author',
                COMMAND_ROLEINFO_TITLE: (role) => `[ Role ${role} ]`,
                COMMAND_ROLEINFO_MANAGED: '❯ Managed',
                COMMAND_ROLEINFO_HOISTED: '❯ Hoisted',
                COMMAND_ROLEINFO_MENTIONABLE: '❯ Mentionable',
                COMMAND_ROLEINFO_POSITION: '❯ Position',
                COMMAND_ROLEINFO_HEXADECIMAL: '❯ Hex Color',
                COMMAND_SERVERINFO_TITLE: (guild) => `[ Guild ${guild} ]`,
                COMMAND_SERVERINFO_REGION: '❯ Region',
                COMMAND_SERVERINFO_OWNER: '❯ Owner',
                COMMAND_SERVERINFO_CHANNELS: '❯ Total Channels',
                COMMAND_SERVERINFO_ROLES: '❯ Total Roles',
                COMMAND_SERVERINFO_EMOJIS: '❯ Total Emojis',
                COMMAND_SERVERINFO_MEMBERS: '❯ Total Members',
                COMMAND_SERVERINFO_BANS: '❯ Total Bans',
                COMMAND_COMMITS_TITLE: (limit) => `[Maika:master] Latest ${limit} commits:`,
                COMMAND_DONATE_TITLE: 'Support my development!',
                COMMAND_DONATE_DESCRIPTION: stripIndents`
                    **<https://patreon.com/ohlookitsAugust>**

                    :warning: If you decline or cancelled the purchase without a reason, 
                    you will be blacklisted from the bot. If there is a reason and is a
                    valid one, then you won't be blacklisted but your perks
                    will be gone and the coins you earned will still be in
                    your balance. If you wanna cancel your purchase,
                    contact \`August#5820\` here: ***<https://discord.gg/7TtMP2n>***.
                `,
                COMMAND_DONATE_PERKS_1: stripIndents`
                    **$1: Namaste**

                    • **Donator role in my server**
                    • **Ability to queue 2 thousand songs**
                    • **1 thousand coins added into your balance**
                    • **Donator badge on your profile**
                `,
                COMMAND_DONATE_PERKS_2: stripIndents`
                    **$2: Arigato!**

                    • **1,500 coins added to your balance**
                    • **Previous perks given**
                `,
                COMMAND_DONATE_PERKS_5: stripIndents`
                    **$5: L-lewd!**

                    • **5 thousand coins into your balance**
                    • **Get a 2% chance of winning from gambling**
                    • **Get 10% more coins when if you win from the arcade**
                    • **Previous perks given**
                `,
                COMMAND_DONATE_PERKS_SOON: 'More perks will be added to the Patreon page throughout my development.',
                COMMAND_HELP_TITLE: (client) => `[ ${client.user.tag}'s Command List ]`,
                COMMAND_HELP_DESCRIPTION: (prefix, guild) => stripIndents`
                    <:kumikoSip:490330937515704320> **The prefix in ${guild} is \`${prefix}\`.**
                    <:blobThonk:461309895971438602> **If you wanna documentation on a command, type \`${prefix}help [command]**
                    <:nuuuuuu:447279660372590632> **Additional Links**: [\`GitHub\`](https://github.com/MaikaBot) | [\`Support\`](https://discord.gg/7TtMP2n) | [\`Invite\`](https://discordapp.com/oauth2/authorize?client_id=447229568282132510&scope=bot)
                `,
                COMMAND_HELP_COMMAND_NAME: (name) => `[ Command ${name} ]`,
                COMMAND_HELP_USAGE: '❯ Usage',
                COMMAND_HELP_ALIASES: '❯ Aliases',
                COMMAND_HELP_ALIASES_NONE: 'No aliases found',
                COMMAND_HELP_CATEGORY: '❯ Category',
                COMMAND_HELP_OWNER_ONLY: '❯ Owner Only',
                COMMAND_HELP_GUILD_ONLY: '❯ Guild Only',
                COMMAND_HELP_NOT_FOUND: (arg) => `:x: **|** Couldn't find the command \`${arg}\`.`
            }
        });
    }
}