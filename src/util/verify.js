/**
 * Verifies a message
 * 
 * @param {import('../structures/message')} msg The message
 * @param {number} timeout The time to timeout
 * @returns {boolean | number} 
 */
module.exports = async(msg, timeout) => {
    const message = await msg.collector.awaitMessages(
        (mes) => mes.author.id === msg.sender.id && ['yes', 'ye', 'yes!', 'yus', 'y'].includes(mes.content.toLowerCase()) || ['nu', 'no', 'nada', 'n'].includes(mes.content.toLowerCase()),
        {
            channelID: msg.channel.id,
            userID: msg.sender.id,
            timeout
        });

    if (!message.content)
        return 0;
    const choice = message.content.toLowerCase();
    if (['yes', 'ye', 'yes!', 'yus', 'y'].includes(choice))
        return true;
    if (['nu', 'no', 'nada', 'n'].includes(choice))
        return false;

    return false;
};