const Command = require('../../core/command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { DESCRIPTION } = require('../../util/embed-titles');

module.exports = new Command({
    command: 'hinako',
    description: 'Hinako? Does she have pink hair like ME?!',
    category: {
        name: 'Characters',
        emoji: '<:MeguLove:522281101843234837>'
    },
    run: async (client, msg) => {
        const { body } = await request
            .get('https://lolis.services/api/characters')
            .query({ type: 'hinako' });

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