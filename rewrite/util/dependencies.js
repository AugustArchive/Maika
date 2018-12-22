const pkg = require('../../package.json');

/**
 * Serializes the dependencies into a string
 * @returns {string} The parsed dependencies from Maika's NPM manifest
 */
module.exports = () => Object.entries(pkg.dependencies).map(s => s[0]).join(', ');