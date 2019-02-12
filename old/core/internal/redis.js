const Redis = require('ioredis');

module.exports = class RedisClient extends Redis {
    /**
     * Connects to Redis
     * @param {import('./client')} client The client
     * @param {RedisOptions} options The options
     */
    constructor(client, options) {
        super(options.uri, { password: options.password });

        this.client = client;
        this.options = options;
    }

    /**
     * Connects to the redis server
     * @returns {void}
     */
    async connect() {
        super.on('error', (error) => this.client.logger.error(error.stack));
        super.on('ready', () => this.client.logger.info('Connected to Redis!'));
    }
};

/**
 * @typedef {Object} RedisOptions
 * @prop {string} uri The URI of Redis
 * @prop {string} password The password to connect to
 * 
 * On linux, go to `/etc/redis/redis.conf` and find the `requirepass` key and set it in the `.env` file.
 * 
 * Don't use Redis on Windows, it's basically broken
 */