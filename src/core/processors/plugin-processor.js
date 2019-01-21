const { Collection } = require('@maika.xyz/eris-utils');
const CommandContext = require('../internal/context');
const { stripIndents } = require('common-tags');
const GuildSchema = require('../../models/guild');
const UserSchema = require('../../models/user');

module.exports = class PluginProcessor {
    /**
     * Create a new instance of the Plugin processor to process all plugins
     * @param {import('../internal/client')} client The client
     */
    constructor(client) {
        this.client = client;
        /** @type {Collection<string, Collection<string, number>>} */
        this.ratelimits = new Collection();
    }

    /**
     * Process all the Plugin commands (emitted from `messageCreate` event)
     * @param {import('eris').Message} msg The message that is from the event
     */
    async process(msg) {
        if (msg.author.bot || !this.client.ready)
            return;

        const guildS = GuildSchema.findOne({ guildID: msg.channel.guild.id });
        const guild = await guildS.lean().exec();
        if (!guild) {
            const query = new GuildSchema({ guildID: msg.channel.guild.id });
            query.save();
            this.client.logger.verbose(`Added guild ${msg.channel.guild.name} to the database!`);
        }

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

        if (guild['social'].enabled)
            this.executeSocialMonitor(message);

        if (plugin.length < 1)
            return;

        const plug = plugin[0].getCommand(commandName);
        if (plug.guild && msg.channel.type === 1)
            return message.send(`:x: **|** You must be in a guild to run the **\`${plug.command}\`** command.`);
        
        if (plug.owner && !this.client.owners.includes(message.sender.id))
            return message.send(`:x: **|** You have inefficent permissions to execute the **\`${plug.command}\`** command. (**Developer**)`);

        if (plug.permissions && plug.permissions.some(pe => !msg.member.permission.has(pe)))
            return this.getPermissions(message, plug.command, msg.member);

        if (!this.ratelimits.has(plug.command))
            this.ratelimits.set(plug.command, new Collection());

        const now = Date.now();
        const timestamps = this.ratelimits.get(plug.command);
        const throttle = (plug.throttle || 3) * 1000;

        if (!timestamps.has(msg.author.id)) {
            timestamps.set(msg.author.id, now);
            setTimeout(() => timestamps.delete(msg.author.id), throttle);
        } else {
            const time = timestamps.get(msg.author.id) + throttle;

            if (now < time) {
                const left = (time - now) / 1000;
                message.embed({
                    description: `**${msg.author.username}, the command \`${plug.command}\` is currently on cooldown for another ${left > 1 ? `${left.toFixed(0)} seconds.` : `${left.toFixed(0)} second.`}**`,
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
            await plug.run(this.client, message);
        } catch(ex) {
            message.embed({
                description: stripIndents`
                    Command \`${plug.command}\` has failed to execute.
                    Message: **\`${ex.message}\`**
                    Report this to \`auguwu#5820\` or \`void#0001\` here: ***<https://discord.gg/7TtMP2n>***
                `,
                color: this.client.color,
                footer: { text: this.client.getFooter() }
            });
            this.client.logger.error(`Unexpected error while running the ${plug.command} command:\n${ex.stack}`);
        }
    }

    /**
     * Checks the sender's permission
     * @param {CommandContext} ctx The command context
     * @param {import('../internal/plugin').MaikaCommand} command The command
     * @param {import('eris').Member} sender The member
     */
    // TODO: not be lazy and actually name it something that it is
    getPermissions(ctx, command, sender) {
        const needed = command.permissions.filter(perm => sender.permission.has(perm));
        ctx.send(`:pencil: **|** Sorry but you will need **${needed.length > 1 ? `the following permission: ${needed}` : `the following permissions: ${needed.join(', ')}`}**.`);
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