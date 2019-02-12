const { Command } = require('../../core');
const { elipisis } = require('../../util/string');

module.exports = class ChannelInformationCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'channelinfo',
            aliases: [
                'channel-info',
                'channel-information'
            ],
            description: 'View information on a Discord text, voice, or category channel.',
            usage: '[channel]',
            category: 'Discord Information'
        });
    }

    /**
     * Run the `channelinfo` command
     * @param {import('../../core/internal/context')} ctx The command context
     */
    async run(ctx) {
        const channel = await this.client.rest.getChannel(ctx.args.length > 0? ctx.args.join(" "): ctx.channel.id, ctx.guild);
        let embed = {
            title: `[ Channel ${channel.type === 0 ? `#${channel.name}` : channel.name} ]`,
            fields: [
                {
                    name: 'ID', value: channel.id
                },
                {
                    name: 'Created At', value: dateformat(channel.createdAt, 'mm/dd/yyyy hh:MM:ssTT'), inline: true
                },
                {
                    name: 'Type', value: channel.type === 0? 'Text': channel.type === 2? 'Voice': channel.type === 4? 'Category': 'Unknown', inline: true
                }
            ],
            color: client.color,
            footer: { text: `Requested by ${ctx.sender.username} | ${client.getFooter()}` }
        };

        if (channel.type === 0)
            embed.fields.push({
                name: 'NSFW', value: channel.nsfw? 'Yes': 'No', inline: true
            },
            {

            });
    }
}

/*

                if (channel.type === 0)
                    embed.fields.push({
                        name: 'NSFW', value: channel.nsfw? 'Yes': 'No', inline: true
                    },
                    {
                        name: 'Topic', value: channel.topic? elipisis(channel.topic, 1350): 'No topic available.', inline: true
                    });

                if (!ctx.guild || !ctx.guild.channels.has(channel.id)) {
                    const guild = client.guilds.get(client.channelGuildMap[channel.id]);
                    embed.fields.push({
                        name: 'Guild', value: `${guild.name} (\`${guild.id}\`)`, inline: true
                    });
                }

                if (channel.type !== 4 && channel.parentID) {
                    const category = channel.guild.channels.get(channel.parentID);
                    embed.fields.push({
                        name: 'Category', value: category.name, inline: true
                    });
                }

                if (channel.type === 2)
                    embed.fields.push({
                        name: 'Users Connected', value: channel.voiceMembers.size, inline: true
                    },
                    {
                        name: 'User Limit', value: channel.userLimit, inline: true
                    });

                return ctx.embed(embed);*/