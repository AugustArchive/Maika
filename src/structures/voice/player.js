const { stripIndents } = require('common-tags');

module.exports = class MaikaAudioPlayer {
    /**
     * MaikaAudioPlayer constructor
     * 
     * @param {import('../client')} bot The bot client
     * @param {{ player: any; msg: import('../message'); results: any; playlist: boolean; }} options The options
     */
    constructor(bot, { player, msg, results, playlist }) {
        this.bot = bot;
        this.player = player;
        this.msg = msg;
        this.results = results;
        this.playlist = playlist;
        this.volume = 100;
        this.queue = [];

        this.next();
        this.queueSong(results, playlist);
        this.player.on('end', this.end.bind(this));
    }

    next() {
        const { track, queue, player, msg } = this;

        const track = queue[0];
        player.play(track.track);
        msg.reply(`**${msg.sender.username}**: Now Playing: \`${track.info.title}\``);
    }

    queueSong(results, playlist) {
        if (playlist) {
            this.queue.push(...results);
            this.msg.reply(`**${this.msg.sender.username}**: Queued \`${results.length}\` songs.`);
        } else {
            if (this.queue.length > 0)
                this.msg.embed({
                    title: "Added to the queue",
                    color: this.bot.color,
                    description: stripIndents`
                        :black_small_square: **Title**: ${results[0].info.title}
                        :black_small_square: **Author**: ${results[0].info.author}
                        :black_small_square: **Position**: ${this.queue.length}
                    `
                });
            this.queue.push(results[0]);
        }
    }

    end() {
        this.queue.splice(0, 1);
        if (this.queue.length > 0)
            return this.next();
        this.player.stop();
        this.bot.leaveVoiceChannel(this.player.channelId);
        this.msg.reply(`**${this.msg.sender.username}**: The queue has ended! If you enjoyed the music, consider donating to keep this bot and system alive.`);
    }

    clear() {
        this.queue = [];
        this.player.stop();
    }

    pause() { this.player.pause(true); }
    resume() { this.player.pause(false); }
    skip() { this.player.stop(); }
    volume(vol) {
        this.player.setVolume(vol);
        this.volume = vol;
    }
    get paused() { return this.player.paused; }
    get playing() { return this.queue[0]; }
    get position() { return this.player.state.position; }
};