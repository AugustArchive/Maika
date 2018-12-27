const Command = require('../../core/command');
const { stripIndents } = require('common-tags');

module.exports = new Command({
    command: 'iam',
    description: stripIndents`
        **Gets an self-assignable role and assignes it to you.**

        If there is no argument supplied, it will show the roles.
    `,
    usage: '<roleID>',
    category: { name: 'Misc', emoji: Command.emojis.Misc },
    run: async(client, msg) => {
        const roles = client.settings.get(msg.guild, 'selfroles', []);

        if (!msg.args[0]) {
            if (roles.length > 0) {
                const r = roles.map(s => {
                    const role = msg.guild.roles.get(s);
                    if (msg.guild.roles.has(s))
                        return `${role.name} (${msg.prefix}iam ${s})`;
                    return '[Role was deleted?]';
                }).join('`, `');
                return msg.embed({
                    author: {
                        name: 'Self-assignable roles for ' + msg.guild.name,
                        icon_url: client.user.avatarURL
                    },
                    description: stripIndents`
                        **Here are the current self-assignable roles that the guild owner added:**

                        \`${r}\`
                    `,
                    color: client.color
                });
            } else
                return msg.reply("Sorry, there are no self-assignable roles avaliable in **" + msg.guild.name + "**.");
        } else {
            if (roles.includes(msg.args[0]) && msg.guild.roles.has(msg.args[0])) {
                msg.member.addRole(msg.args[0], `[Maika] Added role ${msg.guild.roles.get(msg.args[0]).name}.`);
                return msg.reply(`:ok_hand: | Added role \`${msg.guild.roles.get(msg.args[0]).name}\` to you, senpai~`);
            } 
            else if (roles.includes(msg.args[0]) && msg.member.roles.includes(msg.args[0]))
                return msg.reply(':x: | You sheep! You alread have the role :anger:');
            else
                return msg.reply(':x: | An error occured while adding the role! Does it exist?');
        }
    }
});