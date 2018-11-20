const Event            = require('../structures/event');
const { stripIndents } = require('common-tags');

module.exports = class MessageDeletedEvent extends Event {
    constructor(bot) {
        super(bot, {
            event: "messageDelete",
            emitter: "on"
        });
    }

    run(msg) {
        if (!msg.content || !msg.channel.guild || !msg.author)
            return;

        this
            .bot
            .r
            .table('snipes')
            .insert({ 
                id: msg.channel.id,
                author: msg.author.toJSON(),
                content: msg.embeds > 1 ? msg.embeds[0] : msg.content,
                timestamp: msg.timestamp
            }).run();

        const data = this.bot.r.table('guilds').get(msg.channel.guild.id).run();
        if (data.logging.enabled && msg.channel.guild.channels.has(data.logging.channelID) && msg.channel.guild.channels.get(data.logging.channelID).permissionsOf(this.bot.unavailableGuilds.id).has('sendMessages')) {
            const channel = msg.channel.guild.channels.get(data.logging.channelID);
            channel.createMessage({
                embed: {
                    description: stripIndents`
                        A message was deleted!
                        \`\`\`diff
                        - ID        : ${msg.id}
                        - Channel ID: ${msg.channel.name}
                        - Content   : ${msg.embeds > 1 ? 'The content was an embed' : msg.content}
                        - Created At: ${new Date(msg.timestamp).toISOString()}
                        - Author    : ${msg.author.username}
                        \`\`\`
                    `
                }
            });
        }
    }
};