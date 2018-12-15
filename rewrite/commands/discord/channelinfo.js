const Command = require('../../core/command');
const { TITLE } = require('../../util/embed-titles');
const { dateformat } = require('../../dependencies');

module.exports = new Command({
    command: 'channelinfo',
    description: 'Grabs information on a text/voice/category channel.',
    usage: '<channel>',
    checks: { guild: true },
    category: { name: 'Discord Information', emoji: '<:discord:514626557277503488>' },
    aliases: ['channel-info', 'channel'],
    run: async (client, msg) => {
        const channel = await client.rest.getChannel(msg.args.length > 0 ? msg.args.join(' ') : msg.channel.id, msg.guild);
        let embed = {
            title: `Channel ${channel.type === 0 ? `#${channel.name}` : channel.name}`,
            color: client.color,
            fields: [{
                name: `${TITLE} ID`, value: channel.id, inline: false
            },
            {
                name: `${TITLE} Created At`, value: dateformat(channel.createdAt, 'hh:MM:ss TT'), inline: true
            },
            {
                name: `${TITLE} Type`, value: channel.type === 0 ? 'Text' : channel.type === 2 ? 'Voice' : channel.type === 4 ? 'Category' : 'Unknown', inline: true
            }]
        };

        if (channel.type === 0)
            embed.fields.push({
                name: `${TITLE} NSFW`, value: channel.nsfw ? 'Yes' : 'No', inline: true
            },
            {
                name: `${TITLE} Topic`, value: channel.topic ? channel.topic : 'No topic avaliable', inline: true
            });

        if (!msg.guild || !msg.guild.channels.has(channel.id)) {
            const guild = client.guilds.get(client.channelGuildMap[channel.id]);
            embed.fields.push({ name: `${TITLE} Guild`, value: `${guild.name} (\`${guild.id}\`)`, inline: true });
        }

        if (channel.type !== 4 && channel.parentID)
            embed.fields.push({ name: `${TITLE} Category`, value: channel.guild.channels.get(channel.parentID).name, inline: true });
        
        if (channel.type === 2)
            embed.fields.push({
                name: `${TITLE} Users Connected`,
                value: channel.voiceMembers.size,
                inline: true
            },
            {
                name: `${TITLE} User Limit`,
                value: channel.userLimit,
                inline: true
            });

        return await msg.embed(embed);
    }
});