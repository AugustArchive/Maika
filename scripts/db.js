const r         = require('rethinkdbdash')({ db: 'Maika', host: '127.0.0.1', port: 28015 });
const startedAt = Date.now();
const tables    = ['guilds', 'users', 'intervals', 'snipes', 'feeds'];

(async() => {
    Promise.all([tables.map(s => r.tableCreate(s).run())]);
    console.log(`[DatabaseScript]: Done in ${Date.now() - startedAt}ms.`);
})();