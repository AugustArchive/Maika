const { readdir } = require('fs');

module.exports = class LanguageManager {
    /**
     * Construct a new Language manager instance
     * @param {import('../internal/client')} client The client
     */
    constructor(client) {
        this.client = client;

        /**
         * The locales put into one
         * @type {{ [x: string]: import('../internal/language') }[]}
         */
        this.locales = {};

        /**
         * The list of translators
         * @type {{ name: string; locales: string; }[]}
         */
        this.translators = [
            {
                name: "August",
                locales: 'en_US'
            }
        ];
        this.moustache = /\{\{\s*([\w\.]+)\s*\}\}/g;
    }

    /**
     * Start the process
     */
    start() {
        readdir('./languages', (error, files) => {
            if (error)
                this.client.logger.error(`Unable to load languages:\n${error.stack}`);

            this.client.logger.info(`Loading ${files.length} languages...`);
            files.forEach(file => {
                const language = require(`../../languages/${file}`);
                this.locales[language.code] = language;
                this.client.logger.info(`Loaded the "${language.code}" locale.`);
            });
        });
    }
}