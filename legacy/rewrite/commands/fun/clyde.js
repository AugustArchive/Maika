const Command = require('../../core/command');
const fetch = require('node-fetch');
const { elipisis } = require('../../util/string');

module.exports = new Command({
    command: 'clyde',
    description: (client) => `${client.user.username} will clydify your message.`,
    usage: '<text>',
    category: { name: 'Fun', emoji: Command.emojis.Fun },
    run: async (client, msg) => {
        if (!msg.args[0])
            return msg.reply('Unknown `<text>` argument.');

        const text = elipisis(msg.args.join(' '), 200);
         
        try {
            const req = await fetch(`https://nekobot.xyz/api/imagegen?type=clyde&text=${text}`, { method: 'GET' });
            const res = await req.json();

            return msg.embed({
                image: { url: res.message },
                color: client.color
            });
        } catch(ex) {
            return msg.reply(`:x: | **An error occured while running the \`clyde\` command: \`${ex.message}\`. Try again later!**`);
        }
    }
});