const Plugin       = require('../structures/plugin');
const { humanize } = require('../deps');
const balanceUtil  = require('../util/balance');

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
            run: async (msg) => {
                const user = await msg.bot.finder.user(msg.args.length > 0 ? msg.args.join(' ') : msg.sender.id);
                const uConfig = await msg.bot.r.table('users').get(user.id).run();
                const prefix = (user.id === msg.sender.id ? 'Your' : `${user.username}#${user.discriminator}'s`);
                return msg.reply(`**${msg.sender.username}**: ${prefix} balance: \`💴${uConfig.coins}\``);
            }
        },
        {
            command: 'bet',
            description: 'Bet all, half, or an amount to win or lose...',
            usage: '<amount|"all"|"half">',
            aliases: ['gamble'],
            run: async (msg) => {
                if (!msg.args[0])
                    return msg.reply(`**${msg.sender.username}**: You must provide an amount.`);
                if (isNaN(msg.args[0]))
                    return msg.reply(`**${msg.sender.username}**: The bet value must be an number.`);
                if (Number(msg.args[0]) < 1)
                    return msg.reply(`**${msg.sender.username}**: The bet must be greater or equal to 1.`);

                const uConfig = await msg.bot.r.table('users').get(msg.sender.id).run();
                if (uConfig.coins < Number(msg.args[0]))
                    return msg.reply(`**${msg.sender.username}**: You don't even have that amount!`);

                const message = await msg.reply(`**${msg.sender.username}**: Spinning the dial...`);
                if (Math.round(Math.random()) >= 0.5) {
                    msg.bot.r.table('users').get(msg.sender.id).update({ coins: uConfig.coins + Number(msg.args[0]) }).run();
                    await message.edit(`**${msg.sender.username}**: You won \`${Number(msg.args[0]).toLocaleString()}\`! You now have \`${uConfig.coins + Number(msg.args[0])}\`. :tada:`);
                } else {
                    msg.bot.r.table('users').get(msg.sender.id).update({ coins: uConfig.coins - Number(msg.args[0]) }).run();
                    await message.edit(`**${msg.sender.username}**: The dial has responded to me and you lost \`${Number(msg.args[0]).toLocaleString()}\`.`);
                }
            }
        },
        {
            command: 'daily',
            description: 'Grabs your daily yen.',
            aliases: ['dailies'],
            async run(msg) {
                const amount = Math.floor(Math.random() * 500 - 100) + 100;
                const intervals = await msg.bot.r.table('intervals').get(msg.sender.id).run();
                if (intervals) {
                    if (Date.now() - intervals.daily <= (1000 * 60 * 60 * 24))
                        return msg.reply(`**${msg.sender.username}**: You've already received your dailies! You have \`${humanize((1000 * 60 * 60 * 24) - (Date.now() - intervals.daily))}\` left.`);
                    
                    await msg.bot.r.table('intervals').get(msg.sender.id).update({ daily: Date.now() }).run();
                    const bal = await balanceUtil(msg.bot, msg.sender.id, amount);
                    return msg.reply(`**${msg.sender.username}**: \`${amount}\` was added to your balance. You now have \`${bal}\` coins.`);
                } else {
                    msg.bot.r.table('intervals').insert({ id: msg.sender.id, daily: Date.now() }).run();
                    const b = await balanceUtil(msg.bot, msg.sender.id, amount);
                    return msg.reply(`**${msg.sender.username}**: \`${amount}\` was added to your balance. You now have \`${b}\` coins.`);
                }
            }
        }
    ]
});