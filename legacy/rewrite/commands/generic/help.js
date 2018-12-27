const Command = require('../../core/command');
const { isFunction } = require('../../util/other');
const { stripIndents } = require('common-tags');
const { TITLE, DESCRIPTION } = require('../../util/embed-titles');

module.exports = new Command({
    command: 'help',
    aliases: ['commands', 'cmds', 'halp', 'h', '?'],
    description: (client) => `Grabs documentation about any command or gives a list of ${client.user.username}'s commands.`,
    usage: '[command]',
    run: async(client, ctx) => {
        let categories = {};

        const prefix = client.settings.get(ctx.guild.id, 'prefix', process.env.MAIKA_PREFIX);
        if (!ctx.args[0]) {
            for (const c of client.registry.commands.values()) {
                if (c.checks.owner && !client.owners.includes(ctx.sender.id))
                    continue;

                let cat = categories[c.category.name];
                if (!cat)
                    cat = categories[c.category.name] = [];

                cat.push(c.command);
            }

            return ctx.embed({
                author: {
                    name: 'Commands List',
                    icon_url: client.user.avatarURL
                },
                description: stripIndents`
                    ${DESCRIPTION} **Use \`${prefix}help [command]\` to view documentation on a command.**
                    ${DESCRIPTION} **Use \`${prefix}<command>\` to execute a command.**
                `,
                fields: Object.keys(categories).map(s => ({
                    name: `${TITLE} ${s} [${categories[s].length}]`, value: categories[s].map(s => `\`${s}\``).join(', '), inline: false
                })),
                color: client.color
            });
        }

        const command = client.registry.commands.filter(s => s.command === ctx.args[0] && !s.checks.hidden);
        if (command.length > 0) {
            const c = command[0];
            return ctx.embed({
                title: `Command ${c.command}`,
                description: `${isFunction(c.description) ? c.description(client) : c.description} ${c.checks.guild ? " (Usable only in guilds)" : ''}`,
                fields: [
                    {
                        name: `${TITLE} Usage`, value: `${prefix}${c.command}${c.usage ? ` ${c.usage}` : ''}`, inline: true
                    },
                    {
                        name: `${TITLE} Category`, value: c.category.name, inline: true
                    },
                    {
                        name: `${TITLE} Alias${c.aliases.length > 0 ? 'es' : ''}`, value: (() => (c.aliases.length > 0 ? c.aliases.join(', ') : 'None'))(), inline: true
                    }
                ],
                color: client.color
            });
        } else return ctx.reply(`Sorry but \`${ctx.args[0]}\` doesn't exist! You trash human.`);
    }
});