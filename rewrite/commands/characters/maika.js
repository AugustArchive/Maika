const Command = require('../../core/command');
const request = require('node-superfetch');

module.exports = new Command({
    command: 'maika',
    description: 'Oh, it\'s me! Isn\'t it?',
    category: {
        name: 'Characters',
        emoji: '<:MeguLove:522281101843234837>'
    },
    run: async (client, msg) => {
        const { body } = await request
            .get('https://lolis.services/api/characters')
            .query('type', 'maika');

        return msg.embed({
            image: {
                url: body.url
            },
            color: client.color,
            description: "**I'm so beautiful as always with my malicious look... :<**"
        });
    }
});