/**
 * Gets the audio player
 * 
 * @param {import('../structures/client')} bot The bot client
 * @param {import('eris').VoiceState} vs The voice state from the member
 * @param {import('eris').Guild} guild The guild object
 */
module.exports = (bot, vs, guild) => {
    const player = bot.voiceConnections.get(guild.id);
    if (player)
        return Promise.resolve(player);
    return bot.joinVoiceChannel(vs.channelID);
};