const { Collection } = require('eris');
const AudioPlayer    = require('../internal/audio/audio-player');

module.exports = class AudioManager {
    /**
     * Constructs a new Audio manager instance
     * @param {import('../internal/client')} client The client
     */
    constructor(client) {
        /**
         * The client
         * @type {import('../internal/client')}
         */
        this.client = client;

        /**
         * The players collection
         * @type {Collection<AudioPlayer>}
         */
        this.players = new Collection();
    }

    /**
     * Gets the guild's audio player
     * @param {string} guildID The guild ID
     * @returns {AudioPlayer} The player
     */
    get(guildID) {
        return this.players.get(guildID);
    }

    /**
     * Creates a new instance of the Audio player
     * @param {string} guildID The guild ID
     * @param {string} channelID The channel ID
     * @returns {void}
     */
    create(guildID, channelID) {
        const player = new AudioPlayer(this.client, guildID, channelID);
        this.players.set(guildID, player);
    }

    /**
     * Delets the guild's audio player
     * @param {string} guildID The guild ID
     * @returns {void}
     */
    destroy(guildID) {
        const player = this.get(guildID);
        player.destroy();
    }
};