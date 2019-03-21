const { Command } = require('@maika.xyz/kotori');
const wumpfetch   = require('wumpfetch');

module.exports = class CommitsCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'commits',
            description: (client) => `View ${client.user.username}'s commit history on GitHub`,
            usage: '[limit]',
            aliases: ['commit-history'],
            category: 'Generic'
        });
    }

    /**
     * Run the `commits` command
     * @param {import('@maika.xyz/kotori').CommandContext} context The command context
     */
    async run(context) {
        let limit = 10;
        if (context.args.isEmpty(0)) limit = 10;
        else {
            const arg = context.args.get(0);
            if (isNaN(arg)) return context.send(await context.translate('LIMIT_NAN'));
            if (arg > 50) return context.send(await context.translate('TOO_HIGH', 50, arg));
            if (arg < 1) return context.send(await context.translate('TOO_LOW', 1, arg));
            else limit = arg;
        }

        const req = await wumpfetch.get('https://api.github.com/repos/MaikaBot/Maika/commits').send();
        const res = req.json();

        return context.embed({
            title: await context.translate('COMMAND_COMMITS_TITLE')
        });
    }
}