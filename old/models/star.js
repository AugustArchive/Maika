const { model, Schema } = require('mongoose');

const schema = new Schema({
    guildID: String,
    userID: String,
    messageID: String,
    count: Number
});
module.exports = model('star', schema);