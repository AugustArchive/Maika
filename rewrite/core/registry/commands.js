const { readdir, readdirSync } = require('fs');
const { Collection }           = require('eris');
const CommandProcessor         = require('../processors/commands');

module.exports = class CommandRegistry {
    /**
     * Construct a new CommandRegistry instance
     * 
     * @param {import('../client')} bot The bot client
     */
    constructor(bot) {
        this.bot       = bot;
        /** @type {Collection<import('../command')>} */
        this.commands  = new Collection();
        this.processor = new CommandProcessor(bot);
    }

    /**
     * Start the command process
     */
    async start() {
        const modules = await readdirSync('./commands');
        for (let i = 0; i < modules.length; i++) {
            this.bot.logger.info(`Loading module ${modules[i]}!`);
            readdir(`./commands/${modules[i]}`, (error, files) => {
                if (error)
                    this.bot.logger.error(`Cannot load module ${modules[i]}:\n${error}`);
                
                this.bot.logger.info(`Module ${modules[i]} has ${files.length} commands, now loading...`);
                files.forEach(f => {
                    try {
                        const command = require(`../../commands/${modules[i]}/${f}`);
                        if (command.checks.disabled)
                            this.bot.logger.info(`Command ${command.command} is disabled, not adding to Collection...`);

                        this.commands.set(command.command, command);
                        this.bot.logger.info(`Loaded command ${command.command}!`);
                    } catch(ex) {
                        this.bot.logger.error(`Unable to load command ${f.split('.js', '')}:\n${ex.stack}`);
                    }
                });
            });
        }
    }
};