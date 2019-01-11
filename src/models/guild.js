'use strict';

const { Schema } = require('mongoose');
module.exports = {
    name: 'guilds',
    schema: new Schema({
        guildID: { type: String, default: null },
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
            channelID: { type: String, default: null }
        },
        logging: {
            enabled: { type: Boolean, default: false },
            channelID: { type: String, default: null }
        },
        // TODO: Leveling System (better (or worst idk) then MEE6)
        leveling: {
            enabled: { type: Boolean, default: false },
            // If it should say the message that a user leveled up.
            sendMessage: { type: Boolean, default: false }
        },
        tags: { type: Array, default: [] },
        blacklist: {
            is: { type: Boolean, default: false },
            reason: { type: String, default: null }
        }
    })
};