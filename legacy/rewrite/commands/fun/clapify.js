const Command = require('../../core/command');

module.exports = new Command({
    command: 'clapify',
    description: 'Clapify your message.',
    usage: '<text>',
    category: { name: 'Fun', emoji: Command.emojis.Fun },
    run: (client, msg) => {
        if (!msg.args[0])
            return msg.reply("Unknown `<text>` argument.");

        return msg.embed({
            description: `:clap: ${msg.args.join(' :clap: ')} :clap:`,
            color: client.color
        });
    }
});