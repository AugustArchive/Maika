module.exports = class ArrayUtil {
    /**
     * Truncate an Array by pieces
     * @param {string[]} arr The array
     * @param {number} [length=50] The length to truncate
     * @returns {string[]}
     */
    static truncate(arr, length = 50) {
        if (!Array.isArray(arr))
            throw new SyntaxError(`${arr} is not an array.`);

        if (arr.length > length) {
            const previous = arr.length - length;
            arr = arr.slice(0, length);
            arr.push(`${previous} more...`);
        }

        return arr;
    }
};