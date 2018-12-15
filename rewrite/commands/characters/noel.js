const Command = require('../../core/command');
const fetch = require('node-fetch');
const { stripIndents } = require('common-tags');
const { DESCRIPTION } = require('../../util/embed-titles');

module.exports = new Command({
    command: 'noel',
    description: 'Noel from Sora no Method? I love her!',
    category: { name: 'Characters', emoji: '<:MeguLove:522281101843234837>' },
    run: async (client, msg) => {
        const req = await fetch('https://lolis.services/api/characters?type=noel', {
            method: 'GET',
            headers: { 'User-Agent': 'Maika/DiscordBot (https://github.com/MaikaBot/Maika)' }
        });
        const body = await req.json();

        return msg.embed({
            description: stripIndents`
                **Isn't this Noel from Sora no Method? She's a popular character... c:**
                ${DESCRIPTION} Anime: **${body.anime}**
            `,
            color: client.color,
            image: { url: body.url }
        });
    }
});