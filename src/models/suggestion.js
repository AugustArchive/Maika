const { Schema, model } = require('mongoose');
module.exports = model('suggestion', new Schema({
    guildID: String,
    userID: String,
    suggestion: String,
    users: [], // Users who voted for the suggestion using the emojis specified in `IGuildSettings.suggestions`
    upvotes: Number,
    downvotes: Number
}), 'suggestion');