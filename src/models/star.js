const { Schema, model } = require('mongoose');
module.exports = model('star', new Schema({
    guildID: String,
    channelID: String,
    userID: String,
    stars: Number,
    users: []
}), 'star');