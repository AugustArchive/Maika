const Command = require('../../core/command');
const fetch = require('node-fetch');
const { stripIndents } = require('common-tags');
const { DESCRIPTION } = require('../../util/embed-titles');

module.exports = new Command({
    command: 'mitsuha',
    description: "Mitsuha Miyamizu? I never heard of her...",
    category: { name: 'Characters', emoji: '<:MeguLove:522281101843234837>' },
    run: async (client, msg) => {
        const req = await fetch('https://lolis.services/api/characters?type=mitsuha', {
            method: 'GET',
            headers: { 'User-Agent': 'Maika/DiscordBot (https://github.com/MaikaBot/Maika)' }
        });
        const body = await req.json();

        return msg.embed({
            description: stripIndents`
                **I guess I never heard of Mitsuha Miyamizu?**
                ${DESCRIPTION} Anime: **${body.anime}**
            `,
            image: { url: body.url },
            color: client.color
        });
    }
});