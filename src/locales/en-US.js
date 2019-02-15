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
                INVALID_USAGE: (usage) => `:name_badge: **|** Invalid usage. \`${usage}\`.`,
                API_ERROR: (error) => `:x: **|** \`${error.message}\`. Try again later...`,

                // Commands (soon since this isn't done yET)
                COMMAND_EVAL_TOO_LONG: (url) => `:ok_hand: **|** Result was too long for a Discord embed, so I posted to hastebin!\n\`${url}\``,
                COMMAND_EVAL_SUCCESS: (ms) => `:tada: Took ${ms}ms to evaluate.`,
                COMMAND_EVAL_FAILED: (ms) => `:pensive: Took ${ms}ms to evaluate.`
            }
        });
    }
}