const { Collection } = require('eris');
const CommandContext = require('../internal/context');
const { stripIndents } = require('common-tags');
const UserSchema = require('../../models/user');
const { humanize: humanizePermissions } = require('../../util/permissions');

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
        const plugin = this.client.manager.plugins.filter(pl => pl.hasCommand(commandName));
        const command = plugin[0].getCommand(commandName);

        if (!command)
            return;

        if (command.guild && msg.channel.type === 1)
            return message.send(`:x: **|** You must be in a guild to run the **\`${command.command}\`** command.`);
        else if (command.owner && !this.client.owners.includes(message.sender.id))
            return message.send(`:x: **|** You have inefficent permissions to execute the **\`${command.command}\`** command. (**Developer**)`);
        else if (command.permissions && command.permissions.some(pe => !msg.member.permission.has(pe)))
            return this.hasPermission(message, command.command, msg.member);

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
            await command.run(this.client, message);
        } catch(ex) {
            message.embed({
                description: stripIndents`
                    Command \`${command.command}\` has failed to execute.
                    Message: **\`${ex.message}\`**
                    Report this to \`auguwu#5820\` or \`void#0001\` here: ***<https://discord.gg/7TtMP2n>***
                `,
                color: this.client.color,
                footer: { text: this.client.getFooter() }
            });
            this.client.logger.error(`Unexpected error while running the ${command.command} command:\n${ex.stack}`);
        }
    }

    /**
     * Checks the sender's permission
     * @param {CommandContext} ctx The command context
     * @param {import('../internal/command')} command The command
     * @param {import('eris').Member} sender The member
     */
    hasPermission(ctx, command, sender) {
        const needed = command.permissions.filter(perm => sender.permission.has(perm));
        const humanized = needed.length > 1? `the following permission: **${humanizePermissions(needed[0])}**`: `the following permissions: **${needed.map(s => humanizePermissions(s)).join(', ')}**`;
        ctx.send(`:pencil: **|** Sorry but you will need ${humanized}.`);
    }

    /**
     * Runs the "levels" system
     * @param {CommandContext} ctx The message
     * @returns {void} nOOP that shit- I mean, noop.
     */
    async executeSocialMonitor(ctx) {
        const Monitor = require('../../monitors/levels');
        const mon = new Monitor(this.client);
        await mon.run(ctx);
    }
}