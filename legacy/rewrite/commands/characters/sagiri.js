const Command = require('../../core/command');
const fetch = require('node-fetch');
const { stripIndents } = require('common-tags');
const { DESCRIPTION } = require('../../util/embed-titles');

module.exports = new Command({
    command: 'sagiri',
    description: 'Sagiri Izumi? An uncommon name I can say so myself...?',
    category: { name: 'Characters', emoji: Command.emojis.Characters },
    run: async(client, msg) => {
        const req = await fetch('https://lolis.services/api/characters?type=sagiri', {
            method: 'GET',
            headers: { 'User-Agent': 'Maika/DiscordBot (https://github.com/MaikaBot/Maika)' }
        });
        const body = await req.json();

        return msg.embed({
            description: stripIndents`
                **Sagiri Izumi? I guess there from another anime... :|**
                ${DESCRIPTION} Anime: **${body.anime}**
            `,
            image: { url: body.url },
            color: client.color
        });
    }
});