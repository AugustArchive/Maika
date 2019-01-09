'use strict';

module.exports = class StringUtil {
    /**
     * Truncate a long `string` into a shorter string
     * @param {string} str The string to truncate from
     * @param {number} [length=2000] The length to truncate; defaults to 2000.
     * @returns {string} The truncated string
     */
    static elipisis(str, length = 2000) {
        return (
            str.length > length ? `${str.substr(0, length - 3)}...` : str
        );
    }
}