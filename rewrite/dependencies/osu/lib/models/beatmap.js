module.exports = class BeatmapModel {
    constructor(data) {
        this.id = data.beatmap_id;
        this.approved = this.parseApprovedState(data.approved);
        this.cs = data.diff_size;
        this.od = data.diff_overall;
        this.ar = data.diff_approach;
        this.hd = data.diff_drain;
        this.mode = this.parseGamemode(data.mode);
        this.artist = data.artist;
        this.title = data.title;
        this.creator = data.creator;
        this.bpm = parseInt(data.bpm).toFixed();
        this.source = data.source === '' ? "None" : data.source;
        this.genre = this.parseGenre(data.genre_id);
        this.language = this.parseLanguage(data.language_id);
        this.favourites = data.favourite_count;
        this.plays = {
            passed: data.passcount,
            played: data.playcount
        };
        this.maxCombo = data.max_combo;
        this.difficulty = parseInt(data.difficultyrating).toFixed(2);
    }

    /**
     * Parses the "genre" to be a string
     * 
     * @param {string} genre The genre number
     * @returns {string}
     */
    parseGenre(genre) {
        return (
            genre === '0' ? 'Any' : genre === '1' ? 'Unspecified' : genre === '2' ? "Video Game" : genre === '3' ? 'Anime' : genre === '4' ? 'Rock' : genre === '5' ? 'Pop' : genre === '6' ? 'Other' : genre === '7' ? 'Novelty' : genre == '9' ? 'Hip Hop' : genre === '10' ? 'Electronic' : 'Unknown'
        );
    }

    /**
     * Parses the game mode of the beatmap
     * 
     * @param {string} mode The mode number
     * @returns {string}
     */
    parseGamemode(mode) {
        return (
            mode === '0' ? 'osu!standard' : mode === '1' ? 'osu!taiko' : mode === '2' ? 'osu!catch' : mode === '3' ? 'osu!mania' : 'Unknown'
        );
    }

    /**
     * Parses the language of the song's authentic vibe
     * 
     * @param {string} locale The language that the song is in
     * @returns {string}
     */
    parseLanguage(locale) {
        return (
            locale === '0' ? 'Any' : locale === '1' ? 'Other' : locale === '2' ? 'English' : locale === '3' ? 'Japanese' : locale === '4' ? 'Chinese' : locale === '5' ? 'Instrumental' : locale === '6' ? 'Korean' : locale === '7' ? 'French' : locale === '8' ? 'German' : locale === '9' ? 'Swedish' : locale === '10' ? 'Spanish' : locale === '11' ? 'Italian' : "Unknown"
        );
    }

    /**
     * Parses the approved state
     * 
     * @param {string} state The state
     * @returns {string}
     */
    parseApprovedState(state) {
        return (
            state === "4" ? "Loved" : state === "3" ? "Qualified" : state === "2" ? "Approved" : state === "1" ? "Ranked" : state === "0" ? "Pending" : state === "-1" ? "Work in Progress" : state === "-2" ? "Graveyard" : "Unknown"
        );
    }
};