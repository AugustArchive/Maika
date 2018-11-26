/**
 * Resolves a user's balance
 * 
 * @param {import('../structures/client')} bot The bot client
 * @param {string} userID The user ID
 * @param {number} bal The balance to put
 * @returns {Promise<number>} The resolved balance
 */
module.exports = (bot, userID, bal) => {
    return new Promise((resolve, reject) => {
        bot.r.table('users').get(userID).run((error, user) => {
            if (error)
                return reject(error);
            
            if (user.coins) {
                bot.r.table('users').get(userID).update({ coins: user.coins + bal }).run(error => {
                    if (error)
                        return reject(error);
                    resolve(user.coins + bal);
                });
            } else {
                bot.r.table('users').get(userID).update({ coins: bal }).run(error => {
                    if (error)
                        return reject(error);
                    resolve(bal);
                });
            }
        });
    });
};