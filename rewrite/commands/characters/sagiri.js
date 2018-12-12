const Command = require('../../core/command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');

module.exports = new Command({
    command: 'sagiri',
    description: 'Sagiri Izumi? An uncommon name I can say so!',
    category: {
        name: 'Characters',
        emoji: '<:MeguLove:522281101843234837>'
    },
    run: async(client, msg) => {
        const { body } = await request
            .get('https://lolis.services/api/characters')
            .query({ type: 'sagiri' });

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