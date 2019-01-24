module.exports = class AudioPlayer {
    /**
     * Construct a new Audio player
     * @param {import('../client')} client The client
     * @param {string} guildID The guild ID
     * @param {string} channelID The channel ID
     */
    constructor(client, guildID, channelID) {
        this.client = client;
        /** @type {LavalinkTrack[]} */
        this.queue = [];
        this.repeat = false;
        this.player = this.client.lavalink.get(guildID);
        this.guildID = guildID;
        this.channelID = channelID;
    }

    /**
     * If the player is playing
     * @returns {boolean}
     */
    get playing() {
        return this.player.playing;
    }

    /**
     * If the player is paused
     * @returns {boolean}
     */
    get paused() {
        return this.player.paused;
    }

    /**
     * If the bot is busy to play
     * @returns {boolean}
     */
    get busy() {
        return this.playing || this.paused;
    }

    /**
     * Gets the channel
     * @returns {import('eris').AnyGuildChannel} 
     */
    get channel() {
        return this.client.guilds.get(this.guildID).channels.get(this.channelID);
    }

    /**
     * Enqueues a track
     * @param {LavalinkTrack} track The track that Lavalink provided
     * @param {boolean} [unshift=false] Unshifts the queue, defaults to false
     * @returns {void}
     */
    enqueue(track, unshift = false) {
        if (unshift)
            this.queue.unshift(track);
        else
            this.queue.push(track);

        return this.play();
    }

    /**
     * Pauses the song
     * @returns {void}
     */
    pause() {
        return this.player.pause(true);
    }

    /**
     * Resumes the track
     * @returns {void}
     */
    resume() {
        return this.player.pause(false);
    }

    /**
     * Skips the song that Maika is playing
     */
    skip() {
        this.player.stop();
    }

    /**
     * Ends the audio player
     */
    destroy() {
        this.client.audio.destroy(this.guildID);
        this.stop();
        this.player.destroy();
        this.sendMessage(`${this.client.emojis.INFO} **|** Thanks for playing music with me! If you want more bandwith & more nodes in other countries, consider donating! Use the "donate" command for more info. (Donating is optional, not required)`);
    }

    /**
     * Sets the volume
     * @param {number} vol The volume
     * @returns {void}
     */
    setVolume(vol) {
        this.player.setVolume(vol);
    }
}

// Credit for Type Definitions: https://github.com/ParadoxalCorp/felix-production/blob/master/structures/HandlersStructures/MusicConnection.js#L10
/**
 * @typedef {Object} ILavalinkTrack
 * @prop {string} identifier The unique identifier of the track, as defined by the provider (youtube, soundcloud..)
 * @prop {boolean} isSeekable Whether the use of the seek method is possible
 * @prop {string} author The name of the author of the track
 * @prop {number} length The duration of the track in milliseconds
 * @prop {boolean} isStream Whether the track is a live-stream
 * @prop {number} position The current position of the player in the track, represented in milliseconds
 * @prop {string} title The title of the track
 * @prop {string} uri The URL to the track 
 */

/**
 * @typedef {Object} LavalinkTrack
 * @prop {string} name The base 64 encoded track name
 * @prop {ILavalinkTrack} track The track information
 */