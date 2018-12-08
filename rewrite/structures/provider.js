const { Collection } = require('eris');

module.exports = class MaikaProvider {
    /**
     * The Maika provider constructor
     * 
     * @param {import('sequelize').Model} table The table name
     */
    constructor(table, { id = 'guildID', data } = {}) {
        this.table = table;
        this.columns = {
            id,
            data
        };
        this.items = new Collection();
    }

    async init() {
        const rows = await this.table.findAll();
        for (const r of rows)
            this.items.set(r[this.columns.id], r[this.columns.data]);
    }

    /**
     * Gets a value
     * 
     * @param {string} id The ID
     * @param {string} key The key to get the value
     * @param {string} defaultValue The default value
     * @returns {any}
     */
    get(id, key, defaultValue) {
        if (this.items.has(id)) {
            const item = this.items.get(id);
            const val  = item[key];
            return val == null ? defaultValue : val;
        }

        return defaultValue;
    }

    /**
     * Sets a value
     * 
     * @param {string} id The ID
     * @param {string} key The key to get the value
     * @param {string} value The value
     * @returns {import('bluebird')<boolean>}
     */
    set(id, key, value) {
        const d = this.items.get(id) || {};
        d[key] = value;
        this.items.set(id, data);

        if (this.columns.data)
            return this.table.upsert({
                [this.columns.id]: id,
                [this.columns.data]: d
            });
        
        return this.table.upsert({
            [this.columns.id]: id,
            [key]: value
        });
    }

    /**
     * Deletes a key
     * 
     * @param {string} id The ID
     * @param {string} key The key to get the value
     * @returns {import('bluebird')<boolean>}
     */
    delete(id, key) {
        const d = this.items.get(id) || {};
        delete d[key];

        if (this.columns.data)
            return this.table.upsert({
                [this.columns.id]: id,
                [this.columns.data]: d
            });
        
        return this.table.upsert({
            [this.columns.id]: id,
            [key]: null
        });
    }

    clear(id) {
        this.items.delete(id);
        return this.table.destroy({ where: { [this.columns.id]: id } });
    }
};