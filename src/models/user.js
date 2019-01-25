const mangoose = require('mongoose');
const Badges = require('../util/badges');

const schema = new mangoose.Schema({
    userID: String,
    coins: { type: Number, default: 0 },
    tags: [],
    locale: { type: String, default: 'en-US' },
    profile: {
        level: { type: Number, default: 0 },
        badge: { type: String, default: Badges.USER },
        description: { type: String, default: 'Use `x;profile --description <desc>` to set a description!' },
        points: { type: Number, default: 0 }
    }
});

module.exports = mangoose.model('users', schema);