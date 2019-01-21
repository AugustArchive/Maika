const mangoose = require('mongoose');

const schema = new mangoose.Schema({
    guildID: String,
    prefix: { type: String, default: process.env.MAIKA_PREFIX },
    reddit: {
        enabled: { type: Boolean, default: false },
        channelID: { type: String, default: null }
    },
    twitch: {
        enabled: { type: Boolean, default: false },
        channelID: { type: String, default: null }
    },
    starboard: {
        threshold: { type: Number, default: 1 },
        enabled: { type: Boolean, default: false },
        channelID: { type: String, default: null },
        emoji: { type: String, default: '⭐' }
    },
    modlog: {
        enabled: { type: Boolean, default: false },
        channelID: { type: String, default: null }
    },
    social: {
        enabled: { type: Boolean, default: false },
        levelNotice: { type: Boolean, default: false },
        max: { type: Number, default: 10 },
        min: { type: Number, default: 1 }
    },
    suggestions: {
        enabled: { type: Boolean, default: false },
        channelID: { type: String, default: null },
        yesEmoji: { type: String, default: '✅' },
        noEmoji: { type: String, default: '❌' }
    },
    tags: [],
    blacklist: [],
    selfAssignable: [],
    autoroles: []
});

module.exports = mangoose.model('guilds', schema);