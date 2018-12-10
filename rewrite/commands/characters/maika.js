const Command = require('../../core/command');
const request = require('node-superfetch');

module.exports = new Command({
    command: 'maika',
    description: 'Oh, it\'s me! Isn\'t it?',
    category: 'Characters',
    run: async (client, msg) => {
        const { body } = await request
            .get('https://lolis.services/api/characters')
            .query('type', 'maika');

        return msg.embed({
            image: {
                url: body.url
            },
            color: client.color,
            description: "Oh look, it's me!"
        });
    }
});