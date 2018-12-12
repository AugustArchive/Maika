const Command = require('../../core/command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { DESCRIPTION } = require('../../util/embed-titles');

module.exports = new Command({
    command: 'ren',
    description: 'Ren Ekoda? That\'s not a familiar name...',
    category: {
        name: 'Characters',
        emoji: '<:MeguLove:522281101843234837>'
    },
    async run(client, msg) {
        const { body } = await request
            .get('https://lolis.services/api/characters')
            .query({ type: 'ren' });

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