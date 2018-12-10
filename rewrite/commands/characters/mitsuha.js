const Command          = require('../../core/command');
const request          = require('node-superfetch');
const { stripIndents } = require('common-tags');

module.exports = new Command({
    command: 'mitsuha',
    description: "Mitsuha Miyamizu? I never heard of her...",
    category: 'Characters',
    run: async (client, msg) => {
        const { body } = await request
            .get('https://lolis.services/api/characters')
            .query({
                type: 'mitsuha'
            });

        return msg.embed({
            description: stripIndents`
                **I guess I never heard of Mitsuha Miyamizu?**
                • **Anime**: ${body.anime}
            `,
            image: { url: body.url },
            color: client.color
        });
    }
});