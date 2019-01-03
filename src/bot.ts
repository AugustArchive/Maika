require('dotenv').config({ path: '../.env' });
import { Client as KotoriClient } from '@maika.xyz/kotori';
import { join } from 'path';

new KotoriClient({
    token: (process.env.MAIKA_TOKEN) as string,
    prefix: (process.env.MAIKA_PREFIX) as string,
    commands: {
        path: join(__dirname, 'commands')
    },
    events: {
        path: join(__dirname, 'events')
    },
    schemas: join(__dirname, 'schemas'),
    owners: ['280158289667555328', '229552088525438977'],
    clientOptions: {
        maxShards: 'auto',
        disableEveryone: true,
        autoreconnect: true
    },
    dbURI: (process.env.DB_URL) as string
}).start();