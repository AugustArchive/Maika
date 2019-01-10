'use strict';

const PluginProcessor = require('../processors/plugin-processor');
const { Collection } = require('@maika.xyz/eris-utils');
const { readdir } = require('fs');
const { join } = require('path');

module.exports = class PluginManager {
    /**
     * Creates a new Plugin manager instance to handle plugins
     * @param {import('../internal/client')} client The client
     */
    constructor(client) {
        this.client = client;
        /** @type {Collection<string, import('../internal/plugin')>} */
        this.plugins = new Collection();
        this.processor = new PluginProcessor(client);
    }

    /**
     * Starts the plugin process
     */
    start() {
        readdir('./plugins', (error, files) => {
            if (error)
                this.client.logger.error(`Unable to load plugins:\n${error.stack}`);

            this.client.logger.info(`Now loading ${files.length} plugins!`);
            files.forEach((f) => {
                try {
                    const plugin = require(join(__dirname, '..', '..', 'plugins', f));
                    this.registerPlugin(plugin, { file: f });
                } catch(ex) {
                    this.client.logger.error(`Unable to load plugin "${ex.replace('.js', '')}":\n${ex.stack}`);
                }
            });
        });
    }

    /**
     * Registers the plugin
     * @param {import('../internal/plugin')} plugin The plugin
     * @param {{ file: string; }} [options] Any options to pass
     * @returns {void} nOOP
     */
    registerPlugin(plugin, options) {
        plugin.setFile(options.file);
        if (this.plugins.has(plugin.name))
            this.client.logger.warn(`Unable to register ${plugin.name}; already registered.`);
        
        if (plugin.disabled)
            return;

        this.plugins.set(plugin.name, plugin);
        this.client.logger.info(`Loaded plugin: ${plugin.name}!`);
    }
}