const axios = require('axios');

module.exports = class Alerts {
    /**
     * Construct a new Alerts instance
     * @param {import('./client')} client The client
     * @param {AlertsInfo} info The information to set
     */
    constructor(client, info) {
        this.client = client;
        this.url = `https://discordapp.com/api/webhooks/${info.id}/${info.webhook}?wait=true`;
    }

    /**
     * Sends a message to it
     * @param {string} content The content to send
     * @returns {void} noop that shit kthx
     */
    async send(content) {
        await axios.post(this.url, {
            data: { content },
            headers: {
                'User-Agent': 'Maika/DiscordBot'
            }
        });
    }

    /**
     * Sends a embed to the webhook
     * @param {import('eris').EmbedOptions} content The embed to send
     * @returns {void} noop.
     */
    async embed(content) {
        const newEmbed = Object.assign({
            color: this.client.color
        }, content);

        await axios.post(this.url, {
            data: { embeds: newEmbed },
            headers: {'User-Agent': 'Maika/DiscordBot'}
        });
    }
};

/**
 * @typedef {Object} AlertsInfo
 * @prop {string} id The webhook ID
 * @prop {string} token The webhook token
 */