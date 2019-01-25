module.exports = class MaikaLanguage {
    /**
     * Construct a new language instance
     * @param {LanguageOptions} options The language options
     */
    constructor(options) {
        this.map = options.map;
        this.name = options.name;
        this.code = options.code;
        this.flag = options.flag;
        this.translator = options.translator;
        this.completion = `${options.completion}%`;
    }
}

/**
 * @typedef {Object} LanguageOptions
 * @prop {string} name The full name
 * @prop {string} code The locale code (i.e: `en_US`)
 * @prop {string} flag The flag emote
 * @prop {string} translator The translator (i.e: `August#5820`)
 * @prop {number} completion The number of how done the locale has been
 * @prop {{ [x: string]: string }[]} map The locale map
 */