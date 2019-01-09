'use strict';

const { Collection } = require('@maika.xyz/eris-utils');

module.exports = class MaikaPlugin {
    /**
     * Create a new Maika plugin instance
     * @param {PluginMeta} info The plugin meta information
     */
    constructor(info) {
        this.name = info.name;
        this.description = info.description;
        this.visible = info.visible;
        this.emoji = info.emoji;
        /** @type {Collection<string, MaikaCommand>} */
        this.commands = new Collection();
        this.file = null;

        for (let i = 0; i < info.commands.length; i++)
            this.commands.set(info.commands[i].command, info.commands[i]);
    }

    /**
     * Sets the file for reloading, loading, & unloading
     * @param {string} file The file from the file system
     * @returns {MaikaPlugin} Instance to chain
     */
    setFile(file) {
        this.file = file;
        return this;
    }

    /**
     * See if the command exist
     * @param {string} name The command name
     * @returns {boolean}
     */
    hasCommand(name) {
        return (
            this.commands.filter(c => c.command === name || c.aliases.includes(name)).length > 0
        );
    }

    /**
     * Gets the command instance
     * @param {string} name The command name
     * @returns {MaikaCommand} The command instance
     */
    getCommand(name) {
        return (
            this.commands.filter(c => c.command === name || c.aliases.includes(name))[0]
        );
    }
}

/**
 * @typedef {Object} PluginMeta
 * @prop {string} name The plugin name
 * @prop {string} description The plugin description
 * @prop {boolean} visible Should the plugin be visiable to all users?
 * @prop {string} emoji The emoji for the plugin commands
 * @prop {MaikaCommand[]} commands The array of commands to add
 */

/**
 * @typedef {Object} MaikaCommand
 * @prop {string} command The command name
 * @prop {string | DescriptionSupplier} description The command description
 * @prop {string} [usage] The command usage
 * @prop {string} [category='Generic'] The command category, returns Generic as it's default category
 * @prop {string[]} [aliases=[]] The command aliases, returns an Array of no aliases were found
 * @prop {number} [throttle=3] The command cooldown number, returns 3 as it's default throttle number
 * @prop {boolean} [owner=false] If the command should be ran by the developers
 * @prop {boolean} [guild=false] If the command should be ran in a Discord server.
 * @prop {CommandRun} run The run function
 */

/**
 * @typedef {(client: import('./client'), ctx: import('./context')) => IPromisedCommand} CommandRun
 * @typedef {Promise<string | import('@maika.xyz/eris-utils').EmbedObject | void>} IPromisedCommand
 * @typedef {(client: import('./client')) => string} DescriptionSupplier
 */