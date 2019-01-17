module.exports = class PointUtil {
    /**
     * Gets the current points
     * @param {number} min The minium points to receive
     * @param {number} max THe maxium number of points
     * @returns {number} The rewarded points
     */
    static getPoints(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return (
            Math.floor(Math.random() * (max - min)) + min
        );
    }
};