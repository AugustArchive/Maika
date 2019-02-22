const TagSchema = require('../models/tag');

module.exports = class TagBuilder {
    /**
     * Tag utility builder
     * @param {import('@maika.xyz/kotori').Client} client The client
     * @param {string} userID The user ID
     * @param {string} guildID The guild ID
     */
    constructor(client, userID, guildID) {
        this.client  = client;
        this.userID  = userID;
        this.guildID = guildID;
    }

    /**
     * Creates a new tag
     * @param {string} name The name of the tag
     * @param {string} content The content to created
     * @returns {Promise<boolean>} If the tag was successful or not
     */
    async create(name, content) {
        const tag = await TagSchema.find({ name }).lean().exec();

        // If the tag name wasn't taken
        if (!tag || tag === null) {
            const query = new TagSchema({
                guildID: this.guildID,
                userID: this.userID,
                content,
                name,
                uses: 0 // The amount of users who executed the tag with `x;tag {name}`
            });
            query.save();
            return true;
        } else {
            // Returns false because:
            // The name was taken
            return false;
        }
    }

    /**
     * Deletes a tag
     * @param {string} name The name
     * @returns {Promise<boolean>}
     */
    delete(name) {
        return new Promise(async (resolve, reject) => {
            if (!name) reject(false);
            const tag = await TagSchema.findOne({ name }).lean().exec();

            if (!tag || tag === null) reject(false);
            else {
                TagSchema.remove({ name }, (error) => {
                    if (error) reject(false);
                    resolve(true);
                });
            }
        });
    }
}