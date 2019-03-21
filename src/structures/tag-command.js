const { Command } = require('@maika.xyz/kotori');
const TagBuilder  = require('../builders/tag-builder');

module.exports = class TagCommand extends Command {
    /**
     * Create a new instance of the tag command interfaces
     * @param {import('@maika.xyz/kotori').Client} client The client instance
     * @param {import('@maika.xyz/kotori').CommandOptions} info Additional info
     */
    constructor(client, info) {
        super(client, info);
    }

    /**
     * Run a tag-based command
     * @param {import('@maika.xyz/kotori').CommandContext} context The command context 
     */
    async run(context) {
        return this.runCommand(context);
    }

    /**
     * Run the command
     * @param {import('@maika.xyz/kotori').CommandContext} context The command context 
     */
    runCommand(context) {
        throw new Error('runCommand(context: Kotori.CommandContext) was not implemented');
    }

    /**
     * Get a tag builder's instance
     * @param {string} guildID The guild ID
     * @param {string} userID The user ID
     * @returns {TagBuilder} The builder
     */
    getBuilder(guildID, userID) {
        const instance = new TagBuilder(this.client, guildID, userID);
        return instance;
    }
}