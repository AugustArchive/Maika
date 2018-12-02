/*
 * Copyright (c) 2018-present auguwu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const { Collection } = require('eris');

module.exports = class MaikaPlugin {
    /**
     * The plugin class
     * 
     * @param {MaikaPluginOptions} options The options
     */
    constructor(options) {
        this.name = options.name;
        this.visible = options.visible;
        this.embeded = options.embeded;
        this.enabled = options.enabled;
        /** @type {Collection<MaikaCommand>} */
        this.commands = new Collection();

        for (let i = 0; i < options.commands.length; i++)
            this.commands.set(options.commands[i].command, options.commands[i]);
    }

    get count() {
        return this.commands.size;
    }

    /**
     * Gets a plugin
     * 
     * @param {any} m The module
     * @returns {MaikaCommand}
     */
    get(m) {
        return this.commands.filter(c => c.command === m || c.aliases.includes(m))[0];
    }

    /**
     * If the plugin exists
     * 
     * @param {any} m The module
     * @returns {boolean}
     */
    has(m) {
        return this.commands.filter(c => c.command === m || c.aliases.includes(m)).length > 0;
    }
};

/**
 * @typedef {Object} MaikaPluginOptions
 * @prop {string} name The plugin name
 * @prop {string} embeded The plugin name but for the help embed
 * @prop {boolean} visible Whenther or not the plugin should be visiable
 * @prop {boolean} enabled If the plugin is enabled
 * @prop {MaikaCommand[]} commands The commands
 */
/**
 * @typedef {Object} MaikaCommand
 * @prop {string} command The command name
 * @prop {string} description The command description
 * @prop {string} [usage=''] The command usage
 * @prop {string} [category='Generic'] The command category
 * @prop {ICommandAliases} aliases The command aliases
 * @prop {boolean} [hidden=false] Whenther or not the command should be hidden from the help command
 * @prop {boolean} [owner=false] Whenther or not the command should be executed by the owners
 * @prop {boolean} [guild=false] Whenther or not the command should be executed in a Discord "guild"
 * @prop {IRunnableCommand} run The run function
 */
/** @typedef {(bot: import('./client'), msg: import('./message')) => Promise<void>} IRunnableCommand */
/** @typedef {string[]} ICommandAliases */