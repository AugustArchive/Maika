module.exports = class StringUtil {
    /**
     * Truncate a long `string` into a shorter string
     * @param {string} str The string to truncate from
     * @param {number} [length=2000] The length to truncate; defaults to 2000.
     * @returns {string} The truncated string
     */
    static elipisis(str, length = 2000) {
        return (
            str.length > length ? `${str.substr(0, length - 3)}...`: str
        );
    }

    /**
     * Make the first letter of the word uppercase.
     * @param {string} text The text to "transform."
     * @param {string} [split=' '] A split between the args?
     * @returns {string} The first word uppercase.
     * @example
     * 
     * StringUtil.uppercase('owO'); // => OwO 
     */
    static uppercase(text, split = ' ') {
        return text
            .split(split)
            .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
            .join(' ');
    }
}