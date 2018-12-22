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
        let helpString = '';
        const prefix = client.settings.get(ctx.guild.id, 'prefix', process.env.MAIKA_PREFIX);
        if (!ctx.args[0]) {
            client.registry.commands.filter(s => !s.checks.hidden).forEach((command) => {
                if (!(command.category.name in categories))
                    categories[command.category.name] = [];
                categories[command.category.name].push(command.command);
            });

            for (const cat in categories)
                helpString += `${DESCRIPTION} **${cat}**: ${categories[cat].map(s => `\`${s}\``).join(', ')}\n`;

            return ctx.embed({
                title: `[ ${client.user.username}#${client.user.discriminator}'s Commands ]`,
                description: stripIndents`
                    :pencil: **Use ${prefix}<command> to execute a command.**
                    :information_source: **Use ${prefix}help [command] to look up documentation for that specific command.**

                    ${helpString}
                `,
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
                    }
                ],
                color: client.color
            });
        } else return ctx.reply(`Sorry but \`${ctx.args[0]}\` doesn't exist! You trash human.`);
    }
});