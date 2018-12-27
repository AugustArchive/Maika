const Command = require('../../core/command');

module.exports = new Command({
    command: 'eyeify',
    description: 'Eyeify your message.',
    usage: '<text>',
    category: { name: 'Fun', emoji: Command.emojis.Fun },
    run: (client, msg) => {
        if (!msg.args[0])
            return msg.reply("Unknown `<text>` argument.");

        return msg.embed({
            description: `:eyes: ${msg.args.join(' :eyes: ')} :eyes:`,
            color: client.color
        });
    }
});