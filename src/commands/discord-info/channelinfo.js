const { elipisis }   = require('../../util/string');
const { Command }    = require('@maika.xyz/kotori');
const { dateformat } = require('@maika.xyz/miu');

module.exports = class ChannelInformationCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'channelinfo',
            aliases: [
                'channel',
                'channel-info',
                'channel-information' // tbh, why would people type this xd
            ],
            description: 'Fetches a discord text/voice/category channel and displays information about it',
            usage: '[channel]',
            category: 'Discord Information',
            guildOnly: true
        });
    }

    /**
     * Run the `channelinfo` command
     * @param {import('@maika.xyz/kotori').CommandContext} ctx The command context
     */
    async run(ctx) {
        const channel = await this.client.rest.getChannel(ctx.args.arguments.length > 0? ctx.args.gather(' '): ctx.channel.id, ctx.guild);
        let embed = {
            title: `[ Channel ${channel.type === 0? '#': ''}${channel.name} ]`,
            title: await ctx.translate('COMMAND_CHANNELINFO_TITLE', `${channel.type === 0? '#': ''}${channel.name}`),
            fields: [
                {
                    name: await ctx.translate('COMMAND_CHANNELINFO_TYPE'), 
                    value: this.disguinishType(channel.type), 
                    inline: true
                },
                {
                    name: await ctx.translate('CREATED_AT'), 
                    value: dateformat(channel.createdAt, 'mm/dd/yyyy hh:MM:ssTT'), 
                    inline: true
                }
            ],
            footer: {
                text: await ctx.translate('FOOTER_ID', channel.id),
                icon_url: ctx.author.avatarURL || ctx.author.defaultAvatarURL
            }
        };

        if (channel.type === 0) {
            embed.fields.push({
                name: await ctx.translate('COMMAND_CHANNELINFO_NSFW'), 
                value: channel.nsfw? await ctx.translate('GLOBAL_YES'): await ctx.translate('GLOBAL_NO'), 
                inline: true
            });

            embed.fields.push({
                name: await ctx.translate('COMMAND_CHANNELINFO_TOPIC'), 
                value: channel.topic? elipisis(channel.topic, 1350): await ctx.translate('COMMAND_CHANNELINFO_TOPIC_NONE'), 
                inline: true
            });
        }

        if (!ctx.guild || !ctx.guild.channels.has(channel.id)) {
            const map   = this.client.channelGuildMap[channel.id];
            const guild = this.client.guilds.get(map);
            embed.fields.push({
                name: await ctx.translate('COMMAND_CHANNELINFO_GUILD'), 
                value: await ctx.translate('COMMAND_CHANNELINFO_GUILD_VALUE', guild), 
                inline: true
            });
        }

        if (channel.type !== 4 && channel.parentID) {
            const category = channel.guild.channels.get(channel.parentID);
            embed.fields.push({
                name: await ctx.translate('COMMAND_CHANNELINFO_CATEGORY'),
                value: await ctx.translate('COMMAND_CHANNELINFO_CATEGORY_VALUE', category),
                inline: true
            });
        }

        if (channel.type === 2) {
            embed.fields.push({
                name: await ctx.translate('COMMAND_CHANNELINFO_USERS_CONNECTED'),
                value: channel.voiceMembers.size,
                inline: true
            });

            embed.fields.push({
                name: await ctx.translate('COMMAND_CHANNELINFO_USER_LIMIT'),
                value: channel.userLimit,
                inline: true
            });
        }

        return ctx.embed(embed);
    }

    /**
     * Disguinishs the channel type
     * @param {number} type The channel type number
     * @returns {string} The channel type as a string
     */
    disguinishType(type) {
        return type === 0? 'Text': type === 2? 'Voice': type === 4? 'Category': 'Unknown';
    }
};