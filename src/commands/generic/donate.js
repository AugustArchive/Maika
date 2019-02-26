const { Command }      = require('@maika.xyz/kotori');

module.exports = class DonateCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'donate',
            description: (client) => `Support ${client.user.username}'s creator and my development.`,
            aliases: ['donations', 'patreon']
        });
    }

    /**
     * Run the `donate` command
     * @param {import('@maika.xyz/kotori').CommandContext} context The command context
     */
    async run(context) {
        return context.embed({
            title: await context.translate('COMMAND_DONATE_TITLE'),
            description: await context.translate('COMMAND_DONATE_DESCRIPTION'),
            fields: [
                {
                    name: '$1',
                    value: await context.translate('COMMAND_DONATE_PERKS_1')
                },
                {
                    name: '$2',
                    value: await context.translate('COMMAND_DONATE_PERKS_2')
                },
                {
                    name: '$5',
                    value: await context.translate('COMMAND_DONATE_PERKS_5')
                }
            ],
            footer: { text: await context.translate("COMMAND_DONATE_PERKS_SOON"), icon_url: context.author.avatarURL || context.author.defaultAvatarURL }
        });
    }
}