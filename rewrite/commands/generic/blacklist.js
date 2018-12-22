const Command = require('../../core/command');

module.exports = new Command({
    command: 'blacklist',
    description: "Blacklist or whitelist a user from using Maika.",
    usage: '<user>',
    run: async(client, msg) => {
        const blacklist = client.settings.get(msg.guild, 'blacklist', []);
        if (!msg.args[0])
            return msg.reply("Missing the `user` argument.");
        
        const user = await client.rest.getUser(msg.args[0]);
        if (blacklist.includes(user.id)) {
            const i = blacklist.indexOf(user.id);
            blacklist.splice(i, 1);
            await client.settings.set(msg.guild, 'blacklist', blacklist);
            msg.reply(`User **${user.username}** has been removed from the blacklist.`);
        }

        blacklist.push(user.id);
        await client.settings.set(msg.guild, 'blacklist', blacklist);
        msg.reply(`User **${user.username}** has been added from the blacklist.`);
    }
});