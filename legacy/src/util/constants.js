const REGEX = (bot) => new RegExp([
    process.env.TOKEN,
    process.env.PPY,
    process.env.WOLKE,
    bot.token,
    process.env.LAVALINK_HOST,
    process.env.LAVALINK_PORT,
    process.env.LAVALINK_REGION,
    process.env.LAVALINK_PASSWORD
].join('|'), 'gi');

exports.FeedColors = {
    REDDIT: 0xFF4500
};
exports.USER_AGENT = `Maika (https://github.com/MaikaBot/Maika v${require('../../package.json').version})`;
exports.DefaultColours = {
    DEFAULT: 0x000000,
    WHITE: 0xFFFFFF,
    AQUA: 0x1ABC9C,
    GREEN: 0x2ECC71,
    BLUE: 0x3498DB,
    PURPLE: 0x9B59B6,
    LUMINOUS_VIVID_PINK: 0xE91E63,
    GOLD: 0xF1C40F,
    ORANGE: 0xE67E22,
    RED: 0xE74C3C,
    GREY: 0x95A5A6,
    NAVY: 0x34495E,
    DARK_AQUA: 0x11806A,
    DARK_GREEN: 0x1F8B4C,
    DARK_BLUE: 0x206694,
    DARK_PURPLE: 0x71368A,
    DARK_VIVID_PINK: 0xAD1457,
    DARK_GOLD: 0xC27C0E,
    DARK_ORANGE: 0xA84300,
    DARK_RED: 0x992D22,
    DARK_GREY: 0x979C9F,
    DARKER_GREY: 0x7F8C8D,
    LIGHT_GREY: 0xBCC0C0,
    DARK_NAVY: 0x2C3E50,
    BLURPLE: 0x7289DA,
    GREYPLE: 0x99AAB5,
    DARK_BUT_NOT_BLACK: 0x2C2F33,
    NOT_QUITE_BLACK: 0x23272A,
};
exports.redact = (bot, str) => str.replace(REGEX(bot), '--snip--');
exports.error = (bool) => (bool ? 0xFF0000 : 0x00FF00);
exports.clean = (str) => {
    if (typeof (str) == 'string')
        return str.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else 
        return str;
};
exports.SearchColours = {
    OSU: 0xFF66AA,
    KITSU: 0xFD8320,
    AZUR_LANE: 0x1A1917,
    GITHUB: 0xFFFFFF,
    MDN: 0x066FAD,
    REDDIT: 0xFF4500,
    ROTTEN_TOMATOES: 0xFFEC02,
    STEAM: 0x101D2F,
    TWITCH: 0x6441A4,
    VOCADB: 0x86D2D0
};
exports.Strings = {
    ERROR: (msg, ex) => `**${msg.sender.username}**: \`${ex.message}\``
};