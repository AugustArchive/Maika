const { stripIndents } = require('common-tags');
const { Command } = require('@maika.xyz/kotori');

module.exports = class ShardInformationCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'shardinfo',
            description: (client) => `Shows information about ${client.user.username}'s shards`,
            usage: '[id]',
            aliases: ['shards', 'shard'],
            guildOnly: true
        });
    }

    /**
     * Run the `shardinfo` command
     * @param {import('@maika.xyz/kotori').CommandContext} context The command context
     */
    async run(context) {
        if (context.args.isEmpty(0)) {
            const deletThisShit = await context.send(await context.translate('COMMAND_SHARDINFO_GATHER'));
            let shards = '';
            this
                .client
                .ws
                .shards
                .map((shard) => {
                    shards += `[Shard #${shard.id}]: ${shard.latency}ms (${shard.status})\n`;
                });

            const current = context.guild.shard;
            await deletThisShit.delete();
            return context.embed({
                title: await context.translate('COMMAND_SHARDINFO_TITLE', this.client.user.username),
                description: stripIndents`
                    \`\`\`ini
                    ${shards}
                    \`\`\`
                `
            });
        }

        const arg   = context.args.get(0);
        const shard = this
            .client
            .ws
            .shards
            .filter(sh => sh.id === Number(arg));

        if (shard.length > 0) {
            const s = shard[0];
            return context.embed({
                title: await context.translate('COMMAND_SHARDINFO_SHARD_TITLE', s.id),
                description: stripIndents`
                    **${await context.translate('COMMAND_SHARDINFO_SHARD_LATENCY')}**: ${s.latency}ms
                    **${await context.translate('COMMAND_SHARDINFO_SHARD_STATUS')}**: ${s.status}
                `
            });
        } else return context.send(await context.translate('COMMAND_SHARDINFO_NONE', arg));
    }
}