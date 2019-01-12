const Router = require('../lib/router');

module.exports = class PluginsRouter extends Router {
    constructor(client) {
        super(client, '/plugins');
    }

    run() {
        this
            .router
            .get('/', (_, res) => {
                const plugins = [];
                this
                    .client
                    .manager
                    .plugins
                    .filter(s => !s.visible)
                    .forEach((plugin) => {
                        if (!plugins.includes(plugin.name))
                            plugins.push(plugin.name);
                    });
                res.render('plugins.ejs', {
                    plugins: plugins.sort((a, b) => {
                        if (a < b)
                            return 1;
                        if (b > a)
                            return -1;
                        return 0;
                    })
                });
            });
    }
}