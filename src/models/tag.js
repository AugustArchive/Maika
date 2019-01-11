'use strict';

const { Schema } = require('mongoose');
module.exports = {
    name: 'tag',
    model: new Schema({
        // The guild ID
        guildID: { type: String, default: null },

        // The user ID (for the command: tag-search <userID>)
        userID: { type: String, default: null },

        // The tag content, to actually say the tag (i.e: `x;tag <name>`)
        content: { type: String, default: null }
    })
};