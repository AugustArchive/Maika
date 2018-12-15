module.exports = class StringUtil {
    /**
     * Truncates the string provided to be shorter
     * 
     * @param {string} string The string to truncate
     * @param {number} [length=2000] The length to truncate from
     * @returns {string} The truncated string (e.g: `mememeem...`)
     */
    static elipisis(string, length = 2000) {
        return (string.length > length ? `${string.substr(0, length - 3)}...` : string);
    }
};