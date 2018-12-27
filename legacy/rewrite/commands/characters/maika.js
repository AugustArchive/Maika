const Command = require('../../core/command');
const fetch = require('node-fetch');

module.exports = new Command({
    command: 'maika',
    description: 'Oh, it\'s me! Isn\'t it?',
    category: { name: 'Characters', emoji: Command.emojis.Characters },
    run: async (client, msg) => {
        const req = await fetch('https://lolis.services/api/characters?type=maika', {
            method: 'GET',
            headers: { 'User-Agent': 'Maika/DiscordBot (https://github.com/MaikaBot/Maika)' }
        });
        const body = await req.json();

        return msg.embed({
            image: {
                url: body.url
            },
            color: client.color,
            description: "**I'm so beautiful as always with my malicious look... :<**"
        });
    }
});