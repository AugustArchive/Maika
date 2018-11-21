const Plugin = require('../structures/plugin');
const { trim } = require('../util/array');
const { dateformat } = require('../deps');

module.exports = new Plugin({
    name: 'Discord',
    embeded: '<:discord:514626557277503488> Discord Information',
    visible: true,
    commands: [{
        command: 'channelinfo',
        description: 'Grabs information about a Discord text/voice/category channel',
        usage: '[channel]',
        aliases: ['channel-info', 'channelinformation', 'channel'],
        category: 'Discord Information',
        async run(msg) {
            const channel = await msg.bot.finder.channel(msg.args.length > 0 ? msg.args.join(' ') : msg.channel.id, msg.guild);
            let embed = {};
        }
    },
    {
        command: 'emojis',
        description: 'Grabs all of the emojis from the guild',
        aliases: ['emojilist'],
        category: 'Discord Information',
        async run(msg) {
            const emojis = await msg.bot.finder.emojis(msg.guild);
            return msg.embed({
                description: emojis,
                color: msg.bot.color
            });
        }
    },
    {
        command: 'id',
        description: 'Gives your or another user\'s Discord ID.',
        usage: '[user]',
        aliases: ['user-id', 'userid', 'userID', 'userId'],
        async run(msg) {
            const user = await msg.bot.finder.user(msg.args.length > 0 ? msg.args.join(' ') : msg.sender.id);
            return msg.reply(`**${msg.sender.username}**: ${(user.id === msg.sender.id) ? `Your id is: \`${msg.sender.id}\`` : `${user.username}#${user.discriminator}'s ID: \`${user.id}\``}`);
        }
    },
    {
        command: ''
    },
    {},
    {},
    {}]
});