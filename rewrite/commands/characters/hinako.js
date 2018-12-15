const Command = require('../../core/command');
const fetch = require('node-fetch');
const { stripIndents } = require('common-tags');
const { DESCRIPTION } = require('../../util/embed-titles');

module.exports = new Command({
    command: 'hinako',
    description: 'Hinako? Does she have pink hair? I love pink hair!',
    category: { name: 'Characters', emoji: '<:MeguLove:522281101843234837>' },
    run: async (client, msg) => {
        const req = await fetch('https://lolis.services/api/characters?type=hinako', {
            method: 'GET',
            headers: { 'User-Agent': 'Maika/DiscordBot (https://github.com/MaikaBot/Maika)' }
        });
        const body = await req.json();

        return msg.embed({
            description: stripIndents`
                **This Hinako character seems nice... :)**
                ${DESCRIPTION} Anime: **${body.anime}**
            `,
            color: client.color,
            image: { url: body.url }
        });
    }
});