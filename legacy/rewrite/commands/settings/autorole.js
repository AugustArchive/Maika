const Command = require('../../core/command');
const { stripIndents } = require('common-tags');

module.exports = new Command({
    command: 'autorole',
    description: stripIndents`
        **Setups autoroles for this guild.**

        Use the \`--add <roleID>\` flag to add an autorole
        Use the \`--remove <roleID>\` flad to remove an autorole
        Use no arguments to list any autoroles avaliable
        :warning: **User must require the \`manageGuild\` permission to set, remove, and list autoroles.**
    `,
    usage: '[--add | --remove] <roleID>',
    category: { name: 'Settings', emoji: Command.emojis.Settings },
    userPerms: ['manageGuild'],
    checks: { guild: true },
    run: async(client, msg) => {
        const autoroles = client.settings.get(msg.guild, 'autoroles', []);
        console.log(autoroles);

        if (!msg.args[0]) {
            if (autoroles.length > 0) {
                const roles = autoroles.map(s => {
                    const role = msg.guild.roles.get(s);
                    if (msg.guild.roles.has(s))
                        return role.name;
                    else
                        return '[Role was not found]';
                }).join('`, `');
                return msg.rawReply("Since you didn't reply with a subcommand, here are the autoroles avaliable:", {
                    description: `\`${roles}\``,
                    color: client.color
                });
            } else
                return msg.reply(`No autoroles were assigned in guild **${msg.guild.name}**.`);
        }

        switch (msg.args[0]) {
            case "--add": {
                if (!msg.args[1])
                    return msg.reply("Unknown `<roleID>` argument.");

                const roleID = msg.args[1];
                if (!msg.guild.roles.has(roleID))
                    return msg.reply('You sheep! The role ID `' + roleID + '` doesn\'t exist in **' + msg.guild.name + '**.');
                if (autoroles.includes(roleID))
                    return msg.reply('Role `' + roleID + '` is an autorole!');

                autoroles.push(roleID);
                console.log(autoroles);
                await client.settings.set(msg.guild, 'autoroles', autoroles).then(console.log);
                msg.reply(`Autorole **${msg.guild.roles.get(roleID).name}** was added to the list!`);
            } break;
            case "--remove": {
                if (!msg.args[1])
                    return msg.reply("Unknown `<roleID>` argument.");

                const roleID = msg.args[1];
                if (!msg.guild.roles.has(roleID))
                    return msg.reply('You sheep! The role ID `' + roleID + '` doesn\'t exist in **' + msg.guild.name + '**.');
                if (!autoroles.includes(roleID))
                    return msg.reply('Role `' + roleID + '` doesn\'t exist in the database.');

                const i = autoroles.indexOf(roleID);
                autoroles.splice(i, 1);
                await client.settings.set(msg.guild, 'autoroles', autoroles);
                msg.reply(`Autorole **${msg.guild.roles.get(roleID).name}** was removed.`);
            } break;
            default: {
                msg.reply(`Unknown subcommand: **\`${msg.args[0]}\`**. View the command's usage to see what flags are avaliable.`);
            } break;
        }
    }
});