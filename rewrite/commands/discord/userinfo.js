const Command = require('../../core/command');
const { TITLE } = require('../../util/embed-titles');
const { dateformat } = require('@maika.xyz/miu');

module.exports = new Command({
    command: 'userinfo',
    aliases: ['user', 'user-info'],
    description: "Shows information about yourself or another user!",
    usage: '[user|userID|@mention]',
    category: { name: 'Discord Information', emoji: Command.emojis.Discord },
    run: async(client, msg) => {
        const user = await client.rest.getUser(msg.args.length > 0 ? msg.args.join(" ") : msg.sender.id);
        const embed = {
            title: `[ User ${user.username}#${user.discriminator} ]`,
            color: client.color,
            fields: [{
                name: `${TITLE} ID`, value: user.id, inline: false
            },
            {
                name: `${TITLE} Created At`, value: dateformat(user.createdAt, 'mm/dd/yyyy hh:MM:ss TT'), inline: true
            },
            {
                name: `${TITLE} Bot User`, value: user.bot ? 'Yes' : 'No', inline: true
            }]
        };

        if (msg.guild && msg.guild.members.has(user.id)) {
            const member = msg.guild.members.get(user.id);
            const mutual = client.guilds.filter(iso => iso.members.has(user.id)).map(s => s.name).join(', ');

            if (member.nick)
                embed.fields.push({ name: 'Nickname', value: member.nick, inline: true });

            embed.fields.push({ name: 'Status', value: (member.status === 'online' ? "Online" : member.status === 'idle' ? 'Away' : member.status === 'dnd' ? 'Do Not Disturb' : 'Offline'), inline: true });
            embed.fields.push({ name: `Roles [${member.roles.length}]`, value: member.roles.map(s => `<@&${s}>`).join(', '), inline: true });
            embed.fields.push({ name: 'Mutual Guilds', value: mutual, inline: true });
            if (member.game)
                embed.description = `${(member.game.type === 0 ? 'Playing' : member.game.type === 1 ? 'Streaming' : member.game.type === 2 ? 'Listening to' : member.game.type === 3 ? 'Watching' : '')} **${member.game.name}**`;
            embed.fields.push({ name: 'Joined At', value: dateformat(member.joinedAt, 'mm/dd/yyyy hh:MM:ss TT'), inline: true });
            if (member.voiceState.channelID && msg.guild.channels.has(member.voiceState.channelID)) {
				const voiceChannel = msg.guild.channels.get(member.voiceState.channelID);
				embed.fields.push({
					name: 'Voice Channel',
					value: voiceChannel.name,
					inline: true
				});
				embed.fields.push({
					name: 'Muted',
					value: member.voiceState.mute || member.voiceState.self_mute ? 'Yes' : 'No',
					inline: true
				});
				embed.fields.push({
					name: 'Deafened',
					value: member.voiceState.deaf || member.voiceState.self_deaf ? 'Yes' : 'No',
					inline: true
				});
			}
        }

        return msg.embed(embed);
    }
});