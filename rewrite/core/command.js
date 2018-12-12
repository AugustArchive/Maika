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
        return `[${this.category.emoji}] ${this.category.name.toLowerCase()}.${this.command}`;
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
            category: {
                name: 'Generic',
                emoji: 'ℹ'
            },
            aliases: [],
            checks: {
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
 * @prop {string} description The command description
 * @prop {string} [usage] The command usage
 * @prop {object} [category] The command category object
 * @prop {string} [category.name="Generic"] The command category name (If no name was described, the name would be Generic)
 * @prop {string} [category.emoji='ℹ'] The command category emoji (If it's blank, it returns the Generic's emoji)
 * @prop {string[]} [aliases=[]] The command aliases
 * @prop {object} [checks] The command checks
 * @prop {boolean} [checks.owner=false] Whenther or not the command should be executed by the owners
 * @prop {boolean} [checks.guild=false] Whenther or not the command should be executed in a Discord guild/server
 * @prop {boolean} [checks.hidden=false] Whenther or not the command should be hidden from the help command
 * @prop {boolean} [checks.disabled=false] Whenther or not the command should be disabled
 * @prop {number} [ratelimit=3] The command ratelimit to be executed
 * @prop {(bot: import('./client'), msg: import('./message')) => Promise<void>} run The run function
 */