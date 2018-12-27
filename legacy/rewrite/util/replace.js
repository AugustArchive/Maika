/**
 * Replaces any malicious tokens out of the evaluation (only for exec/eval commands)
 * 
 * @param {import('../core/client')} bot The bot client
 * @param {string} string The string to replace
 * @returns {string} The tokens replaced with '--snip--'
 */
module.exports = (bot, string) => {
    const regex = new RegExp([
        process.env.MAIKA_TOKEN,
        process.env.WOLKE,
        process.env.PPY,
        bot.token
    ].join('|'), 'gi');
    return string.replace(regex, '--snip--');
};