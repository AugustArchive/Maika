const Command = require('../../core/command');
const fetch = require('node-fetch');

module.exports = new Command({
    command: 'anime-feed',
    aliases: ['animu-feed', 'feed'],
    description: 'Grabs the last anime that was released to the world!',
    category: { name: 'Fun', emoji: Command.emojis.Fun },
    run: async(client, msg) => {
        try {
            const request = await fetch('https://lolis.services/api/feed', { method: 'GET' });
            const response = await request.json();

            return msg.embed({
                description: `**${response.results[0].name[0]}** released at ${response.results[0].publishedAt[0]}`,
                color: client.color
            });
        } catch(ex) {
            return msg.reply(`:x: | **An error occured while running the \`anime-feed\` command: \`${ex.message}\`. Try again later!**`);
        }
    }
});