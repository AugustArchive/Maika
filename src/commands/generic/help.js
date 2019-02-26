const { 
    Command,
    Util: {
        isFunction
    }
} = require('@maika.xyz/kotori');

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'help',
            description: (client) => `Gives a full list of ${client.user.tag}'s commands or gives documentation on a command`,
            usage: '[command]',
            aliases: ['halp', 'h', '?', 'commands', 'cmds']
        });
    }

    /**
     * Run the `help` command
     * @param {import('@maika.xyz/kotori').CommandContext} context The command context
     */
    async run(context) {
        if (context.args.isEmpty(0)) {
            /** @type {Object<string, string[]>} */
            const categories = {};
            const settings   = await context.guildSettings.get(context.guild.id);
            for (let command of this.client.manager.commands.values()) {
                if (command.hidden) continue;

                const category = categories[command.category];
                if (!category) categories[command.category] = [];
                console.log(category);
                category.push(command.command);
            }
            return context.embed({
                title: await context.translate('COMMAND_HELP_TITLE', this.client),
                description: await context.translate('COMMAND_HELP_DESCRIPTION', settings.prefix, context.guild.name),
                fields: Object.keys(categories).map(cat => ({ name: `❯ ${cat}`, value: `\`${categories[cat].join('`, `')}\`` })),
                footer: {
                    text: await context.translate('COMMAND_HELP_FOOTER', settings.prefix, this.client.manager.commands.size)
                }
            });
        }

        const arg = context.args.get(0);
        const command = this
            .client
            .manager
            .commands
            .filter((com) => com.command === arg || com.aliases.includes(arg));

        if (command.length > 0) {
            const cmd = command[0];
            return context.embed({
                title: await context.translate('COMMAND_HELP_COMMAND_NAME', cmd.command),
                description: isFunction(cmd.description)? cmd.description(this.client): cmd.description,
                fields: [
                    {
                        name: await context.translate('COMMAND_HELP_USAGE'),
                        value: await this.format(context),
                        inline: true
                    },
                    {
                        name: await context.translate('COMMAND_HELP_ALIASES'),
                        value: (async() => cmd.aliases.length > 1? `\`${cmd.aliases.join('`, `')}\``: await context.translate('COMMAND_HELP_ALIASES_NONE'))(),
                        inline: true
                    }
                ]
            });
        } else return context.send(await context.translate('COMMAND_HELP_COMMAND_NOT_FOUND', arg));
    }
}