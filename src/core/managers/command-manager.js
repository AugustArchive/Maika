const CommandProcessor = require('../processors/command-processor');
const { Collection } = require('eris');
const { readdir, readdirSync } = require('fs');

module.exports = class CommandManager {
    /**
     * Creates a new command manager instance to handle commands
     * @param {import('../internal/client')} client The client
     */
    constructor(client) {
        this.client = client;
        /** @type {Collection<import('../internal/command')>} */
        this.commands = new Collection();
        this.processor = new CommandProcessor(client);
    }

    /**
     * Starts the command process
     */
    async start() {
        const categories = await readdirSync('./commands');
        for (let i = 0; i < categories.length; i++)
            readdir(`./commands/${categories[i]}`, (error, files) => {
                if (error)
                    this.client.logger.error(error.stack);

                this.client.logger.info(`Loading ${files.length} commands from the ${categories[i]} category.`);
                files.forEach(f => {
                    try {
                        const Command = require(`../../commands/${categories[i]}/${f}`);
                        const command = new Command(this.client);
                        this.register(command);
                    } catch(ex) {
                        this.client.logger.error(ex.stack);
                    }
                });
            });
    }

    /**
     * Registers a command
     * @param {import('../internal/command')} command The command to add
     */
    register(command) {
        if (this.commands.has(command.command)) {
            this.client.logger.warn(`Unable to register command ${command.command}; already registered.`);
            return;
        }

        if (command.disabled)
            return;

        this.commands.set(command.command, command);
        this.client.logger.info(`Registered command ${command.command}!`);
    }
}