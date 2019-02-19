const { stripIndents } = require('common-tags');
const { Command }      = require('@maika.xyz/kotori');
const { dateformat }   = require('@maika.xyz/miu');

module.exports = class RoleInformationCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'roleinfo',
            aliases: [
                'role',
                'role-info'
            ],
            description: 'Gives information about a Discord role',
            usage: '[role]',
            category: 'Discord Information',
            guildOnly: true
        });
    }

    /**
     * Run the `roleinfo` command
     * @param {import('@maika.xyz/kotori').CommandContext} context The command context
     */
    async run(context) {
        const roleSpin = context.args.arguments.length > 0? context.args.gather(' '): context.member.roles[Math.floor(Math.random() * context.member.roles.length - 1)];
        const role = await this.client.rest.getRole(roleSpin, context.guild);

        return context.embed({
            title: await context.translate('COMMAND_ROLEINFO_TITLE', role.name),
            description: stripIndents`
                ❯ **${await context.translate('CREATED_AT')}**: ${dateformat(role.createdAt, 'mm/dd/yyyy hh:MM:ssTT')}
                ❯ **${await context.translate('COMMAND_ROLEINFO_POSITION')}**: #${role.position - 1}
                ❯ **${await context.translate('COMMAND_ROLEINFO_MENTIONABLE')}**: ${role.mentionable? await context.translate('GLOBAL_YES'): await context.translate('GLOBAL_NO')}
                ❯ **${await context.translate('COMMAND_ROLEINFO_HOISTED')}**: ${role.hoisted? await context.translate('GLOBAL_YES'): await context.translate('GLOBAL_NO')}
                ❯ **${await context.translate('COMMAND_ROLEINFO_MANAGED')}**: ${role.managed? await context.translate('GLOABL_YES'): await context.translate('GLOBAL_NO')}
                ❯ **${await context.translate('COMMAND_ROLEINFO_HEXADECIMAL')}**: #${parseInt(role.color).toString(16)}
            `,
            footer: {
                text: await context.translate('FOOTER_ID', role.id),
                icon_url: context.author.avatarURL || context.avatar.defaultAvatarURL
            }
        });
    }
};