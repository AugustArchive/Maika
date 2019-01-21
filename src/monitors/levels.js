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
     * @param {import('../core/internal/context')} ctx Command context
     * @returns {void} NOOP
     */
    async run(ctx) {
        if (
            ctx.message.author.bot ||
            !ctx.guild ||
            !ctx.member
        ) return;

        const guild = await ctx.getGuildSettings(ctx.guild.id);
        const user = await ctx.getUserSettings(ctx.sender.id);
        const rewarded = reward(guild['social'].max, guild['social'].min);
        const current = Math.floor(0.1 * Math.sqrt(user['profile'].points));
        ctx
            .updateUserSettings({
                condition: { userID: ctx.sender.id },
                document: { profile: { points: rewarded } },
                callback: (error) => {
                    if (error)
                        ctx.send(`${this.client.emojis.NO_PERMS} **|** <@${ctx.sender.id}>, I wasn't able to reward \`${rewarded}\` points to you. :(`);

                    if (user['profile'].points < current)
                        if (guild['social'].levelNotice)
                            ctx.send(`${this.client.emojis.YAY} **|** <@${ctx.sender.id}>, you have leveled up to \`${current}\`. It's not an achivement, you baka!`);

                    ctx
                        .updateUserSettings({
                            condition: { userID: ctx.sender.id },
                            document: { profile: { level: current } },
                            callback: (error) => {
                                if (error)
                                    ctx.send(`${this.client.emojis.NO_PERMS} **|** Unable to set level.`);
                            }
                        })
                }
            });
    }
};