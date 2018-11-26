const Event            = require('../structures/event');
const { stripIndents } = require('common-tags');

module.exports = class GuildJoinedEvent extends Event {
    constructor(bot) {
        super(bot, {
            event: 'guildCreate',
            emitter: 'on'
        });
    }

    run(guild) {
        this.bot.logger.info(`Joined ${guild.name} (${guild.id})`);
        this.bot.r.table('guilds').insert({
            id: guild.id,
            prefix: process.env.PREFIX,
            logging: {
                enabled: false,
                channelID: null
            },
            reddit_feed: {
                enabled: false,
                channelID: null,
                subreddit: null
            }
        }).run();
        this.bot.createMessage(process.env.LOG_CHANNEL, {
            embed: {
                description: stripIndents`
                    Joined **${guild.name}**
                    \`\`\`diff
                    + ID                         : ${guild.id}
                    + Large                      : ${guild.large ? 'Yes' : 'No'}
                    + Member Count               : ${guild.memberCount.toLocaleString()}
                    + Roles [${guild.roles.size}]: ${guild.roles.map(s => s.name).join(', ')}
                    + Region                     : ${guild.region}
                    + Shard                      : ${guild.shard.id}/${this.bot.shards.size}
                    \`\`\`
                    `,
                color: this.bot.color
            }
        });
        this.bot.editStatus('online', { name: `x;help | ${this.bot.guilds.size} Guild${this.bot.guilds.size > 1 ? "s" : ""}`, type: 0 });
    }
};