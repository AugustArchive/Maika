const Command = require('../../core/command');
const fetch = require('node-fetch');
const { stripIndents } = require('common-tags');
const { DESCRIPTION } = require('../../util/embed-titles');

module.exports = new Command({
    command: 'ren',
    description: 'Ren Ekoda? That\'s not a familiar name...',
    category: { name: 'Characters', emoji: Command.emojis.Characters },
    async run(client, msg) {
        const req = await fetch('https://lolis.services/api/characters?type=ren', {
            method: 'GET',
            headers: { 'User-Agent': 'Maika/DiscordBot (https://github.com/MaikaBot/Maika)' }
        });
        const body = await req.json();

        return msg.embed({
            description: stripIndents`
                **Ren Ekoda? I would love to meet- Is it a boy or a girl?**
                ${DESCRIPTION} Anime: **${body.anime}**
            `,
            image: { url: body.url },
            color: client.color
        });
    }
});