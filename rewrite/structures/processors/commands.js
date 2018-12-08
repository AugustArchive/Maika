const Processor          = require('../processor');
const CommandMessage     = require('../message');
const RatelimitProcessor = require('./ratelimits');

module.exports = class CommandProcessor extends Processor {
    /**
     * The command processor is the processor to process commands
     * 
     * Methods:
     *  - `CommandProcessor.process(msg: Eris.Message) => void`: The process function is where the magic happens. It's an overidden function from the `BaseProcessor` class.
     * 
     * @param {import('../client')} bot The bot client
     */
    constructor(bot) {
        super(bot);

        this.ratelimit = new RatelimitProcessor(bot);
    }

    /**
     * Process all of the command related messages
     * 
     * @param {import('eris').Message} msg The message from the event emitted
     * @returns {void} A void function of the command running
     */
    async process(msg) {

    }
}

/*
        let prefix;
        const mention = new RegExp(`^<@!?${this.bot.user.id}> `).exec(msg.content);
        let prefixes = [process.env.PREFIX, 'x!', `${mention}`, guild.prefix];

        for (const i of prefixes)
            if (msg.content.startsWith(i))
                prefix = i;

        if (!prefix)
            return;

        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const ctx = new CommandMessage(this.bot, { msg, args, prefix });
        const command = args.shift();
        const plugin = this.plugins.filter(s => s.has(command));

        if (plugin.length < 1)
            return;

        const plug = plugin[0].get(command);

        if (plug.guild && msg.channel.type === 1)
            return ctx.reply(`**${ctx.sender.username}**: You must be in a guild to execute the **\`${plug.command}\`** command.`);
        else if (plug.owner && !this.bot.owners.includes(msg.author.id))
            return ctx.reply(`**${ctx.sender.username}**: You must be a developer to execute the **\`${plug.command}\`** command.`);

        try {
            await plug.run(this.bot, ctx);
        } catch(ex) {
            ctx.reply(`**${ctx.sender.username}**: Command **\`${plug.command}\`** has failed to run.`);
            this.bot.logger.error(ex.stack);
        }*/