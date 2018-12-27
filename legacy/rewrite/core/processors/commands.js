const Processor          = require('../processor');
const CommandMessage     = require('../message');

module.exports = class CommandProcessor extends Processor {
    /**
     * Processor that processes all of the commands
     * 
     * @param {import('../client')} bot The bot client
     */
    constructor(bot) {
        super(bot);
    }

    /**
     * Process all of the command related messages
     * 
     * @param {import('eris').Message} msg The message from the event emitted
     * @returns {void} A void function of the command running
     */
    async process(msg) {
        this.bot.registry.statistics.messagesSeen++;
        if (msg.author.bot || !this.bot.ready)
            return;

        const blacklist = this.isBlacklisted(msg.author);
        if (blacklist)
            return msg.channel.createMessage(`<@${msg.author.id}>, you are prohibited of using me!`);

        const guildPrefix = this.bot.settings.get(msg.channel.guild.id, 'prefix', process.env.MAIKA_PREFIX);
        let prefix;
        const mention = new RegExp(`^<@!?${this.bot.user.id}> `).exec(msg.content);
        let prefixes = [process.env.MAIKA_PREFIX, 'x!', `${mention}`, guildPrefix];

        for (const i of prefixes)
            if (msg.content.startsWith(i))
                prefix = i;

        if (!prefix)
            return;

        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift();
        const cmd = this.bot.registry.commands.filter(s => s.command === command || s.aliases.includes(command));
        const message = new CommandMessage(this.bot, msg, args);
        const permission = msg.channel.permissionsOf(this.bot.user.id);

        if (cmd.length > 0) {
            if (cmd[0].checks.guild && msg.channel.type === 1)
                return message.reply(`<@${message.sender.id}>, Please report to a Discord guild.`);
            if (cmd[0].checks.owner && !this.bot.owners.includes(message.sender.id))
                return message.reply(`<@${message.sender.id}>, You're not my owners.`);
            if (cmd[0].permissions && cmd[0].permissions.some(p => !permission.has(p)))
                this.checkPermission(msg, cmd[0], permission);
            if (cmd[0].userPermissions && cmd[0].userPermissions.some(p => !msg.channel.permissionsOf(msg.author.id).has(p)))
                this.checkUserPermission(msg, cmd[0]);

            try {
                this.bot.registry.statistics.commandsExecuted++;
                this.bot.registry.statistics.commandUsages[cmd[0].command] = (this.bot.registry.statistics.commandUsages[cmd[0].command] || 0) + 1;
                await cmd[0].execute(this.bot, message);
            } catch(ex) {
                message.reply(`<@${msg.author.id}>, an error occured while processing the \`${cmd[0].command}\` command. Try again later!`);
                this.bot.logger.error(ex.stack);
            }
        }
    }

    /**
     * Process the blacklist
     * 
     * @param {import('eris').User} user The user
     * @returns {boolean}
     */
    isBlacklisted(user) {
        const blacklist = this.bot.settings.get('global', 'blacklist', []);
        if (blacklist.includes(user.id))
            return true;
        else
            return false;
    }

    /**
     * Checks Maika's permission
     * 
     * @param {import('eris').Message} msg The message emiited from the processor
     * @param {import('../command')} command The command
     * @param {import('eris').Permission} permission Eris' permission handler
     * @returns {void} noop :p
     */
    checkPermission(msg, command, permission) {
        const needed = command.permissions.filter(p => !permission.has(p));
        if (permission.has('sendMessages')) {
            if (needed.length > 1)
                return msg.channel.createMessage(`I'm currently lacking the following permissions: **\`${needed.map(s => s).join('`, `')}\`**.`);
            else
                return msg.channel.createMessage(`I'm currently lacking the \`${needed}\` permission.`);
        } else return this.bot.logger.warn(`Missing 'sendMessages' permission in ${msg.channel.guild.name}`);
    }

    /**
     * Checks the user's permission
     * 
     * @param {import('eris').Message} msg The message
     * @param {import('../command')} command The command
     * @returns {void} nOOP
     */
    checkUserPermission(msg, command) {
        const user = msg.channel.permissionsOf(msg.author.id);
        const needed = command.userPermissions.filter(p => !user.has(p));
        if (permission.has('sendMessages')) {
            if (needed.length > 1)
                return msg.channel.createMessage(`You currently lacking the following permissions: **\`${needed.map(s => s).join('`, `')}\`**.`);
            else
                return msg.channel.createMessage(`You currently lacking the \`${needed}\` permission.`);
        } else return this.bot.logger.warn(`Missing 'sendMessages' permission in ${msg.channel.guild.name}`);
    }
};