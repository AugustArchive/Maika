const { Command, PermissionUtil } = require('@maika.xyz/kotori');
const { stripIndents }                         = require('common-tags');

module.exports = class InviteMeCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'inviteme',
            description: (client) => `Invite ${client.user.username} to your server or join my Discord server!`,
            aliases: ['invite']
        });
    }

    /**
     * Run the `inviteme` command
     * @param {import('@maika.xyz/kotori')} context The command context
     */
    async run(context) {
        const permissions = PermissionUtil.resolve(0);
        return context.embed({
            title: await context.translate('COMMAND_INVITEME_TITLE', this.client.user.username),
            description: stripIndents`
                **${await context.translate('COMMAND_INVITEME_INVITE')}**: https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=${permissions}
                **${await context.translate('COMMAND_INVITEME_DISCORD')}**: https://discord.gg/7TtMP2n
            `
        });
    }
}