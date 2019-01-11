const { Schema } = require('mongoose');
module.exports = {
    name: 'user',
    model: new Schema({
        userID: { type: String, default: null },
        coins: { type: Number, default: 0 },
        tags: { type: Array, default: [] },
        profile: {
            // TODO: Leveling system
            level: { type: Number, default: 0 },
            badge: { type: String, default: ':heart: **User**' },
            description: { type: String, default: 'Use `x;profile --description <desc>` to set a description!' }
        }
    })
};