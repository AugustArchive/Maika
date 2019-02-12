const { Collection } = require('eris');
const CommandContext = require('../internal/context');
const { stripIndents } = require('common-tags');
const UserSchema = require('../../models/user');

module.exports = class pluginProcessor {
    /**
     * Create a new instance of the plugin processor to process all plugins
     * @param {import('../internal/client')} client The client
     */
    constructor(client) {
        this.client = client;
        /** @type {Collection<Collection<number>>} */
        this.ratelimits = new Collection();
    }

    /**
     * Process all the plugin commands (emitted from `messageCreate` event)
     * @param {import('eris').Message} msg The message that is from the event
     */
    async process(msg) {
        if (msg.author.bot || !this.client.ready)
            return;

        const guild = await this.client.settings.get(msg.channel.guild.id);
        const user = UserSchema.findOne({ userID: msg.author.id });
        const q = await user.lean().exec();
        if (!q) {
            const query = new UserSchema({ userID: msg.author.id });
            query.save();
            this.client.logger.verbose(`Added user ${msg.author.username} to the database!`);
        }

        let prefix;
        const mention = new RegExp(`^<@!?${this.client.user.id}> `).exec(msg.content);
        const prefixes = [process.env.MAIKA_PREFIX, 'x!', `${mention}`, guild.prefix];

        for (const i of prefixes)
            if (msg.content.startsWith(i))
                prefix = i;

        if (!prefix)
            return;

        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const message = new CommandContext(this.client, msg, args);
        const commandName = args.shift();
        const command = this.client.manager.commands.filter(s => s.command === commandName || s.aliases.includes(commandName));

        if (command[0].guild && msg.channel.type === 0)
            return message.send(`${this.client.emojis['ERROR']} **|** You must be in a guild to execute the **${command[0].command}** command.`);

        if (command[0].owner && !this.client.owners.includes(msg.author.id))
            return message.send(`${this.client.emojis['ERROR']} **|** You cannot execute the **${command[0].command}**.`);

        if (command[0].permissions.user && command[0].permissions.user.some(p => !msg.member.permission.has(p)))
            return command[0].handleUserPerms(message);

        if (command[0].permissions.bot && command[0].permissions.bot.some(p => msg.channel.guild.members.get(this.client.user.id).permission.has(p)))
            return command[0].handleBotPerms(message);

        if (!this.ratelimits.has(command.command))
            this.ratelimits.set(command.command, new Collection());

        const now = Date.now();
        const timestamps = this.ratelimits.get(command.command);
        const throttle = (command.throttle || 3) * 1000;

        if (!timestamps.has(msg.author.id)) {
            timestamps.set(msg.author.id, now);
            setTimeout(() => timestamps.delete(msg.author.id), throttle);
        } else {
            const time = timestamps.get(msg.author.id) + throttle;

            if (now < time) {
                const left = (time - now) / 1000;
                return message.embed({
                    description: `**${msg.author.username}, the command \`${command.command}\` is currently on cooldown for another ${left > 1 ? `${left.toFixed(0)} seconds.` : `${left.toFixed(0)} second.`}**`,
                    color: this.client.color,
                    footer: {
                        text: this.client.getFooter()
                    }
                });
            }

            timestamps.set(msg.author.id, now);
            setTimeout(() => timestamps.delete(msg.author.id), throttle);
        }

        try {
            await command[0].run(message);
        } catch(ex) {
            message.embed({
                description: stripIndents`
                    **Command ${command[0].command} has errored.**
                    \`\`\`js
                    ${ex.message}
                    \`\`\`
                    Contact \`August#5820\` on my discord server.
                `,
                color: this.client.color
            });
            this.client.logger.error(ex.stack);
        }
    }
}