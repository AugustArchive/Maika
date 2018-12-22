const Command = require('../../core/command');
const { stripIndents } = require('common-tags');
const { DESCRIPTION: desc } = require('../../util/embed-titles');

module.exports = new Command({
    command: 'ping',
    description: 'Pong!',
    run: async (client, msg) => {
        const start = Date.now();
        const message = await msg.reply(':question: Pong?');

        let pings = {
            message: { creation: message.timestamp - msg.timestamp, deletion: Date.now() - start },
            shard: msg.guild.shard.latency
        };
        await message.delete();
        msg.embed({
            title: ':ping_pong: Pong!',
            description: stripIndents`
                ${desc} **Message Creation**: \`${pings.message.creation}ms\`
                ${desc} **Message Deletion**: \`${pings.message.deletion}ms\`
                ${desc} **Shard #${msg.guild.shard.id}**: \`${pings.shard}ms\`
            `,
            color: client.color
        });
    }
});