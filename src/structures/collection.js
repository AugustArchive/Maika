module.exports = class Collection extends Map {
    constructor() { super(); }

    /**
     * Set a key to a value
     * 
     * @param {K} key The key
     * @param {V} val The value
     * @returns {Collection}
     */
    set(key, val) { super.set(key, val); }

    /**
     * Gets a value
     * 
     * @param {K} key The key
     * @returns {V}
     */
    get(key) { super.get(key); }

    /**
     * Filters out what you want
     * 
     * @param {(i: V) => boolean} fn The function
     * @returns {V}
     */
    filter(fn) {
        const results = [];
        for (let i = 0; i < results.length; i++)
            if (fn(i))
                return results[i];
        return results;
    }
};

/** @typedef {number | string} K */
/** @typedef {any} V */