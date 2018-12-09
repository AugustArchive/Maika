const { readdir, readdirSync } = require('fs');
const Collection               = require('../collection');
const CommandProcessor         = require('../processors/commands');

module.exports = class CommandRegistry {
    /**
     * Construct a new CommandRegistry instance
     * 
     * Methods:
     *  - `CommandRegistry.start(): void`: Start the process
     *  - `CommandRegistry.registerCommand(command: MaikaCommand): void`: Register the command
     *  - `CommandRegistry.reload(command: MaikaCommand): boolean`: Reload a command
     *  - `CommandRegistry.load(command: MaikaCommand): boolean`: Load a command
     *  - `CommandRegistry.unload(command: MaikaCommand): boolean`: Unload a command
     * 
     * @param {import('../client')} bot The bot client
     */
    constructor(bot) {
        this.bot       = bot;
        this.commands  = new Collection();
        this.processor = new CommandProcessor(bot);
    }

    /**
     * Start the command process
     */
    async start() {}

    /**
     * Reload a command
     * 
     * @param {import('../command')} cmd The command
     * @returns {boolean}
     */
    reload(cmd) {}

    /**
     * Load a command
     * 
     * @param {import('../command')} cmd The command
     * @returns {boolean}
     */
    load(cmd) {}

    /**
     * Unload a command
     * 
     * @param {import('../command')} cmd The command
     * @returns {boolean}
     */
    unload(cmd) {}
};