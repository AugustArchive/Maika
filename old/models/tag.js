const mangoose = require('mongoose');

const schema = new mangoose.Schema({
    guildID: { type: String, required: true },
    userID: { type: String, required: true },
    content: { type: String, required: true }
});

module.exports = mangoose.model('tags', schema);