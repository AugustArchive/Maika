const { Command }      = require('@maika.xyz/kotori');
const { dateformat }   = require('@maika.xyz/miu');
const { stripIndents } = require('common-tags');

module.exports = class ServerInformationCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'serverinfo',
            description: 'Describes information about the current Discord guild or a specified one by an ID/name.',
            usage: '[serverID]',
            aliases: ['guildinfo', 'guild-info', 'server-info', 'guild-information'],
            category: 'Discord Information',
            guildOnly: true // no shit
        });
    }

    /**
     * Run the `serverinfo` command
     * @param {import('@maika.xyz/kotori').CommandContext} context The command context
     */
    async run(context) {
        const guild = await this.client.rest.getGuild(context.args.has(0)? context.args.gather(" "): context.guild.id);
        return context.embed({
            title: await context.translate('COMMAND_SERVERINFO_TITLE', guild.name),
            description: stripIndents`
                **${await context.translate('CREATED_AT')}**: ${this.parseDate(guild.createdAt)}
                **${await context.translate('COMMAND_SERVERINFO_REGION')}**: ${guild.region}
                **${await context.translate('COMMAND_SERVERINFO_OWNER')}**: <@${guild.ownerID}> (\`${guild.ownerID}\`)
                **${await context.translate('COMMAND_SERVERINFO_MEMBERS')}**: ${guild.memberCount.toLocaleString()}
                **${await context.translate('COMMAND_SERVERINFO_ROLES')} [${guild.roles.size}]**: ${guild.roles.map(s => `<@&${s.id}>`).join(' | ')}
                **${await context.translate('COMMAND_SERVERINFO_EMOJIS')} [${guild.emojis.size}]**: ${guild.emojis.map(s => s).join(' ')}
                **${await context.translate('COMMAND_SERVERINFO_CHANNELS')} [${guild.channels.size}]**: ${guild.channels.filter(s => s.type === 0).length} Text, ${guild.channels.filter(s => s.type === 2).length} Voice, ${guild.channels.filter(s => s.type === 4)} Category
                **${await context.translate('COMMAND_SERVERINFO_BANS')}**: ${await context.translate('COMMAND_SERVERINFO_BANS_VALUE', await this.getGuildBans(guild))}
            `,
            footer: { text: await context.translate('FOOTER_ID', guild.id), icon_url: context.author.avatarURL || context.author.defaultAvatarURL }
        });
    }

    /**
     * Parses a date
     * @param {number} d The date
     * @returns {string} The parsed date
     */
    parseDate(d) {
        return dateformat(d, 'mm/dd/yyyy hh:MM:ssTT');
    }

    /**
     * Gets the length of the total bans
     * @param {import('@augu/eris').Guild} guild The guild
     */
    getGuildBans(guild) {
        return guild
            .getBans()
            .then((bans) => {
                return bans.length;
            });
    }
};