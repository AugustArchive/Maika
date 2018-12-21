const Command = require('../../core/command');
const { stripIndents } = require('common-tags');

module.exports = new Command({
    command: 'about',
    aliases: ['aboot'],
    description: (client) => `Shows information about ${client.user.username}!`,
    run: (client, msg) => msg.embed({
        title: `[ About ${client.user.username}#${client.user.discriminator} ]`,
        description: stripIndents`
            :wave: **Oh
        `
    })
});