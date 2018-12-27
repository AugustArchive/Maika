const Command = require('../../core/command');

module.exports = new Command({
    command: 'id',
    description: "Grabs your or another user's snowflake (ID)",
    usage: '[user]',
    aliases: ['userID', 'userId', 'user-id'],
    category: { name: 'Discord Information', emoji: Command.emojis.Discord },
    run: async(client, msg) => {
        const user = await client.rest.getUser(msg.args.length > 0 ? msg.args.join(' ') : msg.sender.id);
        return msg.reply(`${user.id === msg.sender.id ? 'Your' : `${user.username}#${user.discriminator}'s`} ID is: **${user.id}**`);
    }
});