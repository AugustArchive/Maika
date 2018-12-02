const Plugin           = require('../structures/plugin');
const { stripIndents } = require('common-tags');

module.exports = new Plugin({
    name: 'Marriage',
    embeded: '👰 Marriage',
    visible: true,
    enabled: false,
    commands: [
        {
            command: 'marry',
            description: 'Marry a user!',
            usage: '<user>',
            aliases: ['marriage'],
            async run(bot, msg) {
                if (!msg.args[0])
                    return msg.reply(`**${msg.sender.username}**: You must provide a user ID, mention, or name.`);

                const wanted = await bot.finder.user(msg.args[0]);
                if (wanted.id === msg.sender.id)
                    return msg.reply(`**${msg.sender.username}**: You can't marry yourself, you filthy person.`);

                const self = await bot.r.table('users').get(msg.sender.id).run();
                const user = await bot.r.table('users').get(wanted.id).run();

                if (user.marriage.is)
                    return msg.reply(`**${msg.sender.username}**: That person is already married.`);
                else if (self.marriage.is)
                    return msg.reply(`**${msg.sender.username}**: You filthy cheater... You are already married!`);
                else {
                    const message = await msg.reply(stripIndents`
                        <@${wanted.id}>: Are you sure you wanna marry <@${msg.sender.id}>?
                        Reply with \`yes\` or \`no\` in the next 30 seconds.
                        Reply with \`cancel\` to cancel this message.
                    `);
                    const collected = await msg.collector.awaitMessages(
                        (mes) => mes.author.id === wanted.id, {
                            channelID: msg.channel.id,
                            userID: wanted.id,
                            timeout: 30e3
                        }
                    );

                    if (['no', 'nu'].includes(collected.content))
                        return message.edit(`**${msg.sender.username}**: They said no, so you're forever alone.`);
                    else if (['cancel', 'finish'].includes(collected.content))
                        return message.edit(`**${wanted.username}**: Cancelled marriage with <@${msg.sender.id}>`);
                    else if (!collected.content)
                        return message.edit(`**${msg.sender.username}**: Sorry, their slience said no.`);
                    else {
                        await bot.r.table('users').get(wanted.id).update({ marriage: { is: true, to: msg.sender.id } }).run();
                        bot.r.table('users').get(msg.sender.id).update({ marriage: { is: true, to: wanted.id } }).run();
                        return message.edit(stripIndents`
                            :sparkling_heart: <@${msg.sender.id}> and <@${wanted.id}> are happlied married! :sparkling_heart:
                            When is the honeymoon? I want to know too! >~<
                        `);
                    }
                }
            }
        },
        {
            command: 'divorce',
            description: 'W-what! You want to divorce, sure I guess...',
            usage: '<user>',
            aliases: ['break-up'],
            async run(bot, msg) {
                if (!msg.args[0])
                    return msg.reply(`**${msg.sender.username}**: You must provide your loved one!`);

                const wanted = await bot.finder.user(msg.args[0]);
                const self = await bot.r.table('users').get(msg.sender.id).run();
                const loved = await bot.r.table('users').get(wanted.id).run();

                if (!loved.marriage.is)
                    return msg.reply(`**${msg.sender.username}**: So, you think I'm stupid huh? **${wanted.username}** isn't even married!`);
                else if (loved.marriage.to !== msg.sender.id)
                    return msg.reply(`**${msg.sender.username}**: Stop thinking I'm stupid! I'm not ok, but anyway that's not even your loved one...`);
                else if (!self.marriage.is)
                    return msg.reply(`**${msg.sender.username}**: Why do you think I'm stupid! You're not even married...`);
                else {
                    await bot.r.table('users').get(msg.sender.id).update({ marriage: { is: false, to: null } }).run();
                    bot.r.table('users').get(wanted.id).update({ marriage: { is: false, to: null } }).run();
                    return msg.reply(stripIndents`
                        :broken_heart: <@${wanted.id}> and <@${msg.sender.id}> have broken up... :broken_heart:
                        I shipped them so hard though... :(
                    `);
                }
            }
        }
    ]
});