const { Command } = require('@maika.xyz/kotori');

module.exports = class AvatarCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'avatar',
            aliases: [
                'avtar',
                'user-avatar'
            ],
            description: 'Grabs a Discord user\'s avatar.',
            usage: '[user]',
            category: 'Discord Information'
        });
    }

    /**
     * Run the `avatar` command
     * @param {import('@maika.xyz/kotori').CommandContext} context The command context
     */
    async run(context) {
        if (context.args.isEmpty(0)) return context.embed({
            title: `[ ${context.author.tag}'s Avatar ]`,
            image: { url: context.author.avatarURL || context.author.defaultAvatarURL }
        });

        const user = await this.client.rest.getUser(context.args.get(0));
        return context.embed({
            title: `[ ${user.tag}'s Avatar ]`,
            image: { url: user.avatarURL || user.defaultAvatarURL }
        });
    }
}