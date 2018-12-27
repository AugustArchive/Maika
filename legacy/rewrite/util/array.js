module.exports = class ArrayUtil {
    /**
     * Trims an array
     * 
     * @param {string[]} arr The array
     * @param {number} [length] The length to slice
     */
    static trim(arr, length = 1) {
        if (!Array.isArray(arr)) throw new TypeError('Must provide a valid array');
        let array = arr;
        if (array.length > length) {
          const prevLen = array.length - length;
          array = array.slice(0, length);
          array.push(`${prevLen} more...`);
        }
        
        return array;
    }

    /**
     * List an Array using conjunctions
     * 
     * @param {string[]} list The list
     * @param {string} [conj='or'] The conjunction
     * @returns {string} The string that is listed (e.g: `yes or no`)
     */
    async list(list, conj = 'or') {
        return `${list.slice(0, -1).join(', ')}${list.length > 1 ? `${list.length > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
    }
};