const fetch                     = require('node-fetch');
const { USER_AGENT: UserAgent } = require('../../../util/constants');
const AnimeModel                = require('./models/anime');
const MangaModel                = require('./models/manga');

module.exports = class KitsuClient {
    constructor() {
        this.options = {
            method: 'GET',
            headers: {
                'User-Agent': UserAgent,
                Accept: 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            }
        };
    }

    /**
     * Searches anime off of kitsu
     * 
     * @param {string} search The anime title
     * @param {number} [offset] The offset number
     * @returns {Promise<AnimeModel>}
     */
    anime(search, offset = 0) {
        return new Promise((resolve, reject) => {
            const term = encodeURIComponent(search);
            return fetch(`https://kitsu.io/api/edge/anime?filter[text]="${term}"&page[offset]=${offset}`, this.options)
                .then(res => res.json())
                .then(json => resolve(new AnimeModel(json.data[0])))
                .catch(error => reject(new Error(error)));
        });
    }

    /**
     * Searches manga off of Kitsu
     * 
     * @param {string} search The anime title
     * @param {number} [offset] The offset number
     * @returns {Promise<MangaModel>}
     */
    manga(search, offset = 0) {
        return new Promise((resolve, reject) => {
            const term = encodeURIComponent(search);
            return fetch(`https://kitsu.io/api/edge/manga?filter[text]="${term}"&page[offset]=${offset}`, this.options)
                .then(res => res.json())
                .then(json => resolve(new MangaModel(json.data[0])))
                .catch(error => reject(new Error(error)));
        });
    }
};