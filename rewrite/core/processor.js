module.exports = class IBaseProcessor {
    /**
     * Construct the Base processor class
     * 
     * @param {import('./client')} bot The bot client
     */
    constructor(bot) { this.bot = bot; }

    /**
     * Process the class
     */
    async process(...args) { throw new SyntaxError(`IBaseProcessor requires a process(...args: any[]) function in that class.`); }
}