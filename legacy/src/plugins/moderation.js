const Plugin = require('../structures/plugin');

module.exports = new Plugin({
    name: 'Moderation',
    embeded: ':hammer: Moderation',
    visible: true,
    enabled: false,
    commands: [{
        command: 'ban',
        description: 'Bans a member',
        usage: '<user> [reason]',
        aliases: ['banne', 'bannerino'],
        run: async(msg) => {
            if (!msg.args[0])
                return msg.reply();
        }
    }]
});