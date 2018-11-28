const PatreonWebhook = require('./providers/patreon');
const DBIWebhook     = require('./providers/dbi');

const dbi = new DBIWebhook();
const pat = new PatreonWebhook();

pat.start();
dbi.start();
