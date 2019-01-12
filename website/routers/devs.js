const Router = require('../lib/router');

module.exports = class DevRouter extends Router {
    constructor(client) {
        super(client, '/devs');

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
                description: '(info soon)',
                role: 'Grammar Nazi, Community Manager',
                github: 'https://github.com/voiduwu',
                website: 'https://voided.pw'
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