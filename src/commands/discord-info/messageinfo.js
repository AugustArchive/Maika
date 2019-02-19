const { Command }    = require('@maika.xyz/kotori');
const { dateformat } = require('@maika.xyz/miu');

module.exports = class MessageInformationCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'messageinfo',
            aliases: [
                'message',
                'message-info'
            ],
            description: 'Shows information about a Discord message',
            usage: '<channelID:messageID>',
            category: 'Discord Information'
        });
    }

    /**
     * Run the `messageinfo` command
     * @param {import('@maika.xyz/kotori').CommandContext} context The command context
     */
    async run(context) {
        if (context.args.isEmpty(0)) {
            const usage = await this.getFormat(context);
            const trans = await context.translate('INVALID_USAGE', usage);
            return context.send(trans);
        }

        const args = context.args.get(0).split(':');
        const message = await this.client.rest.getMessage(args[0], args[1]);

        return context.embed({
            description: message.content,
            fields: [
                {
                    name: await context.translate('COMMAND_MESSAGEINFO_AUTHOR'), 
                    value: message.author.tag, 
                    inline: true
                },
                {
                    name: await context.translate('CREATED_AT'), 
                    value: dateformat(message.createdAt, 'mm/dd/yyyy hh:MM:ssTT'),
                    inline: true
                }
            ],
            footer: {
                text: await context.translate("FOOTER_ID", message.id),
                icon_url: context.author.avatarURL || context.author.defaultAvatarURL
            }
        });
    }
}