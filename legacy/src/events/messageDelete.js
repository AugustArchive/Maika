const Event            = require('../structures/event');
const { stripIndents } = require('common-tags');
const { dateformat }   = require('../deps');

module.exports = class MessageDeletedEvent extends Event {
    constructor(bot) {
        super(bot, {
            event: "messageDelete",
            emitter: "on"
        });
    }

    async run(msg) {
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

        const data = await this.bot.r.table('guilds').get(msg.channel.guild.id).run();
        if (data.logging.enabled && msg.channel.guild.channels.has(data.logging.channelID) && msg.channel.guild.channels.get(data.logging.channelID).permissionsOf(this.bot.user.id).has('sendMessages')) {
            const channel = msg.channel.guild.channels.get(data.logging.channelID);
            channel.createMessage({
                embed: {
                    description: stripIndents`
                        A message was deleted!
                        \`\`\`diff
                        - ID        : ${msg.id}
                        - Channel   : ${msg.channel.name}
                        - Content   : ${msg.embeds > 1 ? 'The content was an embed' : msg.content}
                        - Created At: ${dateformat(msg.createdAt, 'mm/dd/yyyy hh:MM:ss TT')}
                        - Author    : ${msg.author.username}
                        \`\`\`
                    `,
                    color: this.bot.color
                }
            });
        }
    }
};