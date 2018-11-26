const Event            = require('../structures/event');
const { stripIndents } = require('common-tags');

module.exports = class ChannelCreatedEvent extends Event {
    constructor(bot) {
        super(bot, {
            event: 'channelCreate',
            emitter: 'on'
        });
    }

    async run(channel) {
        const guild = this.bot.guilds.get(this.bot.channelGuildMap[channel.id]);
        const data  = await this.bot.r.table('guilds').get(guild.id).run();

        if (data.logging.enabled && guild.channels.has(data.logging.channelID) && guild.channels.get(data.logging.channelID).permissionsOf(this.bot.user.id).has('sendMessages'))
            guild.channels.get(data.logging.channelID).createMessage({
                embed: {
                    description: stripIndents`
                        Channel **${channel.name}** was created
                        \`\`\`diff
                        + Type    : ${channel.type === 0 ? 'Text' : channel.type === 2 ? 'Voice' : channel.type === 4 ? 'Category' : 'Unknown'}
                        + Position: ${channel.position - 1}
                        + Category: ${channel.type === 4 ? guild.channels.get(channel.parentID).name : channel.name}
                        + Topic   : ${channel.type !== 0 ? channel.topic : 'Not a text channel'}
                        + NSFW    : ${channel.type !== 0 ? channel.nsfw ? 'Yes' : 'No' : 'Not a text channel'}
                        \`\`\`
                    `,
                    color: this.bot.color
                }
            });
    }
};