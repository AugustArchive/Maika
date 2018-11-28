const fetch = require('node-fetch');

/**
 * Provide a Lavalink track
 * 
 * @param {string} query The query
 */
module.exports = (query) => {
    return new Promise(async(resolve) => {
        const req = await fetch(`http://${process.env.LAVALINK_HOST}:8071/loadtracks?identifier=${query}`, {
            method: 'GET',
            headers: {
                'Authorization': process.env.LAVALINK_PORT,
                'User-Agent': require('./constants').USER_AGENT
            }
        });
        const res = await req.json();
        resolve(res);
    });
};