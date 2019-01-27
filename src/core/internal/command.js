module.exports = class MaikaCommand {
    /**
     * Construct a new Command instance
     * @param {CommandInfo} info The command info
     */
    constructor(info) {
        this.command = info.command;
        this.description = info.description;
        this.usage = info.usage || '';
        this.aliases = info.aliases || [];
        this.guild = info.guild || false;
        this.owner = info.owner || false;
        this.disabled = info.disabled || false;
        this.permissions = info.permissions || [];
        this.run = info.run;
    }
}

/**
 * @typedef {Object} CommandInfo
 * @prop {string} command The command name
 * @prop {string | DescriptionSupplier} description The command description
 * @prop {string} [usage=''] The command usage
 * @prop {import('./plugin').CommandAlias} [aliases=[]] The command aliases, returns an Array of no aliases were found
 * @prop {number} [throttle=3] The command cooldown number, returns 3 as it's default throttle number
 * @prop {boolean} [owner=false] If the command should be ran by the developers
 * @prop {boolean} [guild=false] If the command should be ran in a Discord server.
 * @prop {import('./plugin').Permission[]} [permissions=[]] Any user permissions to check before processing a command
 * @prop {boolean} [disabled=false] If the command should't be registered.
 * @prop {import('./plugin').CommandRun} run The run function
 */

/**
 * @typedef {(client: import('./client')) => string} DescriptionSupplier
 */