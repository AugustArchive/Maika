const MaikaWebsite = require('./lib/website');

/**
 * Get the webserver
 * @param {import('../src/core/internal/client')} client The client
 */
module.exports = (client) => new MaikaWebsite(client);