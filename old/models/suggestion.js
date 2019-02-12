const mangoose = require('mongoose');

const schema = new mangoose.Schema({
    guildID: String,
    userID: String,
    suggestion: String,
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    interval: { type: Number, default: 90000 }
});

module.exports = mongoose.model('suggestions', schema);