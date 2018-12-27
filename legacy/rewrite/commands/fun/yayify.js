const Command = require('../../core/command');

module.exports = new Command({
    command: 'yayify',
    description: 'Yayify your message.',
    usage: '<text>',
    category: { name: 'Fun', emoji: Command.emojis.Fun },
    run: (client, msg) => {
        if (!msg.args[0])
            return msg.reply("Unknown `<text>` argument.");

        return msg.embed({
            description: `<a:yay:414963854317977600> ${msg.args.join(' <a:yay:414963854317977600> ')} <a:yay:414963854317977600>`,
            color: client.color
        });
    }
});