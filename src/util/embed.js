const { DefaultColours } = require('./constants');

module.exports = {
    /**
     * Resolve a string
     * 
     * @param {StringResolvable} data The string, array, or any value
     * @returns {string}
     */
    string: (data) => {
        if (typeof data === 'string') return data;
        if (data instanceof Array) return data.join('\n');
        return String(data);
    },
    /**
     * Resolves a colour
     * 
     * @param {ColourResolvable} color The color
     * @returns {number}
     */
    color: (color) => {
        if (typeof color === 'string') {
            if (color === 'RANDOM') return Math.floor(Math.random() * (0xFFFFFF + 1));
            if (color === 'DEFAULT') return 0;
            color = DefaultColours[color] || parseInt(color.replace('#', ''), 16);
          } else if (color instanceof Array) {
            color = (color[0] << 16) + (color[1] << 8) + color[2];
          }
      
          if (color < 0 || color > 0xFFFFFF) throw new RangeError('COLOR_RANGE');
          else if (color && isNaN(color)) throw new TypeError('COLOR_CONVERT');
      
          return color;
    },
    /**
     * Clones a object
     * 
     * @param {Object} obj The object
     * @returns {Object}
     */
    clone: (obj) => Object.assign(Object.create(obj), obj)
};

/**
 * @typedef {string|array|*} StringResolvable
 */

/**
 * @typedef {string|number|number[]} ColourResolvable
 */