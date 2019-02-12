module.exports = class MaikaCommand {
    /**
     * Construct a new Command instance
     * @param {import('./client')} client The client
     * @param {CommandInfo} info The command info
     */
    constructor(client, info) {
        /**
         * The client
         * @type {import('./client')}
         */
        this.client = client;

        /**
         * The command name
         * @type {string}
         */
        this.command = info.command;

        /**
         * The command description
         * @type {string | DescriptionSupplier}
         */
        this.description = info.description;

        /**
         * The command usage. Use the `format` getter to format the usage.
         * @type {string}
         */
        this.usage = info.usage || '';
        
        /**
         * The command alias(es). Returns an empty array if no aliases were provided
         * @type {string[]}
         */
        this.aliases = info.aliases || [];

        /**
         * Whenever or not the command should be executed in a guild.
         * @type {boolean}
         */
        this.guild = info.guild || false;

        /**
         * Whenever or not the command should be executed by the owners
         * @type {boolean}
         */
        this.owner = info.owner || false;

        /**
         * Whenever or not the command shouldn't be added to the command collection
         * @type {boolean}
         */
        this.disabled = info.disabled || false;

        /**
         * If the command should(n't) be added to the help command
         * @type {boolean}
         */
        this.hidden = info.hidden || false;

        /**
         * The permissions. Returns an Object with `bot` & `user` being empty arrays
         * @type {ICommandPermission}
         */
        this.permissions = info.permissions || {
            user: [],
            bot: []
        };
    }

    /**
     * Runs the command
     * @param {import('./context')} ctx The command context
     * @returns {Promise<void>} A empty promise
     */
    async run(ctx) {
        throw new SyntaxError(`${this.constructor.name} is missing a run() binding.`);
    }

    /**
     * Gets the command's format
     * @returns {string} The formatted usage
     */
    get format() {
        return `${this.command}${this.usage? ` ${this.usage}`: ''}`;
    }

    /**
     * Handles the bot's permissions
     * @param {import('./context')} ctx The command context
     * @returns {void}
     */
    handleBotPerms(ctx) {
        const bot = ctx.guild.members.get(this.client.user.id);
        const permissions = this.permissions.bot.filter(perm => !bot.permission.has(perm));
        const humanized = permissions.length > 1? `the following permission: **${permissions[0]}**`: `the following permissions: **${permissions.map(s => s).map(', ')}**`;
        ctx.send(`${this.client.emojis['WARNING']} **|** I will need ${humanized}.`);
    }

    /**
     * Handles the user's permissions
     * @param {import('./context')} ctx The command context
     * @returns {void}
     */
    handleUserPerms(ctx) {
        const permissions = this.permissions.user.filter(perm => !ctx.member.permission.has(perm));
        const humanized = permissions.length > 1? `the following permission: **${permissions[0]}**`: `the following permissions: **${permissions.map(s => s).map(', ')}**`;
        ctx.send(`${this.client.emojis['WARNING']} **|** You will need ${humanized}.`);
    }
}

/**
 * @typedef {Object} CommandInfo
 * @prop {string} command The command name
 * @prop {string | DescriptionSupplier} description The command description
 * @prop {string} [category='Generic'] The category name
 * @prop {string} [usage=''] The command usage
 * @prop {string[]} [aliases=[]] The command aliases, returns an empty array if no aliases were provided
 * @prop {number} [throttle=3] The command cooldown number, returns 3 as it's default throttle number
 * @prop {boolean} [owner=false] If the command should be ran by the developers
 * @prop {boolean} [guild=false] If the command should be ran in a Discord server
 * @prop {ICommandPermission} [permissions] Any bot/user permissions that needs to be handled
 * @prop {boolean} [disabled=false] If the command should't be registered.
 * @prop {boolean} [hidden=false] If the command should be hidden from the help command.
 */

/**
 * @typedef {Object} ICommandPermission
 * @prop {Permission[]} [bot] Maika's permissions that need to be handled
 * @prop {Permission[]} [user] The sender's permissions that needed to be handled
 */

/**
 * @typedef {(client: import('./client'), ctx: import('./context')) => IPromisedCommand} CommandRun
 * @typedef {Promise<void>} IPromisedCommand
 * @typedef {(client: import('./client')) => string} DescriptionSupplier
 * @typedef {"createInstantInvite" | "kickMembers" | "banMembers" | "administrator" | "manageChannels" | "manageGuild" | "addReactions" | "viewAuditLogs" | "voicePrioritySpeaker" | "readMessages" | "sendMessages" | "sendTTSMessages" | "manageMessages" | "embedLinks" | "attachFiles" | "readMessageHistory" | "mentionEveryone" | "externalEmojis" | "voiceConnect" | "voiceSpeak" | "voiceMuteMembers" | "voiceDeafenMembers"| "voiceUseVAD" | "changeNickname" | "manageNicknames" | "manageRoles" | "manageWebhooks" | "manageEmojis"} Permission
 */