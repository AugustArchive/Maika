const { Schema } = require('mongoose');
const Badges = require('../util/badges');
module.exports = {
    name: 'user',
    schema: new Schema({
        userID: { type: String, default: null },
        coins: { type: Number, default: 0 },
        tags: { type: Array, default: [] },
        profile: {
            level: { type: Number, default: 0 },
            badge: { type: String, default: Badges.USER },
            description: { type: String, default: 'Use `x;profile --description <desc>` to set a description!' }
        }
    })
};