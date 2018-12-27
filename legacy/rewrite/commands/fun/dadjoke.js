const Command = require('../../core/command');
const fetch = require('node-fetch');

module.exports = new Command({
    command: 'dadjoke',
    description: 'Fetches a dadjoke',
    category: { name: 'Fun', emoji: Command.emojis.Fun },
    run: async(_, msg) => {
        try {
            const request = await fetch('https://icanhazdadjoke.com/', {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            const response = await request.json();

            return msg.reply(`:laughing: | **${response.joke}**`);
        } catch(ex) {
            return msg.reply(`:x: | **An error occured while running the \`dadjoke\` command: \`${ex.message}\`. Try again later!**`);
        }
    }
});