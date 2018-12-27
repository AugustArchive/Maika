const Command = require('../../core/command');
const { stripIndents } = require('common-tags');

module.exports = new Command({
    command: 'discrim-info',
    aliases: ['discrim', 'discriminator'],
    description: 'Searches other users with a discrim',
    usage: '<discrim>',
    category: { name: 'Discord Information', emoji: Command.emojis.Discord },
    run: (client, msg) => {
        let discrim = '0000';
        let otherUsers = [];

        if (!msg.args[0])
            discrim = msg.sender.discriminator;
        else {
            if (isNaN(msg.args[0]) || msg.args[0].length != 4)
                return msg.reply(":x: | **An error occured while running the `discrim-info` command: `Invalid discriminator number.`**");
            else
                discrim = msg.args[0];
        }

        client
            .users
            .filter(u => u.discriminator === discrim)
            .forEach((s) => otherUsers.push(`${s.username}#**${s.discriminator}**`));

        return msg.embed({
            title: `[ Discriminator #${discrim} ]`,
            description: stripIndents`
                **Here is the list of people who have the discriminator of ${discrim}, ${msg.sender.username}~**
                
                ${otherUsers.join('\n')}
            `,
            color: client.color
        });
    }
});