const Command = require('../../core/command');

module.exports = new Command({
    command: 'bongoify',
    description: 'Bongoify your message.',
    usage: '<text>',
    category: { name: 'Fun', emoji: Command.emojis.Fun },
    run: (client, msg) => {
        if (!msg.args[0])
            return msg.reply("Unknown `<text>` argument.");

        return msg.embed({
            description: `<a:bongocat:526642650624032778> ${msg.args.join(' <a:bongocat:526642650624032778> ')} <a:bongocat:526642650624032778>`,
            color: client.color
        });
    }
});