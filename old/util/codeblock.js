/**
 * Converts text into codeblocks
 * @param {string} lang The language
 * @param {string} content The content to send
 * @returns {string} The content into a codeblock
 */
module.exports = (lang, content) => `\`\`\`${lang || null}\n${content}\`\`\``;