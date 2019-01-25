const UserSchema = require('../../models/user');

module.exports = class UserSettings {
    /**
     * Construct the User settings
     * @param {import('../internal/client')} client The client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * The user schema
     */
    get schema() {
        return UserSchema;
    }

    /**
     * Gets the user settings
     * @param {string} userID The user ID
     * @returns {Settings}
     */
    async get(userID) {
        const user = await this.schema.findOne({ userID })
            .lean()
            .exec();

        if (!user)
            this.create(userID);

        return user;
    }

    /**
     * Creates the user's schema
     * @param {string} id The user id
     * @returns {void}
     */
    create(id) {
        const user = new this.schema({ userID: id });
        user.save();
        this.client.logger.verbose(`Added user ${this.client.users.get(id).username} to the database.`);
    }

    /**
     * Updates the user's schema
     * @param {string} id The user ID
     * @param {any} document THe document to update
     * @returns {Promise<boolean>}
     */
    update(id, document) {
        return new Promise((resolve, reject) => {
            this
                .schema
                .update({ userID: id }, document, (error) => {
                    if (error)
                        reject(false);

                    resolve(true);
                }).exec();
        });
    }
};

/**
 * @typedef {Object} Settings
 * @prop {string} userID The user id
 * @prop {number} coins The number of coins the user has
 * @prop {import('./guild-settings').Tag[]} tags The array of tags
 * @prop {string} locale The user's locale
 * @prop {Profile} profile The profile 
 */

/**
 * @typedef {Object} Profile
 * @prop {number} level Their level
 * @prop {string} badge THe badge
 * @prop {number} points THe number of points the user has
 * @prop {string} description The description
 */