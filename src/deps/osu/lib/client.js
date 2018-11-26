const fetch                     = require('node-fetch');
const { USER_AGENT: UserAgent } = require('../../../util/constants');
const UserModel                 = require('./models/user');
const BeatmapModel              = require('./models/beatmap');

module.exports = class OsuClient {
    constructor() {
        this.options = {
            method: 'GET',
            headers: {
                'User-Agent': UserAgent
            }
        };
    }

    /**
     * Grabs a osu!user's profile
     * 
     * @param {string} user The user
     * @param {0 | 1 | 2 | 3} mode The mode number
     * @returns {Promise<UserModel>}
     */
    user(user, mode) {
        return new Promise((resolve, reject) => {
            return fetch(`https://osu.ppy.sh/api/get_user?k=${process.env.PPY}&u=${user}&m=${mode}`, this.options)
                .then(result => result.json())
                .then(data => resolve(new UserModel(data[0])))
                .catch(error => reject(new Error(error.message)));
        });
    }

    /**
     * Grabs an osu!beatmap
     * 
     * @param {string} id The beatmap ID
     * @returns {Promise<BeatmapModel>}
     */
    beatmap(id) {
        return new Promise((resolve, reject) => {
            return fetch(`https://osu.ppy.sh/api/get_beatmaps?k=${process.env.PPY}&b=${id}`)
                .then(res => res.json())
                .then(data => resolve(new BeatmapModel(data[0])))
                .catch(error => reject(new Error(error.message)));
        });
    }
};