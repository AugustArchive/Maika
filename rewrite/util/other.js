module.exports = class OtherUtil {
    /**
     * See if a getter is a function
     * 
     * @param {Function} fn The function
     * @returns {boolean} If it is
     */
    static isFunction(fn) {
        return (
            typeof fn === 'function'
        );
    }
};