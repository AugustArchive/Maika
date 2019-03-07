const { Command }  = require('@maika.xyz/kotori');
const { humanize } = require('@maika.xyz/miu');

module.exports = class UptimeCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'uptime',
            description: (client) => `Shows how long ${client.user.username} is online for`,
            aliases: ['up-time']
        });
    }

    /**
     * Run the `uptime` command
     * @param {import('@maika.xyz/kotori').CommandContext} context The command context
     */
    async run(context) {
        return context.send(await context.translate('COMMAND_UPTIME_VALUE', humanize(Date.now() - this.client.startTime)));
    }
}