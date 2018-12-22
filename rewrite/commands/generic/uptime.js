const Command = require('../../core/command');

module.exports = new Command({
    command: 'uptime',
    description: (client) => `Shows the current uptime for ${client.user.username}.`,
    run: (client, msg) => msg.reply(`:gear: **${client.getUptime()}**`)
});