const Command = require('../../core/command');
const { stripIndents } = require('common-tags');
const { DESCRIPTION } = require('../../util/embed-titles');

module.exports = new Command({
    command: 'inviteme',
    description: (client) => `Grabs the normal or minimal links for ${client.user.username} or you can join ${client.user.username}'s discord server!`,
    run: (client, msg) => msg.embed({
        title: `[ Invite ${client.user.username} ]`,
        description: stripIndents`
            **Here you go, ${msg.sender.username}.**

            ${DESCRIPTION} **Invite**: <https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=163840000>
            ${DESCRIPTION} **Invite (minimal)**: <https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot>
            ${DESCRIPTION} **Discord**: <https://discord.gg/7TtMP2n>
        `,
        color: client.color
    })
});