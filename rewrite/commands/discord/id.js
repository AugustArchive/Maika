const Command = require('../../core/command');

module.exports = new Command({
    command: 'id',
    description: "Grabs your or another user's snowflake (ID)",
    usage: '[user]',
    aliases: ['userID', 'userId', 'user-id'],
    category: { name: 'Discord Information', emoji: Command.emojis.Discord }
});