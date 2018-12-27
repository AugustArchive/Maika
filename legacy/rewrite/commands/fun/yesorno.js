const Command = require('../../core/command');
const fetch = require('node-fetch');

module.exports = new Command({
    command: 'yesorno',
    description: (client) => `Ask if ${client.user.username} agrees or not!`,
    usage: '<question>',
    category: { name: 'Fun', emoji: Command.emojis.Fun },
    run: async(client, msg) => {
        if (!msg.args[0])
            return msg.reply('Invalid `<question>` argument.');

        try {
            const request = await fetch('https://yesno.wtf/api/', { method: 'GET' });
            const response = await request.json();

            return msg.embed({
                description: `The answer to the stupid question: \`${msg.args.join(' ')}\` is: **${response.answer}.**`,
                image: { url: response.image },
                color: client.color
            });
        } catch(ex) {
            return msg.reply(`:x: | **An error occured while running the \`yesorno\` command: \`${ex.message}\`. Try again later!**`);
        }
    }
});