const Command = require('../../core/command');

module.exports = new Command({
    command: 'emoji-list',
    description: 'Shows the guild\'s emojis.',
    aliases: ['list-emojis', 'emojis'],
    category: { name: 'Discord Information', emoji: '<:discord:514626557277503488>' },
    checks: { guild: true },
    run: async (client, msg) => msg.embed({
        description: (await client.rest.getGuildEmojis(msg.guild)),
        color: client.color
    })
});