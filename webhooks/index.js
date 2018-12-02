const express = require('express');
const winston = require('winston');
const crypto  = require('crypto');
const fetch   = require('node-fetch');

const app    = express();
const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.colorize({ level: true }),
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf(i => `[WebhookServer] [${i.level}] >> ${i.message}`)
    )
});
const r       = require('rethinkdbdash')({ db:'Maika', host:'127.0.0.1', port:28015});
const utils   = {
    add: (body) => {
        const user = body.included.find(i => i.type === 'user');
        if (
            !user.attributes.social_connections ||
            !user.attributes.social_connections.discord ||
            !user.attributes.social_connections.discord.user_id
        ) return;
        r.table('donators').insert({ id: user.attributes.social_connections.discord.user_id, amount: body.data.attributes.currently_entities_amount_cents / 100, started: body.data.attributes.pledge_relationship_start || r.now(), declined: null }, { conflict: 'update' }).run();
        r.table('users').get(user.attributes.social_connections.discord.user_id).update({ donator: true }).run();
        fetch(process.env.DONATOR_LOG, {
            method: 'POST',
            body: [{
                description: `User <@${user.attributes.social_connections.discord.user_id}> has donated $${body.data.attributes.currently_entities_amount_cents / 1000}. :sparkling_heart:`
            }]
        });
    },
    remove: (body) => {
        const user = body.included.find(i => i.type === 'user');
        if (
            !user.attributes.social_connections ||
            !user.attributes.social_connections.discord ||
            !user.attributes.social_connections.discord.user_id
        ) return;
        r.table('users').get(user.attributes.social_connections).update({ donator: false }).run();
        return r.table('donators').get(user.attributes.social_connections.discord.user_id).delete().run();
    },
    update: async (body) => {
        const user = body.included.find(i => i.type === 'user');
        let d;
        if (
            user.attributes.social_connections &&
            user.attributes.social_connections.discord &&
            user.attributes.social_connections.discord.user_id
        ) d = await r.table('donators').get(user.attributes.social_connections.discord.user_id).run();
        return r.table('donators').get(user.attributes.social_connections.discord.user_id).update({ amount: body.data.attributes.currently_entities_amount_cents / 100 }).run();
    },
    fromPatreon: (req) => {
        let hash = req.headers['x-patreon-signature'];
        let hmac = crypto.createHmac('md5', process.env.PATREON_WEBHOOK_SECRET);

        hmac.update(req.body);
        let crypted = hmac.digest('hex');
        return crypted === hash;
    }
};

app
    // credit: Dank-Memer/webhook-server
    .post('/patreon', async(req, res) => {
        if (req.headers['x-patreon-signature']) {
            if (utils.fromPatreon(req)) {
                req.body = JSON.parse(req.body);
                if (req.headers['x-patreon-event'] === 'members:pledge:create')
                    await utils.add(req.body);
                else if (req.headers['x-patreon-event'] === 'members:pledge:delete')
                    await utils.remove(req.body);
                else if (req.headers['x-patreon-event'] === 'members:pledge:update')
                    await utils.update(req.body);

                res.status(200).json({status:200});
            } else
                res.status(401).json({status:401});
        } else
            res.status(403).json({status:403});
    }).listen(5580, () => logger.info('Listening on port 5580!'));