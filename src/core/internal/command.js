module.exports = class MaikaCommand {
    /**
     * Construct a new Command instance
     * @param {import('./client')} client The client
     * @param {CommandInfo} info The command info
     */
    constructor(client, info) {
        this.client = client;
        this.command = info.command;
        this.description = info.description;
        this.usage = info.usage || '';
        this.aliases = info.aliases || [];
        this.guild = info.guild || false;
        this.owner = info.owner || false;
        this.disabled = info.disabled || false;
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
 * @prop {CommandAlias} [aliases=[]] The command aliases, returns an Array of no aliases were found
 * @prop {number} [throttle=3] The command cooldown number, returns 3 as it's default throttle number
 * @prop {boolean} [owner=false] If the command should be ran by the developers
 * @prop {boolean} [guild=false] If the command should be ran in a Discord server.
 * @prop {ICommandPermission} [permissions] Any bot/user permissions that needs to be handled
 * @prop {boolean} [disabled=false] If the command should't be registered.
 */

/**
 * @typedef {Object} ICommandPermission
 * @prop {Permission[]} [bot] Maika's permissions that need to be handled
 * @prop {Permission[]} [user] The sender's permissions that needed to be handled
 */

/**
 * @typedef {(client: import('./client'), ctx: import('./context')) => IPromisedCommand} CommandRun
 * @typedef {Promise<void>} IPromisedCommand
 * @typedef {String[]} CommandAlias
 * @typedef {(client: import('./client')) => string} DescriptionSupplier
 * @typedef {"createInstantInvite" | "kickMembers" | "banMembers" | "administrator" | "manageChannels" | "manageGuild" | "addReactions" | "viewAuditLogs" | "voicePrioritySpeaker" | "readMessages" | "sendMessages" | "sendTTSMessages" | "manageMessages" | "embedLinks" | "attachFiles" | "readMessageHistory" | "mentionEveryone" | "externalEmojis" | "voiceConnect" | "voiceSpeak" | "voiceMuteMembers" | "voiceDeafenMembers"| "voiceUseVAD" | "changeNickname" | "manageNicknames" | "manageRoles" | "manageWebhooks" | "manageEmojis"} Permission
 */