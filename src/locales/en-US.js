const { Language } = require('@maika.xyz/kotori');

module.exports = class EnglishUSLocale extends Language {
    constructor(client) {
        super(client, {
            code: 'en-US',
            full: 'English (United States)',
            flag: ':flag_us:',
            translator: '280158289667555328',
            completion: 100,
            map: {
                // Error-like messages
                NO_ARGS: (args) => `:name_badge: **|** Missing \`${args}\` argument.`,
                API_ERROR: (error) => `:x: **|** \`${error.message}\`. Try again later...`,

                // Commands (soon since this isn't done yET)
            }
        });
    }
}