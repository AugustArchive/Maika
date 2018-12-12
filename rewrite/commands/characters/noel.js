const Command = require('../../core/command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { DESCRIPTION } = require('../../util/embed-titles');

module.exports = new Command({
    command: 'noel',
    description: 'Noel from Sora no Method? I love her!',
    category: {
        name: 'Characters',
        emoji: '<:MeguLove:522281101843234837>'
    },
    run: async (client, msg) => {
        const { body } = await request
            .get('https://lolis.services/api/characters')
            .query({ type: 'noel' });

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