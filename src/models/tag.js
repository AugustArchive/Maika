const { Schema } = require('mongoose');
module.exports = {
    name: 'tag',
    schema: new Schema({
        guildID: { type: String, default: null },
        userID: { type: String, default: null },
        content: { type: String, default: null }
    })
};
