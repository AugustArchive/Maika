const Command = require('../../core/command');

module.exports = new Command({
    command: 'maika',
    description: 'Oh, it\'s me! Isn\'t it?',
    category: 'Characters',
    ratelimit: 5,
    run: async (client, msg) => {
        const req = await client.http.get('https://lolis.services/api/characters')
            .addQuery('type', 'maika')
            .execute();
        const { body } = await req.json();

        return msg.embed({
            content: 'Oh, it\'s me!',
            embed: {
                image: {
                    url: body.url
                },
                color: client.color
            }
        });
    }
});