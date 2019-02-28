const { 
    Command,
    Util: {
        isFunction
    }
} = require('@maika.xyz/kotori');
const { stripIndents } = require('common-tags');

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
        /** @type {Object<string, string[]>} */
        const categories = {};
        const settings   = await context.guildSettings.get(context.guild.id);

        if (context.args.isEmpty(0)) {
            this
                .client
                .manager
                .commands
                .forEach(com => {
                    if (!(com.category in categories)) categories[com.category] = [];
                    categories[com.category].push(com.command);
                });
            return context.embed({
                title: await context.translate('COMMAND_HELP_TITLE', this.client),
                description: await context.translate('COMMAND_HELP_DESCRIPTION', settings.prefix, context.guild.name),
                fields: Object.keys(categories).map(cat => ({ name: `❯ ${cat} [${categories[cat].length}]`, value: `\`${categories[cat].join('`, `')}\`` })),
                footer: {
                    text: await context.translate('COMMAND_HELP_FOOTER', settings.prefix, this.client.manager.commands.size),
                    icon_url: context.author.avatarURL || context.author.defaultAvatarURL
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
            context.embed({
                title: await context.translate('COMMAND_HELP_COMMAND_NAME', `${settings.prefix}${cmd.command}`),
                description: isFunction(cmd.description)? cmd.description(this.client): cmd.description,
                fields: [
                    {
                        name: await context.translate('COMMAND_HELP_USAGE'),
                        value: await cmd.format(context),
                        inline: true
                    },
                    {
                        name: await context.translate('COMMAND_HELP_ALIASES'),
                        value: cmd.aliases.length > 0? `**${cmd.aliases.join(', ')}**`: await context.translate('COMMAND_HELP_ALIASES_NONE'),
                        inline: true
                    },
                    {
                        name: await context.translate('COMMAND_HELP_CATEGORY'),
                        value: cmd.category,
                        inline: true
                    },
                    {
                        name: await context.translate('COMMAND_HELP_CHECKS'),
                        value: stripIndents`
                            **${await context.translate('COMMAND_HELP_OWNER')}**: ${cmd.ownerOnly? await context.translate('GLOBAL_YES'): await context.translate('GLOBAL_NO')}
                            **${await context.translate('COMMAND_HELP_GUILD')}**: ${cmd.guildOnly? await context.translate('GLOBAL_YES'): await context.translate('GLOBAL_NO')}
                        `
                    }
                ],
                footer: {
                    text: await context.translate('REQUESTED_BY', context.author.tag),
                    icon_url: context.author.avatarURL || context.avatar.defaultAvatarURL
                }
            });
        } else return context.send(await context.translate('COMMAND_HELP_COMMAND_NOT_FOUND', arg));
    }
}