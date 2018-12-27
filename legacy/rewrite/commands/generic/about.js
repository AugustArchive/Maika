const Command = require('../../core/command');
const { stripIndents } = require('common-tags');

module.exports = new Command({
    command: 'about',
    aliases: ['aboot'],
    description: (client) => `Shows information about ${client.user.username}!`,
    run: (client, msg) => msg.embed({
        title: `[ About ${client.user.username}#${client.user.discriminator} ]`,
        description: stripIndents`
            :wave: **Oh hi there! I'm ${client.user.username} and I'm here to make you cry and happy!**
            :pencil: **I was made by ${client.users.get('280158289667555328').username} using the [Eris](https://abal.moe/Eris) library**
        `
    })
});