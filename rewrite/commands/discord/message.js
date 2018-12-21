const Command = require('../../core/command');
const { stripIndents } = require('common-tags');
const { dateformat } = require('@maika.xyz/miu');
const { elipisis } = require('../../util/string');

module.exports = new Command({
    command: 'messageinfo',
    aliases: ['message-info', 'message'],
    description: 'Grabs information about a Discord message.',
    usage: '<channelID:messageID>',
    category: { name: 'Discord Information', emoji: Command.emojis.Discord },
    run: async(client, msg) => {
        if (!msg.args[0])
            return msg.reply('Missing `<channelID:messageID>` argument.');

        const args = msg.args[0].split(':');
        client
            .rest
            .getMessage({
                channelID: args[0],
                messageID: args[1]
            })
            .then((message) => msg.embed({
                description: stripIndents`
                    \`\`\`diff
                    + Content: ${elipisis(message.content, 500)}
                    + Created At: ${dateformat(message.createdAt, 'HH:mm:ss TT')}
                    + Channel: ${message.channel.name} (${message.channel.id})
                    + Author: ${message.author.username}#${message.author.discriminator} (${message.author.id})
                    \`\`\`
                `,
                color: client.color
            }))
            .catch(() => msg.reply('Unknown message/channel ID.'));
    }
});