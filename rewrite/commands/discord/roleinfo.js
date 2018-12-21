const Command = require('../../core/command');
const { stripIndents } = require('common-tags');
const { DESCRIPTION } = require('../../util/embed-titles');
const { dateformat } = require('@maika.xyz/miu');

module.exports = new Command({
    command: 'roleinfo',
    aliases: ['role-info', 'role', 'role-information'],
    description: 'Fetches a role from the current guild.',
    usage: '<role>',
    checks: { guild: true },
    category: { name: 'Discord Information', emoji: Command.emojis.Discord },
    run: async(client, msg) => {
        if (!msg.args[0])
            return msg.reply("Unknown `<role>` argument.");

        const role = await client.rest.getRole(msg.args[0], msg.guild);
        return msg.embed({
            title: `[ Role ${role.name} ]`,
            description: stripIndents`
                ${DESCRIPTION} **ID**: ${role.id}
                ${DESCRIPTION} **Created At**: ${dateformat(role.createdAt, 'mm/dd/yyyy HH:mm:ss TT')}
                ${DESCRIPTION} **Mentionable**: ${role.mentionable ? 'Yes' : 'No'}
                ${DESCRIPTION} **Managed**: ${role.managed ? 'Yes' : 'No'}
                ${DESCRIPTION} **Hoisted**: ${role.hoisted ? 'Yes' : 'No'}
                ${DESCRIPTION} **Position**: ${role.position - 1}
                ${DESCRIPTION} **Role Color**: #${parseInt(role.color).toString(16)}
            `,
            color: role.color === 0 ? client.color : role.color
        });
    }
});