const mongoose = require('mongoose');

module.exports = mongoose.model('giveaways', new mongoose.Schema({
    guildID: String,
    creator: String,
    prize: String,
    timeout: Number,
    reaction: {
        type: String,
        default: '🎉'
    },
    users: [],
    goingOn: Boolean
}), 'giveaways');