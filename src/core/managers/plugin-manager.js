const PluginProcessor = require('../processors/plugin-processor');
const { Collection } = require('eris');
const { readdir } = require('fs');
const { join } = require('path');

module.exports = class PluginManager {
    /**
     * Creates a new Plugin manager instance to handle plugins
     * @param {import('../internal/client')} client The client
     */
    constructor(client) {
        this.client = client;
        /** @type {Collection<import('../internal/plugin')>} */
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
                    this.register(plugin, { file: f });
                } catch(ex) {
                    this.client.logger.error(`Unable to load plugin "${ex}":\n${ex.stack}`);
                }
            });
        });
    }

    /**
     * Registers the plugin (reloading / loading)
     * @param {import('../internal/plugin')} plugin The plugin
     * @param {{ file: string; }} options Any options to pass
     * @returns {void} nOOP
     */
    register(plugin, options) {
        plugin.setFile(options.file);
        if (this.plugins.has(plugin.name))
            this.client.logger.warn(`Unable to register ${plugin.name}; already registered.`);
        
        if (plugin.disabled)
            return;

        this.plugins.set(plugin.name, plugin);
        this.client.logger.info(`Loaded plugin: ${plugin.name}!`);
    }

    /**
     * Deregisters the plugin (unloading)
     * @param {import('../internal/plugin')} pl The plugin
     * @returns {boolean}
     */
    deregister(pl) {
        if (!this.plugins.has(pl.name)) {
            this.plugins.logger.warn(`Unable to deregister plugin ${pl.name}; doesn't exist.`);
            return false;
        }

        this.plugins.delete(pl.name);
        return true;
    }
}