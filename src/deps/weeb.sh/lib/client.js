const fetch                     = require('node-fetch');
const { USER_AGENT: UserAgent } = require('../../../util/constants');
const RandomImageModel          = require('./models/random-image');

module.exports = class WeebClient {
    constructor() {
        this.options = {
            method: 'GET',
            headers: {
                'User-Agent': UserAgent,
                'Authorization': `Wolke ${process.env.WOLKE}`
            }
        };
    }

    /**
     * Grabs an random image
     * 
     * @param {string} type The type of the image
     * @returns {Promise<RandomImageModel>}
     */
    randomImage(type) {
        return new Promise((resolve, reject) => {
            return fetch(`https://api.weeb.sh/images/random?type=${type}`, this.options)
                .then(res => res.json())
                .then(json => resolve(new RandomImageModel(json)))
                .catch(error => reject(new Error(error)));
        });
    }
};