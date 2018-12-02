const Plugin           = require('../structures/plugin');
const { humanize }     = require('../deps');
const balanceUtil      = require('../util/balance');
const { stripIndents } = require('common-tags');

module.exports = new Plugin({
    name: 'Economy',
    visible: true,
    embeded: '💴 Economy',
    enabled: true,
    commands: [
        {
            command: 'balance',
            description: 'Shows your\'s or another user\'s balance.',
            usage: '[user]',
            aliases: ['bal', '$', 'yen'],
            run(bot, msg) {
                const user = await bot.finder.user(msg.args.length > 0 ? msg.args.join(' ') : msg.sender.id);
                const uConfig = await bot.r.table('users').get(user.id).run();
                const prefix = (user.id === msg.sender.id ? 'Your' : `${user.username}#${user.discriminator}'s`);
                return msg.reply(`**${msg.sender.username}**: ${prefix} balance: \`💴${uConfig.coins}\``);
            }
        },
        {
            command: 'bet',
            description: 'Bet all, half, or an amount to win or lose...',
            usage: '<amount|"all"|"half">',
            aliases: ['gamble'],
            run(bot, msg) {
                if (!msg.args[0])
                    return msg.reply(`**${msg.sender.username}**: You must provide an amount.`);
                if (isNaN(msg.args[0]))
                    return msg.reply(`**${msg.sender.username}**: The bet value must be an number.`);
                if (Number(msg.args[0]) < 1)
                    return msg.reply(`**${msg.sender.username}**: The bet must be greater or equal to 1.`);

                const uConfig = await bot.r.table('users').get(msg.sender.id).run();
                if (uConfig.coins < Number(msg.args[0]))
                    return msg.reply(`**${msg.sender.username}**: You don't even have that amount!`);

                const message = await msg.reply(`**${msg.sender.username}**: Spinning the dial...`);
                if (Math.round(Math.random()) >= 0.5) {
                    bot.r.table('users').get(msg.sender.id).update({ coins: uConfig.coins + Number(msg.args[0]) }).run();
                    await message.edit(`**${msg.sender.username}**: You won \`${Number(msg.args[0]).toLocaleString()}\`! You now have \`${uConfig.coins + Number(msg.args[0])}\`. :tada:`);
                } else {
                    bot.r.table('users').get(msg.sender.id).update({ coins: uConfig.coins - Number(msg.args[0]) }).run();
                    await message.edit(`**${msg.sender.username}**: The dial has responded to me and you lost \`${Number(msg.args[0]).toLocaleString()}\`.`);
                }
            }
        },
        {
            command: 'daily',
            description: 'Grabs your daily yen.',
            aliases: ['dailies'],
            async run(bot, msg) {
                const amount = Math.floor(Math.random() * 500 - 100) + 100;
                const intervals = await bot.r.table('intervals').get(msg.sender.id).run();
                if (intervals) {
                    if (Date.now() - intervals.daily <= (1000 * 60 * 60 * 24))
                        return msg.reply(`**${msg.sender.username}**: You've already received your dailies! You have \`${humanize((1000 * 60 * 60 * 24) - (Date.now() - intervals.daily))}\` left.`);
                    
                    await bot.r.table('intervals').get(msg.sender.id).update({ daily: Date.now() }).run();
                    const bal = await balanceUtil(bot, msg.sender.id, amount);
                    return msg.reply(`**${msg.sender.username}**: \`${amount}\` was added to your balance. You now have \`${bal}\` coins.`);
                } else {
                    await bot.r.table('intervals').insert({ id: msg.sender.id, daily: Date.now() }).run();
                    const b = await balanceUtil(bot, msg.sender.id, amount);
                    return msg.reply(`**${msg.sender.username}**: \`${amount}\` was added to your balance. You now have \`${b}\` coins.`);
                }
            }
        },
        {
            command: 'leaderboard',
            description: 'Shows the global or the guild\'s leaderboard',
            usage: '<"guild"|"global">',
            aliases: ['lb'],
            async run(bot, msg) {
                if (msg.args[0]) {
                    if (msg.args[0].toLowerCase() === 'guild') {
                        let leaderboard = await bot.r.table('users').orderBy(bot.r.desc('coins')).run();
                        leaderboard = leaderboard.filter(bal => msg.guild.members.has(bal.id));
                        if (leaderboard.length < 1)
                            return msg.reply(`**${msg.sender.username}**: No users were found that have any coins!`);
                        const longestName = Math.max(...leaderboard.map(balance => (bot.users.has(balance.id) ? `${bot.users.get(balance.id).username}#${bot.users.get(balance.id).discriminator}` : 'Unknown#0000').length));
                        return msg.code('fix', leaderboard.map((balance, i) => (i + 1) + '.' + Array(6 - ((i + 1) + '.').length).join(' ') + (bot.users.has(balance.id) ? bot.users.get(balance.id).username + '#' + bot.users.get(balance.id).discriminator : 'Unknown') + Array((longestName + 3) - (bot.users.has(balance.id) ? bot.users.get(balance.id).username + '#' + bot.users.get(balance.id).discriminator : 'Unknown').length).join(' ') + ' | ' + balance.coins.toLocaleString()).join('\n'));
                    } else if (msg.args[0].toLowerCase() === 'global') {
                        const lb = await bot.r.table('users').orderBy(bot.r.desc('coins')).limit(20).run();
                        const longestName = Math.max(...lb.map(balance => (bot.users.has(balance.id) ? `${bot.users.get(balance.id).username}#${bot.users.get(balance.id).discriminator}` : 'Unknown#0000').length));
                        return msg.code('fix', lb.map((balance, i) => (i + 1) + '.' + Array(6 - ((i + 1) + '.').length).join(' ') + (bot.users.has(balance.id) ? bot.users.get(balance.id).username + '#' + bot.users.get(balance.id).discriminator : 'Unknown') + Array((longestName + 3) - (bot.users.has(balance.id) ? bot.users.get(balance.id).username + '#' + bot.users.get(balance.id).discriminator : 'Unknown').length).join(' ') + ' | ' + balance.coins.toLocaleString()).join('\n'));
                    }
                } else {
                    return msg.reply(`**${msg.sender.username}**: Unknown subcommand.`);
                }
            }
        },
        {
            command: 'profile',
            description: 'Shows your\'s or another user\'s profile',
            usage: '<user|"set"> <"description"|"social.<social>"> <value>',
            aliases: [],
            async run(bot, msg) {
                if (!msg.args[0]) {
                    const self = await bot.r.table('users').get(msg.sender.id).run();
                    return msg.embed({
                        title: `${msg.sender.username}#${msg.sender.discriminator}'s Profile`,
                        color: bot.color,
                        description: self.profile.description,
                        fields: [
                            {
                                name: 'Coins', value: self.coins.toLocaleString(), inline: true
                            },
                            {
                                name: 'Social', value: stripIndents`
                                    **osu!**: ${self.profile.social.osu}
                                    **Reddit**: ${self.profile.social.reddit}
                                    **Steam**: ${self.profile.social.steam}
                                    **Twitter**: ${self.profile.social.twitter}
                                `, inline: true
                            },
                            {
                                name: 'Marriage', value: stripIndents`
                                    **Is Married**: ${self.marriage.is ? 'Yes' : 'No'}
                                    **Is Married To**: ${self.marriage.to === null ? 'Not Married' : `<@${self.marriage.to}>`}
                                `, inline: true
                            }
                        ]
                    });
                } else {
                    switch (msg.args[0]) {
                        case "set": {
                            if (!msg.args[1])
                                return msg.reply(`**${msg.sender.username}**: You must provide a subsubcommand. (\`description\` | \`social.<social>\`)`);
                            if (!['description', 'social.osu', 'social.reddit', 'social.steam', 'social.twitter'].includes(msg.args[1]))
                                return msg.reply(`**${msg.sender.username}**: Invalid subsubcommand. (\`description\` | \`social.osu\` | \`social.reddit\` | \`social.steam\` | \`social.twitter\`)`);
                            if (!msg.args[2])
                                return msg.reply(`**${msg.sender.username}**: You must provide a value.`);

                            switch (msg.args[1]) {
                                case "description": {
                                    const desc = await msg.args.slice(2).join(' ');
                                    await bot.r.table('users').get(msg.sender.id).update({ profile: { description: desc } }).run();
                                    msg.reply(`**${msg.sender.username}**: Your description has been set to: **\`${desc}\`**`);
                                } break;
                                case "social.osu": {
                                    await bot.r.table('users').get(msg.sender.id).update({ profile: { social: { osu: msg.args[2] } } }).run();
                                    msg.reply(`**${msg.sender.username}**: Your osu!profile has been set to: <https://osu.ppy.sh/u/${msg.args[2]}>`);
                                } break;
                                case "social.reddit": {
                                    await bot.r.table('users').get(msg.sender.id).update({ profile: { social: { reddit: msg.args[2] } } }).run();
                                    msg.reply(`**${msg.sender.username}**: Your reddit profile has been set to: <https://reddit.com/u/${msg.args[2]}>`);
                                } break;
                                case "social.steam": {
                                    await bot.r.table('users').get(msg.sender.id).update({ profile: { social: { steam: msg.args[2] } } }).run();
                                    msg.reply(`**${msg.sender.username}**: Your reddit profile has been set to: ${msg.args[2]}`);
                                } break;
                                case "social.twitter": {
                                    await bot.r.table('users').get(msg.sender.id).update({ profile: { social: { twitter: msg.args[2] } } }).run();
                                    msg.reply(`**${msg.sender.username}**: Your reddit profile has been set to: <https://twitter.com/${msg.args[2]}>`);
                                } break;
                            }
                        } break;
                    }
                }
            }
        }
    ]
});