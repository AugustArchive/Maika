const Command = require('../../core/command');
const { stripIndents } = require('common-tags');
const { DESCRIPTION } = require('../../util/embed-titles');
const { dateformat } = require('@maika.xyz/miu');

module.exports = new Command({
    command: 'serverinfo',
    aliases: ['server-info', 'server', 'guild', 'guildinfo', 'guild-information'],
    description: "Fetches the current guild/another guild's information that Maika is in.",
    usage: '[serverID]',
    checks: { guild: true },
    category: { name: 'Discord Information', emoji: Command.emojis.Discord },
    run: async(client, msg) => {
        const guild = await client.rest.getGuild(msg.args.length > 0 ? msg.args.join(" ") : msg.guild.id);
        const emojis = await client.rest.getGuildEmojis(guild, 25);
        const getOwner = () => {
            const owner = client.users.get(guild.ownerID);
            return `${owner.username}#${owner.discriminator} (${owner.id})`;
        };

        return msg.embed({
            title: `[ Guild ${guild.name} ]`,
            description: stripIndents`
                ${DESCRIPTION} **ID**: ${guild.id}
                ${DESCRIPTION} **Created At**: ${dateformat(guild.createdAt, 'mm/dd/yyyy hh:MM:ss TT')}
                ${DESCRIPTION} **Region**: ${guild.region}
                ${DESCRIPTION} **Owner**: ${getOwner()}
                ${DESCRIPTION} **Members**: ${guild.memberCount.toLocaleString()}
                ${DESCRIPTION} **Text Channels**: ${guild.channels.filter(s => s.type === 0).map(s => `#${s.name}`).join(', ') || 'None'}
                ${DESCRIPTION} **Voice Channels**: ${guild.channels.filter(s => s.type === 1).map(s => s.name).join(', ') || 'None'}
                ${DESCRIPTION} **Category Channels**: ${guild.channels.filter(s => s.type === 4).map(s => s.name).join(', ') || 'None'}
                ${DESCRIPTION} **Roles [${guild.roles.size}]**: ${guild.roles.map(s => `<@&${s.id}>`).join(', ')}
                ${DESCRIPTION} **Emojis [${guild.emojis.length}]**: ${emojis}
            `,
            color: client.color,
            thumbnail: { url: guild.icon ? guild.iconURL : null }
        });
    }
});