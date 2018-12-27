const Command = require('../../core/command');
const { stripIndents } = require('common-tags');
const { DESCRIPTION } = require('../../util/embed-titles');

module.exports = new Command({
    command: 'shardinfo',
    description: (client) => stripIndents`
        **Shows information about ${client.user.username}'s shards**

        Use the \`all\` argument to see all of the shards
        Use the \`id <id>\` argument to see information about that shard id.
        Use the \`current\` to see the current shard.
    `,
    usage: '["all"/"id"/"current"] [shardID]',
    aliases: ['shard', 's', 'shards'],
    async run(client, msg) {
        if (!msg.args[0])
            return msg.reply("Invalid subcommand. (`current` | `all` | `id <id>`");

        const subcommand = msg.args[0];
        switch (subcommand.toLowerCase()) {
            case "current": {
                const  { id, latency, status } = msg.guild.shard;
                msg.embed({
                    title: `[ Shard #${id} ]`,
                    description: stripIndents`
                        ${DESCRIPTION} **Latency**: \`${latency}ms\`
                        ${DESCRIPTION} **Status**: \`${(status === 'disconnected' ? "Disconnected" : status === 'connecting' ? 'Connecting to Discord..' : status === 'handshaking' ? 'Handshaking (Unknown)' : status === 'ready' ? 'Connected' : 'Unknown')}\`
                    `,
                    color: client.color
                });
            } break;
            case "id": {
                if (!msg.args[1])
                    return msg.reply("Invalid shard id.");

                const id = Number(msg.args[1]);
                const s = client.shards.filter(T => T.id === id);

                if (s.length > 0) {
                    const { id, latency, status } = s[0];
                    msg.embed({
                        title: `[ Shard #${id} ]`,
                        description: stripIndents`
                            ${DESCRIPTION} **Latency**: \`${latency}ms\`
                            ${DESCRIPTION} **Status**: \`${(status === 'disconnected' ? "Disconnected" : status === 'connecting' ? 'Connecting to Discord..' : status === 'handshaking' ? 'Handshaking (Unknown)' : status === 'ready' ? 'Connected' : 'Unknown')}\`
                        `,
                        color: client.color
                    });
                } else return msg.reply(`I can't find \`#${id}\` because I don't have that shard id you baka!`);
            } break;
            case "all": {
                let shardString = '';
                client.shards.map((shard) => shardString += `[ Shard #${shard.id} ]\n${shard.latency}ms | ${(shard.status === 'disconnected' ? "Disconnected" : shard.status === 'connecting' ? 'Connecting to Discord..' : shard.status === 'handshaking' ? 'Handshaking (Unknown)' : shard.status === 'ready' ? 'Connected' : 'Unknown')}\n`);

                msg.reply(`\`\`\`ini\n${shardString}\`\`\``);
            } break;
        }
    }
});