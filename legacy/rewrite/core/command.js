module.exports = class MaikaCommand {
    /**
     * Construct the Maika command class
     * 
     * @param {CommandInfo} info The command info
     */
    constructor(info) {
        this.command = info.command;
        this.description = info.description;
        this.usage = info.usage || '';
        this.category = info.category || {
            name: 'Generic',
            emoji: 'ℹ'
        };
        this.aliases = info.aliases || [];
        this.checks = info.checks || {
            guild: false,
            hidden: false,
            owner: false,
            disabled: false
        };
        this.fn = info.run;
        this.permissions = info.permissions;
        this.userPermissions = info.userPerms;
    }

    /**
     * Pre-execute the command
     * 
     * @param {import('./client')} bot The bot client
     * @param {import('./message')} msg The command message
     */
    async execute(bot, msg) {
        await this.fn(bot, msg);
    }

    /**
     * Gets the node string
     */
    get node() {
        return `${this.category.name.toLowerCase()}.${this.command}`;
    }

    /**
     * Gets a command category's emoji
     * 
     * @static
     */
    static get emojis() {
        return {
            Characters: '<:MeguLove:522281101843234837>',
            Discord: '<:discord:514626557277503488>',
            Fun: ':tada:',
            Generic: 'ℹ',
            Misc: ':laughing:',
            Search: ':mag:',
            Settings: ':gear:',
            Utility: ':pick:',
            Weeb: '<:smug:409200655505424384>'
        };
    }

    /**
     * The command in string form
     * @returns {string}
     */
    toString() {
        return `Command<${this.command}>`;
    }

    /**
     * Returns a JSON form of the command
     */
    toJSON() {
        return {
            command: this.command,
            description: this.description,
            usage: this.usage || '',
            category: this.category || {
                name: 'Generic',
                emoji: 'ℹ'
            },
            aliases: this.aliases || [],
            checks: this.checks || {
                guild: false,
                hidden: false,
                owner: false,
                disabled: false
            },
            node: this.node
        };
    }
};

/**
 * @typedef {Object} CommandInfo
 * @prop {string} command The command name
 * @prop {DescriptionSupplier | string} description The command description
 * @prop {string} [usage] The command usage
 * @prop {CommandCategory} [category] The command category object
 * @prop {string[]} [aliases=[]] The command aliases
 * @prop {object} [checks] The command checks
 * @prop {boolean} [checks.owner=false] Whenther or not the command should be executed by the owners
 * @prop {boolean} [checks.guild=false] Whenther or not the command should be executed in a Discord guild/server
 * @prop {boolean} [checks.hidden=false] Whenther or not the command should be hidden from the help command
 * @prop {boolean} [checks.disabled=false] Whenther or not the command should be disabled
 * @prop {Permission[]} [permissions] The needed permissions for Maika
 * @prop {Permission[]} [userPerms] The needed permissions for the current sender
 * @prop {(client: import('./client'), msg: import('./message')) => Promise<void>} run The run function
 */

/**
 * @typedef {(client: import('./client')) => string} DescriptionSupplier
 */

/**
 * @typedef {Object} CommandCategory
 * @prop {string} name The command category name (If no name was described, the name would be Generic)
 * @prop {string} emoji The command category emoji (If it's blank, it returns the Generic's emoji)
 */

/**
 * @typedef {"createInstantInvite" | "kickMembers" | "banMembers" | "administrator" | "manageChannels" | "manageGuild" | "addReactions" | "viewAuditLogs" | "voicePrioritySpeaker" | "readMessages" | "sendMessages" | "sendTTSMessages" | "manageMessages" | "embedLinks" | "attachFiles" | "readMessageHistory" | "mentionEveryone" | "externalEmojis" | "voiceConnect" | "voiceSpeak" | "voiceMuteMembers" | "voiceDeafenMembers" | "voiceUseVAD" | "changeNickname" | "manageNicknames" | "manageRoles" | "manageWebhooks" | "manageEmojis"} Permission
 */