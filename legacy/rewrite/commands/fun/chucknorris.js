const Command = require('../../core/command');
const fetch = require('node-fetch');

module.exports = new Command({
    command: 'chucknorris',
    aliases: ['chuck'],
    description: 'Fetches a Chuck Norris joke.',
    category: { name: 'Fun', emoji: Command.emojis.Fun },
    run: async (_, msg) => {
        try {
            const req = await fetch('https://api.icndb.com/jokes/random', { method: 'GET' });
            const res = await req.json();

            return msg.reply(`:laughing: | **${res.value.joke}**`);
        } catch(ex) {
            return msg.reply(`:x: | **An error occured while running the \`chucknorris\` command: \`${ex.message}\`. Try again later!**`);
        }
    }
});