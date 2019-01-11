'use strict';

const { Collection } = require('@maika.xyz/eris-utils');
const CommandContext = require('../internal/context');
const { stripIndents } = require('common-tags');

module.exports = class PluginProcessor {
    /**
     * Create a new instance of the PLugin processor to process all plugins
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
    process(msg) {
        if (msg.author.bot && !this.client.ready)
            return;

        const guild = this.client.database.m.connection.collection('guilds').findOne({ guildID: msg.channel.guild.id });
        const user = this.client.database.m.connection.collection('users').findOne({ userID: msg.author.id });

        if (!guild) {
            const guildSchema = this.client.database.schemas.get('guilds');
            const query = new guildSchema({ guildID: msg.channel.guild.id });
            query.save();
        }

        if (!user) {
            const userSchema = this.client.database.schemas.get('users');
            const uQuery = new userSchema({ userID: msg.author.id });
            uQuery.save();
        }

        let prefix;
        // A space (that represents the mention message) is there so people won't do `@Maikahelp` but `@Maika help`
        const mention = new RegExp(`^<@!?${this.client.user.id}> `).exec(msg.content);
        const prefixes = [process.env.MAIKA_PREFIX, 'x!', `${mention}`, guild.prefix];

        for (const i of prefixes)
            if (msg.content.startsWith(i))
                prefix = i;

        if (!prefix)
            return;

        // Start command process
        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const message = new CommandContext(this.client, msg, args);
        const commandName = args.shift();
        const plugin = this.client.manager.plugins.filter(pl => pl.hasCommand(commandName));

        if (plugin.length < 1)
            return;

        const plug = plugin[0].getCommand(commandName);
        if (plug.guild && msg.channel.type === 1)
            return message.send(`:x: **|** You must be in a guild to run the **\`${plug.command}\`** command.`);
        
        if (plug.owner && !['280158289667555328', '229552088525438977'].includes(msg.author.id))
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
            const embed = this.client.getEmbed();
            const time = timestamps.get(msg.author.id) + throttle;

            if (now < time) {
                const left = (time - now) / 1000;
                message.embed(
                    embed
                        .setDescription(`**${msg.author.username}, the command \`${plug.command}\` is currently on cooldown for another ${left > 1 ? `${left.toFixed(0)} seconds` : `${left.toFixed(0)} second`} left**`)
                );
            }

            timestamps.set(msg.author.id, now);
            setTimeout(() => timestamps.delete(msg.author.id), throttle);
        }

        try {
            //TODO: Probs make this a bit more efficent
            const result = await plug.run(this.client, message);

            if (!result) {
                return;
            } else if (result instanceof require('@maika.xyz/eris-utils').MessageEmbed) {
                message.embed(result);
            } else {
                return message.send(result);
            }
        } catch(ex) {
            const embed = this.client.getEmbed();
            message.embed(
                embed
                    .setDescription(stripIndents`
                        Command \`${plug.command}\` has failed to execute. This should not happen.
                        Message: **\`${ex.message}\`**
                        Report this to \`auguwu#5820\` or \`void#0001\` here: ***<https://discord.gg/7TtMP2n>***~
                    `)
            );
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
}