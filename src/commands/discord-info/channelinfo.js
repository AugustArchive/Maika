const { elipisis } = require('../../util/string');
const { Command }  = require('@maika.xyz/kotori');

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
        const channel = await this
            .client
            .rest
            .getChannel(ctx.args.arguments.length > 0? ctx.args.gather(' '): ctx.message.channel.id, ctx.message.guild);

        let embed = {
            title: `[ Channel ${channel.type === 0? '#': ''}${channel.name} ]`,
            fields: [
                {
                    name: 'ID', value: channel.id, inline: false   
                },
                {
                    name: 'Type', value: this.disguinishType(channel.type), inline: true
                }
            ]
        };

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