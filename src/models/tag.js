const { Schema, model } = require('mongoose');
module.exports = model('tag', new Schema({
    guildID: String,
    userID: String,
    content: String,
    uses: Number,
    name: String
}), 'tag');