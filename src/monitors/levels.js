const { getPoints: reward } = require('../util/points');

module.exports = class LevelMonitor {
    /**
     * Create a new Level monitor instance
     * @param {import('../core/internal/client')} client THe client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Runs the "levels" monitor
     * @param {import('eris').Message} message THe message
     * @param {any} guild THe guild schema
     * @param {any} schema The user schema
     * @returns {void} NOOP
     */
    async run(message, guild, schema) {
        if (
            message.author.bot ||
            !message.channel.guild ||
            !message.member
        ) return;

        const points = { max: guild['social'].points.max, min: guild['social'].points.min };
        const rewardedPoints = reward(points.min, points.max);
        const currentLevel = Math.floor(0.1 * Math.sqrt(schema['profile'].points));
        await schema.update({ 'userID': message.author.id }, {
            '$set': {
                'profile.points': rewardedPoints
            }
        }, async (error) => {
            if (error)
                message.channel.createMessage('Sorry but I was unable to reward `' + rewardedPoints + '` points to you! :(');

            if (schema['profile'].points < currentLevel)
                // Disabled by default
                if (guild['social'].levelNotice)
                    message.channel.createMessage(`:tada: **|** <@${message.author.id}>, you have leveled up to \`${currentLevel}\`. It's not a birthday party for you, BAKA!`);

            await schema.update(
                {
                    'userID': message.author.id
                },
                {
                    'profile.level': currentLevel
                }, error => {
                    if (error)
                        message.channel.createMessage(':x: **|** Unable to set your level, <@' + message.author.id + '>. :(');
                }
            );
        });
    }
};