const GuildSchema = require('../../models/guild');

module.exports = class GuildSettings {
    /**
     * Construct a new instance of the Guild settings for any guild
     * @param {import('../internal/client')} client The client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Gets the guild settings
     * @param {string} id The guild ID
     * @returns {Promise<Settings>}
     */
    async get(id) {
        const guild = GuildSchema.findOne({ guildID: id });
        const query = await guild.lean().exec();

        if (!query)
            this.create(id);

        return query;
    }

    /**
     * Updates any guild settings
     * @param {string} guildID The guild ID
     * @param {any} obj The object to update
     * @returns {Promise<boolean>}
     */
    update(guildID, obj) {
        this
            .schema
            .updateOne({ guildID }, obj, (error, data) => {
                if (error)
                    Promise.reject(false);

                Promise.resolve(true);
            }).exec();
    }

    /**
     * Creates a new Guild settings
     * @param {string} id The guild ID
     * @returns {void} nOOOOOOOOOOOOOOOOOOOOOOOOOOOOp 
     */
    create(id) {
        const query = new GuildSchema({ guildID: id });
        query.save();
        this.client.logger.verbose(`Added guild ID ${id} to the database.`);
    }

    /**
     * Deletes the guild document (if they kicked/banned Maika)
     * @param {string} id The guild ID
     * @returns {void}
     */
    delete(id) {
        const guild = GuildSchema.findOne({ guildID: id });
        guild
            .remove()
            .exec();
    }

    get schema() {
        return GuildSchema;
    }
}

/**
 * @typedef {Object} Settings
 * @prop {string} guildID The guild ID
 * @prop {string} prefix The prefix
 * @prop {NormalSettings} reddit The reddit feed object
 * @prop {NormalSettings} twitch The twitch feed object
 * @prop {Starboard} starboard The starboard object
 * @prop {NormalSettings} modlog The modlog object
 * @prop {Social} social The social object
 * @prop {Suggestions} suggestions The suggestions system
 * @prop {string[]} blacklist The blacklist
 * @prop {Tag[]} tags The tags
 * @prop {SelfAssignable[]} selfAssignable The self assignable roles
 * @prop {string[]} autoroles The autoroles
 */

/**
 * @typedef {Object} NormalSettings
 * @prop {boolean} enabled If the feed system is enabled
 * @prop {string} channelID The channel ID to send the feed to
 */

/**
 * @typedef {Object} Starboard
 * @prop {number} threshold The threshold of stars to be posted
 * @prop {boolean} enabled If the starboard system is enabled
 * @prop {string} channelID The channel ID
 * @prop {string} emoji The emoji
 */

/**
 * @typedef {Object} Social
 * @prop {boolean} enabled If the social system is enabled
 * @prop {boolean} levelNotice If the guild allows the LEVEL UP message to the user
 * @prop {number} max The max points to give
 * @prop {number} min The mininimum points to give
 */

/**
 * @typedef {Object} Suggestions
 * @prop {boolean} enabled If the suggestions system is enabled
 * @prop {string} channelID The channel ID
 * @prop {string} yesEmoji The upvote emoji
 * @prop {string} noEmoji The downvote emoji
 */

/**
 * @typedef {Object} Tag
 * @prop {string} guildID The guild ID
 * @prop {string} userID The user that created the tag
 * @prop {string} content The content to send
 */

/**
 * @typedef {Object} SelfAssignable
 * @prop {string} name The role name
 * @prop {string} id The role ID
 */