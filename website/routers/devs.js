const Router = require('../lib/router');

module.exports = class DevRouter extends Router {
    constructor(client) {
        super(client, '/devs');

        /**
         * The developers
         * @type {DeveloperInfo[]}
         */
        this.devs = [
            {
                name: 'auguwu',
                description: '14 year old kid who likes to code and created Maika.',
                role: 'Lead Developer',
                github: 'https://github.com/auguwu',
                website: 'https://augu.me'
            },
            {
                name: 'void',
                description: '',
                role: 'Grammar Nazi, Community Manager',
                github: 'https://github.com/voiduwu'
            }
        ];
    }

    run() {
        this
            .router
            .get('/', (_, res) => res.render('developers.ejs', {
                devs: this.devs,
                user: this.client.user
            }));
    }
}

/**
 * @typedef {Object} DeveloperInfo
 * @prop {string} name The developer's online alias
 * @prop {string} description A bit about themselves
 * @prop {string} role The role they do (e.g: Lead Developer, Merchanise Manager)
 * @prop {string} [github] Their github profile
 * @prop {string} [website] Their website url
 */