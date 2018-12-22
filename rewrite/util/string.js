module.exports = class StringUtil {
    /**
     * Truncates the string provided to be shorter
     * 
     * @param {string} string The string to truncate
     * @param {number} [length=2000] The length to truncate from
     * @returns {string} The truncated string (e.g: `mememeem...`)
     */
    static elipisis(string, length = 2000) {
        return (
            string.length > length ? `${string.substr(0, length - 3)}...` : string
        );
    }

    /**
     * Formats the memory
     * 
     * @param {number} bytes The byte number
     * @returns {string} The formatted string
     */
    static formatMemory(bytes) {
        const KB = bytes / 1024;
        const MB = KB / 1024;
        const GB = MB / 1024;

        if (KB < 1024)
            return `${KB.toFixed(2)}KB`;
        if (KB > 1024 && MB < 1024)
            return `${MB.toFixed(2)}MB`;
        return `${GB.toFixed(2)}GB`;
    }
};